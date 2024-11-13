import fs from "fs";
import path from "path";
import chalk from "chalk";

import type { EnvMatch } from "@/types";
import packageJson from "../../package.json";
import { COMMAND_OPTIONS, COMMENT_SYMBOLS, ENV_PATTERN } from "./constants";

export function validatePath(pathToCheck: string, label: string): void {
  if (!fs.existsSync(pathToCheck)) {
    console.error(`${chalk.bold(label)} does not exist: ${chalk.bold(pathToCheck)}`);
    process.exit(1);
  }
}

export function showHelp(): never {
  console.log("Usage: chkenv [options]\n");
  console.log("Options:");
  Object.entries(COMMAND_OPTIONS).forEach(([flags, desc]) => {
    console.log(`  ${flags.padEnd(25)} ${desc}`);
  });
  process.exit(0);
}

export function showVersion(): never {
  console.log(`v${packageJson.version}`);
  process.exit(0);
}

export function validateCommand(command: string, availableCommands: string[]): void {
  if (!availableCommands.includes(command)) {
    console.error(`Unknown option: ${command}`);
    console.log("Use `chkenv --help` to see available options");
    process.exit(1);
  }
}

export function shouldExcludeFile(filePath: string, excludeDirs: string[]): boolean {
  return excludeDirs.some(
    (dir) =>
      filePath.includes(`${path.sep}${dir}${path.sep}`) || filePath.endsWith(`${path.sep}${dir}`)
  );
}

export function shouldIncludeFile(filePath: string, includeExts: string[]): boolean {
  const ext = path.extname(filePath);
  return includeExts.includes(ext);
}

export function isCommentLine(line: string): boolean {
  return COMMENT_SYMBOLS.some((symbol) => line.trim().startsWith(symbol));
}

export function extractEnvName(match: string): string {
  return match.split(".")[2];
}

export function parseEnvMatches(line: string): EnvMatch[] | null {
  const matches = line.match(ENV_PATTERN);
  if (!matches) return null;

  return matches.map((match) => ({
    name: extractEnvName(match),
    raw: match,
  }));
}

export function findUnusedEnvs(envs: string[], usedEnvs: Set<string>): string[] {
  return envs.filter((env) => !usedEnvs.has(env));
}
