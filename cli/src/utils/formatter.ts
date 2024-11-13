import chalk from "chalk";
import { EnvResult } from "../types";

export function formatResults(results: EnvResult): string {
  const { unused, undeclared, total } = results;

  const lines = [
    chalk.red("❌ Unused Variables:"),
    unused.length === 0
      ? chalk.gray("  None")
      : unused.map((env) => chalk.gray(`  - ${env}`)).join("\n"),

    "",

    chalk.yellow("⚠️ Undeclared Variables:"),
    undeclared.length === 0
      ? chalk.gray("  None")
      : undeclared.map((env) => chalk.gray(`  - ${env}`)).join("\n"),

    "",

    chalk.green("✨ Summary:"),
    chalk.gray(`  - Files scanned: ${chalk.blue(total.files)}`),
    chalk.gray(`  - Total env variables: ${chalk.blue(total.envs)}`),
    chalk.gray(`  - Used variables: ${chalk.blue(total.used)}`),
    chalk.gray(`  - Unused variables: ${chalk.blue(unused.length)}`),
    chalk.gray(`  - Undeclared variables: ${chalk.blue(undeclared.length)}`),
  ];

  return lines.join("\n");
}
