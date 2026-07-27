# Recommended workflow

## Daily start

```bash
cd ~/Development/Active/<project>
git status
git pull --rebase
git switch -c feat/<short-name>
code .
```

Open the repository in its Dev Container.

Use one coding agent at a time in the same working tree:

```bash
claude
# or
codex
```

## Before accepting AI changes

```bash
git status
git diff --stat
git diff
```

## Validation

Use the project's scripts. Typical commands:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
git diff --check
```

## End of session

```bash
git status
git add <reviewed-files>
git commit -m "feat: concise description"
git push -u origin HEAD
```

Stop Docker containers or Codespaces when finished.

## Storage policy

Safe to regenerate:

- `node_modules`
- `.next`
- `dist`
- `build`
- test coverage
- package caches
- Docker build cache

Must preserve:

- source code
- Git commits
- database backups where applicable
- design assets not stored elsewhere
- project documentation
- `.env.example`, never secret `.env` values
