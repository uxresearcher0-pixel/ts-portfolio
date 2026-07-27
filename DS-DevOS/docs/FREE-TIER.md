# Free-tier-first architecture

## Development

- Local VS Code + Dev Containers: primary
- GitHub Codespaces: secondary/cloud fallback
- GitHub repositories: source of truth

## Deployment

- Frontend: Vercel free tier where eligible
- API: Render free tier where eligible
- Database: MongoDB Atlas free cluster where suitable
- Static documentation: GitHub Pages
- CI: GitHub Actions included allowance

Always review current provider limits before depending on them. Free-tier terms can change.

## Cost controls

- Use the smallest Codespaces machine.
- Set a short idle timeout.
- Stop Codespaces manually.
- Avoid Codespaces prebuilds unless necessary.
- Do not run production workloads in Codespaces.
- Keep only one active Codespace where practical.
- Regularly delete unused Docker images after review.
