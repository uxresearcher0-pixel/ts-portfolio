# DS DevOS Agent Instructions

## Required workflow

1. Inspect before editing.
2. Explain current behavior and affected files.
3. Propose a scoped plan.
4. Make the smallest coherent change.
5. Run applicable lint, typecheck, tests, and build.
6. Review the final diff.
7. Summarize changes, validation, risks, and remaining work.

## Safety boundaries

- Never reveal or print secrets.
- Never read `.env`, private keys, credential stores, browser profiles, or shell history unless explicitly authorized.
- Never force-push.
- Never commit directly to `main`.
- Never delete repositories, databases, volumes, branches, or user files without explicit authorization.
- Do not run `sudo`, remote scripts, or package installers without explaining the action first.
- Treat downloaded scripts as untrusted until reviewed.
- Do not weaken authentication, authorization, CSP, CORS, validation, or accessibility to make tests pass.

## Engineering baseline

- Prefer TypeScript.
- Follow the existing architecture.
- Prefer semantic HTML before ARIA.
- Target WCAG 2.2 AA and keyboard/screen-reader compatibility.
- Use reusable components and design tokens.
- Add or update tests for behavioral changes.
- Do not add dependencies without justification.
