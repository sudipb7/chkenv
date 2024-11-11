#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const EXCLUDE_DIRS = [
  "node_modules",
  ".next",
  ".out",
  "dist",
  ".git",
  "build",
  ".cache",
  "public",
  ".vscode",
  ".turbo",
  "logs",
  ".idea",
  ".expo",
];

const INCLUDE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function processArgs() {
  const args = process.argv.slice(2);

  let cliOptions = {
    path: process.cwd(),
    configFile: ".env.local",
    allowCommented: false,
  };

  const options = {
    "-h, --help": "Show help",
    "-v, --version": "Show version",
    "-d, --default": "Run with default options",
    "-p, --path <path>": "Directory to analyze (default: ./)",
    "-c, --config <path>": "Configuration file name (default: .env.local)",
    "-a, --all": "Include commented environment variables",
  };

  const availableCommands = Object.keys(options).join(", ").replaceAll(" <path>", "").split(", ");

  args.forEach((arg, index) => {
    if (!availableCommands.includes(arg)) {
      console.error(`Unknown option: ${arg}`);
      console.log("Use `chkenv --help` to see available options");
      process.exit(1);
    }
    if (arg === "--version" || arg === "-v") {
      console.log("v" + require("./package.json").version);
      process.exit(0);
    } else if (arg === "--help" || arg === "-h") {
      console.log("Usage: chkenv [options]\n");
      console.log("Options:");
      Object.entries(options).forEach(([flags, desc]) => {
        console.log(`  ${flags.padEnd(25)} ${desc}`);
      });
      process.exit(0);
    } else if (arg === "--default" || arg === "-d") {
      cliOptions.path = process.cwd();
      cliOptions.configFile = ".env.local";
    } else if (arg === "--path" || arg === "-p") {
      if (!args[index + 1]) {
        console.error("No directory provided");
        process.exit(1);
      }
      cliOptions.path = args[index + 1];
    } else if (arg === "--config" || arg === "-c") {
      cliOptions.configFile = args[index + 1];
    } else if (arg === "--all" || arg === "-a") {
      cliOptions.allowCommented = true;
    }
  });

  if (!args.includes("--default") && !args.includes("-d")) {
    if (!args.includes("--path") && !args.includes("-p")) {
      const path = await promptUser("Enter the directory to analyze (default: ./): ");
      cliOptions.path = path || process.cwd();
      console.log("");
    }

    if (!args.includes("--config") && !args.includes("-c")) {
      const configFile = await promptUser(
        "Enter the configuration file name (default: .env.local): "
      );
      cliOptions.configFile = configFile || ".env.local";
      console.log("");
    }
  }

  if (!fs.existsSync(cliOptions.path)) {
    console.error("Directory does not exist");
    process.exit(1);
  }

  if (!fs.existsSync(cliOptions.configFile)) {
    console.error("Environment file does not exist");
    process.exit(1);
  }

  return cliOptions;
}

function getEnvsAndFiles(options) {
  const { configFile, path: dirName, allowCommented } = options;
  const envFileContent = fs.readFileSync(configFile, "utf-8");
  const envs = envFileContent
    .split("\n")
    .filter((line) => line.trim().length)
    .filter((line) => allowCommented || !line.startsWith("#"))
    .map((line) => line.split("=")[0].replace("#", "").trim());

  const files = [];

  fs.readdirSync(dirName, { recursive: true }).forEach((file) => {
    const filePath = path.join(dirName, file);

    if (EXCLUDE_DIRS.some((dir) => filePath.includes(dir))) {
      return;
    }

    const stat = fs.statSync(filePath);
    if (stat.isFile() && INCLUDE_EXTENSIONS.includes(path.extname(file))) {
      files.push(filePath);
    }
  });

  return { envs, files };
}

function checkEnvs(envs, files, allowCommented) {
  const envsUsed = new Set();
  const undeclaredEnvs = new Set();

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n");

    for (const line of lines) {
      const matches = line.match(/(process\.env|import\.meta\.env)\.[A-Z_]+/g);
      if (matches) {
        const commentSymbols = ["//", "/*", "*"];
        const isComment = commentSymbols.some((symbol) => line.trim().startsWith(symbol));
        if (!allowCommented && isComment) {
          continue;
        }

        matches.forEach((match) => {
          const envName = match.split(".")[2];
          envsUsed.add(envName);

          if (!envs.includes(envName)) {
            undeclaredEnvs.add(envName);
          }
        });
      }
    }
  }

  const unusedEnvs = envs.filter((env) => !envsUsed.has(env));

  return {
    unused: unusedEnvs,
    undeclared: Array.from(undeclaredEnvs),
  };
}

async function main() {
  try {
    const options = await processArgs();

    console.log("🔍 Analyzing Environment Variables...");

    const { envs, files } = getEnvsAndFiles(options);
    const result = checkEnvs(envs, files, options.allowCommented);

    if (result.unused.length) {
      console.log("\n❌ Unused Variables:");
      result.unused.forEach((env) => console.log(`  - ${env}`));
    } else {
      console.log("\n❌ Unused Variables: None");
    }

    if (result.undeclared.length) {
      console.log("\n⚠️ Undeclared Variables:");
      result.undeclared.forEach((env) => console.log(`  - ${env}`));
    } else {
      console.log("\n⚠️ Undeclared Variables: None");
    }

    console.log("\n✨ Summary:");
    console.log(`  - Total Source Files: ${files.length}`);
    console.log(`  - Unused Variables: ${result.unused.length}`);
    console.log(`  - Undeclared Variables: ${result.undeclared.length}`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
