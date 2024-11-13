import fs from "fs";
import chalk from "chalk";
import inquirer from "inquirer";

import { EnvResult, CleanupAction } from "@/types";

async function promptForCleanup(unused: string[]): Promise<CleanupAction> {
  if (unused.length === 0) return "skip";

  console.log("");

  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What would you like to do with unused environment variables?",
    choices: [
      { name: "Keep them as is", value: "skip" },
      { name: "Remove them", value: "remove" },
      { name: "Comment them out", value: "comment" },
    ],
  });

  return action;
}

async function confirmAction(action: CleanupAction, count: number): Promise<boolean> {
  if (action === "skip") return true;

  const actionWord = action === "remove" ? "remove" : "comment out";
  const { confirmed } = await inquirer.prompt({
    type: "confirm",
    name: "confirmed",
    message: `Are you sure you want to ${chalk.blue(actionWord)} ${chalk.blue(count)} environment variables?`,
    default: false,
  });

  return confirmed;
}

function updateEnvFile(filePath: string, unused: string[], action: CleanupAction): void {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  const updatedLines = lines.map((line) => {
    const envName = line.split("=")[0]?.trim();
    if (!envName || !unused.includes(envName.replace("# ", ""))) return line;

    switch (action) {
      case "comment":
        return line.startsWith("#") ? line : `# ${line}`;
      case "remove":
        return "";
      default:
        return line;
    }
  });

  const finalContent =
    action === "remove" ? updatedLines.filter(Boolean).join("\n") : updatedLines.join("\n");

  fs.writeFileSync(filePath, finalContent);
}

function generateBackupName(basePath: string, index: number = 0): string {
  const backupPath = index === 0 ? `${basePath}.backup` : `${basePath}.backup.${index}`;

  return backupPath;
}

async function handleBackupFile(filePath: string): Promise<string> {
  const defaultBackup = `${filePath}.backup`;

  if (!fs.existsSync(defaultBackup)) {
    return defaultBackup;
  }

  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "A backup file already exists. What would you like to do?",
    choices: [
      { name: "Overwrite existing backup", value: "overwrite" },
      { name: "Create new backup file", value: "new" },
      { name: "Specify custom backup name", value: "custom" },
    ],
  });

  switch (action) {
    case "overwrite":
      return defaultBackup;

    case "custom":
      const { customName } = await inquirer.prompt({
        type: "input",
        name: "customName",
        message: "Enter backup file name:",
        default: `${filePath}.backup.custom`,
        validate: (input: string) => {
          if (!input.trim()) return "Backup file name cannot be empty";
          if (fs.existsSync(input)) return "File already exists. Please choose a different name";
          return true;
        },
      });
      return customName;

    case "new":
      let index = 1;
      let backupPath = generateBackupName(filePath, index);
      while (fs.existsSync(backupPath)) {
        index++;
        backupPath = generateBackupName(filePath, index);
      }
      return backupPath;

    default:
      throw new Error("Invalid backup action");
  }
}

async function createBackup(filePath: string): Promise<string> {
  const backupPath = await handleBackupFile(filePath);
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

export async function handleUnusedEnvs(results: EnvResult, envFile: string): Promise<void> {
  const { unused } = results;

  if (unused.length === 0) {
    console.log(chalk.green("\n✨ No unused environment variables to clean up!"));
    return;
  }

  console.log(chalk.yellow("\n🧹 Cleanup Options"));

  const action = await promptForCleanup(unused);
  if (action === "skip") {
    console.log(chalk.gray("\nSkipped cleanup. No changes made."));
    return;
  }

  const confirmed = await confirmAction(action, unused.length);
  if (!confirmed) {
    console.log(chalk.gray("\nCanceled. No changes made."));
    return;
  }

  try {
    const backupPath = await createBackup(envFile);

    updateEnvFile(envFile, unused, action);

    console.log(chalk.green("\n✨ Environment file updated successfully!"));
    console.log(chalk.gray(`Backup created at: ${chalk.blue(backupPath)}`));

    if (action === "comment") {
      console.log(chalk.gray("\nCommented out variables:"));
      unused.forEach((env) => console.log(chalk.gray(`  # ${env}`)));
    } else {
      console.log(chalk.gray("\nRemoved variables:"));
      unused.forEach((env) => console.log(chalk.gray(`  - ${env}`)));
    }
  } catch (error) {
    console.error(chalk.red("\n❌ Failed to update environment file:"), error);
    console.log(chalk.yellow("Your original file remains unchanged."));
  }
}
