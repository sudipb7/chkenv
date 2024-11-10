#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const EXCLUDE_DIRS = [
  "node_modules",
  ".next",
  ".out",
  ".dist",
  ".git",
  "build",
  ".cache",
  "public",
  ".vscode",
];

const INCLUDE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

// Process command line arguments
function processArgs() {
  const args = process.argv.slice(2);

  let options = {
    dir: process.cwd(),
    envFile: ".env",
  };

  args.forEach((arg, index) => {
    if (arg === "--help" || arg === "-h") {
      console.log("Usage: chkenv [options]");
      console.log("");
      console.log("Options:");
      console.log("  --dir, -d  Directory to analyze (default: current directory)");
      console.log("  --env, -e  Environment file name (default: .env)");
      process.exit(0);
    } else if (arg === "--dir" || arg === "-d") {
      options.dir = args[index + 1] || process.cwd();
    } else if (arg === "--env" || arg === "-e") {
      options.envFile = args[index + 1] || ".env";
    }
  });

  return options;
}

// Get environment variables and source files
function getEnvsAndFiles(envFileName, dirName) {
  // Read env file
  const envFileContent = fs.readFileSync(envFileName, "utf-8");
  const envs = envFileContent
    .split("\n")
    .filter(l => l.length)
    .map(line => line.split("=")[0]);

  // Get source files
  const files = [];

  fs.readdirSync(dirName, { recursive: true }).forEach(file => {
    const filePath = path.join(dirName, file);

    // Check if any part of the path contains an excluded directory
    if (EXCLUDE_DIRS.some(dir => filePath.includes(`${path.sep}${dir}${path.sep}`))) {
      return;
    }

    const stat = fs.statSync(filePath);
    if (stat.isFile() && INCLUDE_EXTENSIONS.includes(path.extname(file))) {
      files.push(filePath);
    }
  });

  return { envs, files };
}

// Check for unused and undeclared environment variables
function checkEnvs(envs, files) {
  const envsUsed = new Set();
  const undeclaredEnvs = new Set();

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n");

    for (const line of lines) {
      const matches = line.match(/(process\.env|import\.meta\.env)\.[A-Z_]+/g);
      if (matches) {
        matches.forEach(match => {
          const envName = match.split(".")[2];
          envsUsed.add(envName);

          if (!envs.includes(envName)) {
            undeclaredEnvs.add(envName);
          }
        });
      }
    }
  }

  const unusedEnvs = envs.filter(env => !envsUsed.has(env));

  return {
    unused: unusedEnvs,
    undeclared: Array.from(undeclaredEnvs),
  };
}

function main() {
  try {
    const options = processArgs();

    console.log("🔍 Analyzing Environment Variables...\n");

    const { envs, files } = getEnvsAndFiles(options.envFile, options.dir);
    const result = checkEnvs(envs, files);

    console.log("❌ Unused Variables:", result.unused.length === 0 ? "None" : "");
    if (result.unused.length) {
      result.unused.forEach(env => console.log(`  - ${env}`));
    }
    console.log("");

    console.log("⚠️ Undeclared Variables:", result.undeclared.length === 0 ? "None" : "");
    if (result.undeclared.length) {
      result.undeclared.forEach(env => console.log(`  - ${env}`));
    }
    console.log("");

    console.log("✨ Summary:");
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
