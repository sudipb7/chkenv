import inquirer, { type DistinctQuestion } from "inquirer";

import { CliOptions } from "@/types";
import { COMMAND_OPTIONS, DEFAULT_OPTIONS } from "./constants";
import { showHelp, showVersion, validateCommand } from "./helpers";

export function parseArguments(args: string[]): CliOptions {
  const options = { ...DEFAULT_OPTIONS };
  const availableCommands = Object.keys(COMMAND_OPTIONS)
    .join(", ")
    // @ts-ignore
    .replaceAll(" <path>", "")
    .split(", ");

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    validateCommand(arg, availableCommands);

    switch (arg) {
      case "--help":
      case "-h":
        showHelp();
      case "--version":
      case "-v":
        showVersion();
      case "--path":
      case "-p":
        options.path = args[++i] || process.cwd();
        break;
      case "--config":
      case "-c":
        options.configFile = args[++i] || ".env.local";
        break;
      case "--all":
      case "-a":
        options.includeComments = true;
        break;
      case "--cleanup":
        options.cleanup = true;
        break;
    }
  }

  return options;
}

export async function promptForOptions(args: string[], options: CliOptions): Promise<CliOptions> {
  if (args.includes("--default") || args.includes("-d")) {
    return options;
  }

  const prompts: DistinctQuestion[] = [];

  if (!args.includes("--path") && !args.includes("-p")) {
    prompts.push({
      type: "input",
      name: "path",
      message: "Enter the directory to analyze",
      default: "./",
    });
  }

  if (!args.includes("--config") && !args.includes("-c")) {
    prompts.push({
      type: "input",
      name: "configFile",
      message: "Enter the configuration file name",
      default: ".env.local",
    });
  }

  if (!args.includes("--all") && !args.includes("-a")) {
    prompts.push({
      type: "confirm",
      name: "includeComments",
      message: "Include commented environment variables?",
      default: false,
    });
  }

  if (prompts.length === 0) return options;

  const answers = await inquirer.prompt(prompts);
  return { ...options, ...answers };
}
