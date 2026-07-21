# my-homelab-monorepo

Self-hosted homelab applications and CI/CD monorepo. Containerized deployment, GitHub Actions self-hosted runner for automated build + deploy.

> PVE infrastructure configuration (network topology, firewall rules, reverse proxy, etc.) is managed in a separate private repo and is not exposed publicly.

## CI/CD

```
push to main (apps/**)
  → self-hosted runner (Docker VM)
  → docker build -t homelab/<app>:latest
  → docker compose -f ~/services/<app>/docker-compose.yml up -d
  → reverse proxy → Docker VM:<port>
```

- The self-hosted runner runs on the Docker Host VM
- Each app has its own Dockerfile and is deployed to `~/services/<app>/`
- Build and run locally; no external registry needed
- Reverse proxy configuration is managed manually and is not part of CI/CD

See [CI/CD notes](docs/cicd_github_actions.md).

## Directory structure

```
my-homelab-monorepo/
├── apps/                    ← Applications (each app has its own Dockerfile)
│   └── svelte_projects/     ← SvelteKit static sites (entry + profile + shared)
├── docs/                    ← Development and CI/CD documentation
│   ├── cicd_github_actions.md
│   └── paraglide_i18n.md
└── .github/workflows/       ← GitHub Actions CI/CD
```

To add a new app in the future: add a Dockerfile in `apps/<app>/`, a workflow path filter, and a deploy step.

## Documentation

- [CI/CD notes](docs/cicd_github_actions.md) — GitHub Actions deployment setup
- [Paraglide i18n](docs/paraglide_i18n.md) — SvelteKit multilingual setup