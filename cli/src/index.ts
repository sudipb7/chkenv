#!/usr/bin/env node

import chalk from "chalk";

import { handleError } from "@/utils/errors";
import { formatResults } from "@/utils/formatter";
import { handleUnusedEnvs } from "@/utils/cleanup";
import type { CliOptions, EnvResult } from "@/types";
import { findUnusedEnvs, validatePath } from "@/utils/helpers";
import { INCLUDE_EXTENSIONS, EXCLUDE_DIRS } from "@/utils/constants";
import { parseArguments, promptForOptions } from "@/utils/arguments";
import { getSourceFiles, parseEnvFile, processFile } from "@/utils/files";

async function processArgs() {
  const args = process.argv.slice(2);
  const options = parseArguments(args);
  const finalOptions = await promptForOptions(args, options);

  validatePath(finalOptions.path, "Directory");
  validatePath(finalOptions.configFile, "Configuration file");

  return finalOptions;
}

function getEnvsAndFiles(options: CliOptions) {
  const { configFile, path: dirPath, includeComments } = options;
  const envs = parseEnvFile(configFile, includeComments);
  const files = getSourceFiles(dirPath, EXCLUDE_DIRS, INCLUDE_EXTENSIONS);

  return { envs, files };
}

export function analyzeEnvs(envs: string[], files: string[], includeComments: boolean): EnvResult {
  const allUsedEnvs = new Set<string>();
  const allUndeclaredEnvs = new Set<string>();

  files.forEach((file) => {
    try {
      const { used, undeclared } = processFile(file, envs, includeComments);

      used.forEach((env) => allUsedEnvs.add(env));
      undeclared.forEach((env) => allUndeclaredEnvs.add(env));
    } catch (error) {
      console.warn(`Warning: Failed to process file ${chalk.yellow(file)}:`, error);
    }
  });

  return {
    unused: findUnusedEnvs(envs, allUsedEnvs),
    undeclared: Array.from(allUndeclaredEnvs),
    total: {
      envs: envs.length,
      used: allUsedEnvs.size,
      undeclared: allUndeclaredEnvs.size,
      files: files.length,
    },
  };
}

async function main() {
  try {
    const options = await processArgs();

    console.log(chalk.blue("\n🔍 Analyzing Environment Variables...\n"));

    const { envs, files } = getEnvsAndFiles(options);
    const results = analyzeEnvs(envs, files, options.includeComments);

    console.log(formatResults(results));

    if (options.cleanup) {
      await handleUnusedEnvs(results, options.configFile);
    }
  } catch (error) {
    handleError(error);
  }
}

main();
