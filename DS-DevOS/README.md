# DS DevOS

A free-tier-first, security-conscious development environment for macOS, GitHub Codespaces, Docker Dev Containers, Claude Code, and Codex.

## Design principles

- Review before execution
- No embedded secrets
- No destructive cleanup by default
- Reproducible project environments
- Minimal host-machine dependencies
- GitHub is the source of truth
- Free-tier services are preferred
- WCAG 2.2 AA is the default product quality baseline

## What DS DevOS installs on macOS

The optional bootstrap script can install:

- Homebrew
- Git
- GitHub CLI
- Visual Studio Code
- Docker Desktop
- jq
- ripgrep
- tree
- shellcheck
- Node version manager (`fnm`)
- Node.js LTS
- pnpm
- Claude Code stable
- Codex CLI

The script runs in preview mode unless you explicitly pass `--apply`.

## Quick start

```bash
cd DS-DevOS
./scripts/doctor.sh
./scripts/setup-macos.sh
```

The second command only prints the proposed actions.

After reviewing:

```bash
./scripts/setup-macos.sh --apply
```

Authentication remains manual:

```bash
gh auth login
claude
codex
```

## Start a new project

```bash
./scripts/new-project.sh my-project
cd ~/Development/Active/my-project
code .
```

Then choose **Dev Containers: Reopen in Container** in VS Code.

## Folder strategy

```text
~/Development/
├── Active/
├── Archive/
├── Backups/
├── Templates/
├── Shared/
└── Scripts/
```

Keep only actively developed repositories in `Active`. Source code should be committed and pushed. Dependencies and generated files should never be treated as backups.

## Codespaces

The included `.devcontainer` configuration is compatible with GitHub Codespaces. Use the smallest available machine, short idle timeout, and stop the Codespace after work.

## Security

Never commit:

- `.env`
- API keys
- database credentials
- SSH private keys
- tokens
- production certificates

Use `.env.example` for variable names only. Use GitHub Codespaces secrets or deployment-platform environment variables for actual values.

See `docs/SECURITY.md` and `docs/WORKFLOW.md`.
