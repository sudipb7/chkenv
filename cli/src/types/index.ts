export interface CliOptions {
  path: string;
  configFile: string;
  includeComments: boolean;
  cleanup: boolean;
}

export interface CommandOptions {
  [key: string]: string;
}

export interface EnvMatch {
  name: string;
  raw: string;
}

export interface EnvResult {
  unused: string[];
  undeclared: string[];
  total: {
    envs: number;
    used: number;
    undeclared: number;
    files: number;
  };
}

export type CleanupAction = "remove" | "comment" | "skip";
