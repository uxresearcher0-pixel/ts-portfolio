# Security model

## Information DS DevOS does not collect

The included scripts do not intentionally read:

- `.env` files
- SSH private keys
- macOS Keychain
- browser data
- shell history
- GitHub, Claude, or OpenAI tokens

`doctor.sh` reports only command availability and version information.

## Authentication

Authentication is deliberately manual:

```bash
gh auth login
claude
codex
```

Do not paste authentication tokens into source files or chat messages.

## Environment variables

Commit only `.env.example`:

```env
DATABASE_URL=
API_BASE_URL=
```

Store actual values using:

- local ignored `.env.local`
- GitHub Codespaces secrets
- Vercel environment variables
- Render environment variables
- MongoDB Atlas credentials

## Before publishing this repository

Run:

```bash
git status
git diff --cached
git grep -nEi '(api[_-]?key|secret|password|token)\s*[:=]'
```

Review every match. Variable names in examples are acceptable; real values are not.

## Docker security

- Use official or well-maintained images.
- Do not mount the entire home directory.
- Do not expose database ports publicly.
- Do not run project containers as root when avoidable.
- Remove unused images and volumes only after review.
