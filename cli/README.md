# chkenv

The environment variable detective your codebase needs

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

```bash
chkenv [options]
```

### Options

```bash
Options:
  -h, --help                Show help
  -v, --version             Show version
  -d, --default             Run with default options
  -p, --path <path>         Directory to analyze (default: ./)
  -c, --config <path>       Configuration file name (default: .env.local)
```

### Examples

1. Basic usage:

```bash
chkenv
```

You will be asked a few questions -

```bash
Enter the directory to analyze (default: ./):
Enter the configuration file name (default: .env.local):
```

2. You can use the -d or --default flag for defaults i.e `./` and `.env.local` -

```bash
chkenv -d
```

3. Specify a custom env file:

```bash
chkenv --config .env.production
```

4. Scan a different directory:

```bash
chkenv --path src/app
```

5. Combine options:

```bash
chkenv --config .env.production --path src/app
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
- `dist`
- `.git`
- `build`
- `.cache`
- `public`
- `.vscode`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## More

For any help or queries, you can reach out to me on [X](https://x.com/sudipbiswas_dev) | [LinkedIn](https://linkedin.com/in/sudipb7) | [Peerlist](https://peerlist.io/sudipbiswas).
