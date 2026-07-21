# my-homelab-monorepo

Self-hosted homelab 應用與 CI/CD monorepo。容器化部署，GitHub Actions self-hosted runner 自動 build + deploy。

> PVE 礎設施配置（網路拓撲、防火牆規則、反向代理等）由獨立的 private repo 管理，不對外暴露。

## CI/CD

```
push to main (apps/**)
  → self-hosted runner (Docker VM)
  → docker build -t homelab/<app>:latest
  → docker compose -f ~/services/<app>/docker-compose.yml up -d
  → reverse proxy → Docker VM:<port>
```

- Self-hosted runner 在 Docker Host VM 上
- 每個 app 有自己的 Dockerfile，部署到 `~/services/<app>/`
- 本地 build 本地跑，不需要外部 registry
- 反向代理配置由手動管理，不納入 CI/CD

詳見 [CI/CD 筆記](docs/cicd_github_actions.md)。

## 目錄結構

```
my-homelab-monorepo/
├── apps/                    ← 應用程式（各 app 獨立 Dockerfile）
│   └── svelte_projects/     ← SvelteKit 靜態站台 (entry + profile + shared)
├── docs/                    ← 開發與 CI/CD 文檔
│   ├── cicd_github_actions.md
│   └── paraglide_i18n.md
└── .github/workflows/       ← GitHub Actions CI/CD
```

未來新增 app：在 `apps/<app>/` 加 Dockerfile + workflow path filter + deploy step。

## 文檔

- [CI/CD 筆記](docs/cicd_github_actions.md) — GitHub Actions 部署設定
- [Paraglide i18n](docs/paraglide_i18n.md) — SvelteKit 多語系設定