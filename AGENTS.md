# AGENTS.md

This file applies to the entire `my-homelab-monorepo`. This is a public
repository: treat every change as content that anyone may read permanently,
including through Git history.

## Project scope

- `apps/svelte_projects/entry`: the Homelab entry site.
- `apps/svelte_projects/profile`: the personal profile and portfolio site.
- `apps/svelte_projects/shared`: Svelte components and styles shared by both sites.
- `apps/svelte_projects/messages`: English and Traditional Chinese copy.
- Setlist is a separate project. This repository may link to or describe it, but
  must not modify the Setlist source code.

## Public repository and secret handling

- Never commit tokens, passwords, API keys, private keys, cookies, sessions,
  `.env` files, credential files, private IP addresses, internal hostnames, SSH
  settings, or other private Homelab topology.
- Examples must use unmistakable placeholders such as `YOUR_TOKEN`. Never use
  previously valid credentials as examples.
- Store private project notes in `.codex/local-context.md` and keep the file
  ignored by Git. Never copy its contents into public documentation, commits,
  issues, or pull requests.
- Treat `C:\Users\yutinglia\.ssh\config` as the sole source of truth for SSH host
  aliases, addresses, and connection options. Connect through aliases and never
  write resolved IP addresses or SSH configuration into this repository.
- Check GitHub CLI authentication only with `gh auth status`. Never read,
  display, copy, or store a token. Do not switch to the repository owner's
  account to approve changes or bypass protection rules.
- If a scan reports a finding, disclose only the file path and detector
  category—never the detected value. If a secret has entered Git history, treat
  it as compromised and tell the user to revoke or rotate it. Do not rewrite
  history without explicit approval.

Run this before handing off any change:

```powershell
node scripts/check-secrets.mjs --self-test --history
```

## CI/CD security boundaries

- Production deployment may run only from a push to `main` or a manual action
  initiated by the owner.
- Never add `pull_request`, fork, issue-comment, or other untrusted-content
  triggers to a workflow that runs on the self-hosted runner.
- Workflows must use least privilege. Keep only `contents: read` unless a
  documented requirement needs additional permission.
- Do not persist Git credentials after checkout. Never print environment
  variables or authentication material to logs.
- Do not move production configuration, Compose secrets, or runner-specific
  context into this repository.
- Do not enable GitHub Issues or Pull Requests, change repository settings,
  push, deploy, or create a release unless the user explicitly requests it.

## Development and verification

The website workspace is in `apps/svelte_projects` and uses pnpm:

```powershell
cd apps/svelte_projects
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

Before completion, also run these commands from the repository root:

```powershell
git diff --check
node scripts/check-secrets.mjs --self-test --history
```

- Keep `messages/en.json` and `messages/zh-hant.json` in sync.
- Traditional Chinese copy should use natural, neutral written Chinese.
  Technical terminology may mix in English where appropriate; avoid
  machine-translated or excessively regional phrasing.
- Prefer shared components and design tokens. Preserve keyboard navigation,
  visible focus states, reduced-motion behavior, mobile layouts, and other
  accessibility requirements.
- Never commit `node_modules`, `.svelte-kit`, `build`, or generated local secret
  files.
