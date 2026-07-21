# GitHub Actions CI/CD deployment notes

## Overview

This project uses GitHub Actions to automatically deploy applications to the Homelab Docker Host VM.

**Architecture choice: fully containerized, local build (option A)**

```
GitHub Actions (self-hosted runner on Docker VM)
  → detect which app changed (path filter)
  → docker build -t homelab/<app>:latest apps/<app>/
  → docker compose -f ~/services/<app>/docker-compose.yml up -d
  → reverse proxy → Docker VM:<port>
```

**Design principles:**

- CI/CD only touches the Docker Host VM; reverse proxy configuration is managed manually (one-time setup)
- Each app has its own Dockerfile + docker-compose.yml, deployed to `~/services/<app>/`
- Static and dynamic sites both run as Docker containers for a consistent workflow
- No external registry needed; build and run locally
- Versions are traceable (image tags), making rollback easy

---

## Directory structure

```
.github/
└── workflows/
    └── deploy.yml        # Self-hosted runner workflow
```

---

## Option A: Self-hosted runner + Dockerized deployment

### 1. Install the runner on the Docker Host VM

> The Docker Host VM already has a GitHub SSH key and git configured.

Go to the GitHub repo → **Settings → Actions → Runners → New self-hosted runner**, select Linux x64, and follow the instructions on the page:

```bash
mkdir ~/actions-runner && cd ~/actions-runner

# Download (version number per what the page shows)
curl -o actions-runner-linux-x64.tar.gz -L \
  https://github.com/actions/runner/releases/latest/download/actions-runner-linux-x64-2.x.x.tar.gz

tar xzf ./actions-runner-linux-x64.tar.gz

# Configure (token obtained from the GitHub page, valid for 1 hour)
./config.sh --url https://github.com/yutinglia/my-homelab-monorepo --token YOUR_TOKEN

# Install as a systemd service and start it
sudo ./svc.sh install
sudo ./svc.sh start
```

Confirm the runner is online:

```bash
sudo ./svc.sh status
# or
systemctl status actions.runner.*
```

### 2. Workflow trigger conditions

- Push to the `main` branch with changes under `apps/svelte_projects/**`
- Or manual trigger (`workflow_dispatch`)

### 3. Deployment process

Each app has its own `Dockerfile` in the monorepo and is deployed to `~/services/<app>/` on the Docker VM:

```bash
# Steps executed by the runner (simplified):
cd apps/svelte_projects

# Build Docker images
docker build -t homelab/entry:latest -f entry/Dockerfile .
docker build -t homelab/profile:latest -f profile/Dockerfile .

# Deploy
docker compose -f ~/services/entry/docker-compose.yml up -d
docker compose -f ~/services/profile/docker-compose.yml up -d
```

### 4. Deployment targets and reverse proxy configuration

> For the detailed deployment target table, reverse proxy configuration structure,
> and Docker Host VM environment setup, see the relevant docs in the private configs repo.

When adding a new app in the future:
1. Add a `Dockerfile` in `apps/<app>/`
2. Add a `docker-compose.yml` in `~/services/<app>/`
3. Add the corresponding site configuration to the reverse proxy (one-time, manual setup)
4. Add a path filter and build/deploy steps to the workflow

---

## Common issues

### Runner shows Offline

```bash
# Restart the runner service
sudo ./svc.sh stop
sudo ./svc.sh start
# Confirm the network can reach GitHub
curl -I https://github.com
```

### docker build fails

```bash
# Check the Dockerfile syntax
docker build --no-cache apps/<app>/

# Check disk space
df -h
# Clean up old images
docker image prune -a
```

### pnpm install fails during docker build (lockfile out of sync)

The Dockerfile runs `pnpm install --frozen-lockfile`. If packages were updated locally but `pnpm-lock.yaml` was not committed, the build will fail. Fix:

```bash
cd apps/svelte_projects
pnpm install          # update the lockfile
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"
git push
```

---

## Related files

- [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) — Self-hosted runner workflow