# chkenv

The environment variable detective your codebase needs

A command-line tool to analyze environment variables in your project and manage them efficiently.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Options](#options)
  - [Interactive Mode](#interactive-mode)
  - [Examples](#examples)
- [Backup Management](#backup-management)
- [File Support](#file-support)
- [Contributing](#contributing)
- [More](#more)

## Features

- Detects unused environment variables
- Identifies undeclared variables in code
- Interactive cleanup with backup options
- Supports both `process.env` and `import.meta.env`
- Smart comment handling with `--all` flag
- Cleanup options for unused variables
- Automatic backup management
- Multiple file type support

## Installation

```bash
npm install -g chkenv
```

## Usage

```bash
chkenv [options]
```

### Options

```bash
Options:
  -h, --help            Show help
  -v, --version         Show version
  -d, --default         Run with default options
  -p, --path <path>     Directory to analyze (default: ./)
  -c, --config <path>   Configuration file name (default: .env.local)
  -a, --all             Include commented environment variables
  --cleanup             Enable cleanup process for unused variables
```

### Interactive Mode

When run without the `-d` flag, chkenv will prompt for:

1. Directory to analyze
2. Environment file name
3. Comment handling preference
4. Cleanup options for unused variables

### Examples

1. Quick analysis with defaults:

```bash
chkenv -d
```

2. Include commented variables:

```bash
chkenv --all
```

3. Custom Directory Scan:

```bash
chkenv --path src/api
```

4. Custom Configuration file:

```bash
chkenv --config .env.production
```

5. Cleanup options:

```bash
chkenv --cleanup
```

6. Using multiple flags:

```bash
chkenv --config .env.production --path src/api --all --cleanup
```

## Backup Management

When cleaning up unused variables, chkenv offers three backup options:

1. Overwrite existing backup
2. Create new numbered backup (e.g., .env.backup.1)
3. Specify custom backup name

Example backup workflow:

```bash
$ chkenv --cleanup
🔍 Analyzing Environment Variables...
❌ Unused Variables:
  - API_KEY
  - STRIPE_SECRET
✨ Summary:
  - Files scanned: 42
  - Total env variables: 15
  - Used variables: 13
  - Unused variables: 2
  - Undeclared variables: 0
🧹 Cleanup Options
? What would you like to do with unused environment variables?
> Keep them as is
Remove them
Comment them out
? Are you sure you want to comment out 2 environment variables? (y/N)
? A backup file already exists. What would you like to do?
> Overwrite existing backup
Create new backup file
Specify custom backup name
✨ Environment file updated successfully!
Backup created at: .env.local.backup
Commented out variables:
  - # API_KEY
  - # STRIPE_SECRET
```

## File Support

[cli/src/utils/constants.ts](https://github.com/sudipb7/chkenv/blob/main/cli/src/utils/constants.ts)

## Excluded Directories

[cli/src/utils/constants.ts](https://github.com/sudipb7/chkenv/blob/main/cli/src/utils/constants.ts)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For any help or queries, you can reach out to me on [X](https://x.com/sudipbiswas_dev) | [LinkedIn](https://linkedin.com/in/sudipb7) | [Peerlist](https://peerlist.io/sudipbiswas).
