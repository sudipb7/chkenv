import fs from "fs";
import path from "path";

import { isCommentLine, parseEnvMatches, shouldExcludeFile, shouldIncludeFile } from "./helpers";

export function parseEnvFile(filePath: string, includeComments: boolean): string[] {
  const content = fs.readFileSync(filePath, "utf-8");

  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => includeComments || !line.startsWith("#"))
    .map((line) => {
      const [key] = line.split("=");
      return key.replace("#", "").trim();
    })
    .filter(Boolean);
}

export function getSourceFiles(
  dirPath: string,
  excludeDirs: string[],
  includeExts: string[]
): string[] {
  const files: string[] = [];

  function scanDirectory(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (shouldExcludeFile(fullPath, excludeDirs)) {
        continue;
      }

      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && shouldIncludeFile(fullPath, includeExts)) {
        files.push(fullPath);
      }
    }
  }

  scanDirectory(dirPath);
  return files;
}

export function processFile(
  filePath: string,
  envs: string[],
  includeComments: boolean
): { used: Set<string>; undeclared: Set<string> } {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  const used = new Set<string>();
  const undeclared = new Set<string>();

  for (const line of lines) {
    if (!includeComments && isCommentLine(line)) {
      continue;
    }

    const matches = parseEnvMatches(line);
    if (!matches) continue;

    for (const { name } of matches) {
      used.add(name);

      if (!envs.includes(name)) {
        undeclared.add(name);
      }
    }
  }

  return { used, undeclared };
}
