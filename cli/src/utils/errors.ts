export class EnvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvError";
  }
}

export function handleError(error: unknown): never {
  if (error instanceof EnvError) {
    console.error("Error:", error.message);
  } else {
    console.error("Unexpected error:", error);
  }
  process.exit(1);
}