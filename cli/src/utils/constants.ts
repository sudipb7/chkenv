import { CliOptions, CommandOptions } from "@/types";

export const EXCLUDE_DIRS = [
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

export const INCLUDE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];

export const DEFAULT_OPTIONS: CliOptions = {
  path: process.cwd(),
  configFile: ".env.local",
  includeComments: false,
  cleanup: false,
};

export const COMMAND_OPTIONS: CommandOptions = {
  "-h, --help": "Show help",
  "-v, --version": "Show version",
  "-d, --default": "Run with default options",
  "-p, --path <path>": "Directory to analyze (default: ./)",
  "-c, --config <path>": "Configuration file name (default: .env.local)",
  "-a, --all": "Include commented environment variables",
  "--cleanup": "Enable cleanup process for unused variables",
};

export const ENV_PATTERN = /(process\.env|import\.meta\.env)\.[A-Z_]+/g;
export const COMMENT_SYMBOLS = ["//", "/*", "*", "<!--", "*/"] as const;
