# chkenv

A command-line tool to analyze environment variables in your project. It helps you identify unused environment variables declared in your `.env` file and undeclared environment variables used in your code.

## Features

- Detects unused environment variables from your `.env` file
- Identifies environment variables used in code but not declared in `.env`
- Supports both `process.env` and `import.meta.env` syntax
- Scans multiple file types (JavaScript, TypeScript, etc.)
- Excludes common directories (node_modules, dist, etc.)

## Installation

```bash
# Install globally
npm install -g chkenv

# Or run directly with npx
npx chkenv
```

## Usage

Basic usage:

```bash
chkenv [options]
```

### Options

```bash
Options:
  -e, --env <path>     Path to env file (default: ".env")
  -d, --dir <path>     Directory to scan (default: current directory)
  -h, --help           Display help information
  -v, --version        Display version information
```

### Examples

1. Basic usage with default options:

```bash
chkenv
```

This will scan current directory using `.env` file in the current directory.

2. Specify a custom env file:

```bash
chkenv --env .env.local
```

3. Scan a different directory:

```bash
chkenv --dir app
```

4. Combine options:

```bash
chkenv --env .env.production --dir src/app
```

### Output Example

```bash
🔍 Analyzing Environment Variables...

❌ Unused Variables:
- API_SECRET
- STRIPE_KEY

⚠️ Undeclared Variables:
- DATABASE_URL
- AWS_BUCKET

✨ Summary:
- Total env variables: 10
- Unused: 2
- Undeclared: 2
```

## Supported File Types

- `.js`
- `.jsx`
- `.ts`
- `.tsx`

## Excluded Directories

- `node_modules`
- `.next`
- `.out`
- `.dist`
- `.git`
- `build`
- `.cache`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Help/Contact

For any help or queries, you can reach out to me on [X](https://x.com/sudipbiswas_dev) | [LinkedIn](https://linkedin.com/in/sudipb7) | [Peerlist](https://peerlist.io/sudipbiswas).
