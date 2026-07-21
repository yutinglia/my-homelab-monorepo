# GitHub Actions CI/CD 部署筆記

## 概覽

本專案使用 GitHub Actions 自動將應用部署到 Homelab 的 Docker Host VM。

**架構選擇：全部容器化，本地 build（方案 A）**

```
GitHub Actions (self-hosted runner on Docker VM)
  → 檢測哪個 app 變了 (path filter)
  → docker build -t homelab/<app>:latest apps/<app>/
  → docker compose -f ~/services/<app>/docker-compose.yml up -d
  → reverse proxy → Docker VM:<port>
```

**設計原則：**

- CI/CD 只碰 Docker Host VM，反向代理配置由手動管理（一次性設定）
- 每個 app 有自己的 Dockerfile + docker-compose.yml，部署到 `~/services/<app>/`
- 靜態站和動態站統一用 Docker 容器，流程一致
- 不需要外部 registry，本地 build 本地跑
- 版本可追溯（image tag），回滾方便

---

## 目錄結構

```
.github/
└── workflows/
    └── deploy.yml        # Self-hosted runner workflow
```

---

## 方案 A：Self-hosted Runner + Docker 化部署

### 1. 在 Docker Host VM 安裝 Runner

> Docker Host VM 已有 GitHub SSH key 和 git 配置。

前往 GitHub repo → **Settings → Actions → Runners → New self-hosted runner**，選 Linux x64，依頁面指令操作：

```bash
mkdir ~/actions-runner && cd ~/actions-runner

# 下載（版本號以頁面顯示為準）
curl -o actions-runner-linux-x64.tar.gz -L \
  https://github.com/actions/runner/releases/latest/download/actions-runner-linux-x64-2.x.x.tar.gz

tar xzf ./actions-runner-linux-x64.tar.gz

# 設定（token 從 GitHub 頁面取得，有效期 1 小時）
./config.sh --url https://github.com/yutinglia/my-homelab-monorepo --token YOUR_TOKEN

# 安裝為 systemd 服務並啟動
sudo ./svc.sh install
sudo ./svc.sh start
```

確認 Runner 上線：

```bash
sudo ./svc.sh status
# 或
systemctl status actions.runner.*
```

### 2. Workflow 觸發條件

- Push 到 `main` branch，且異動路徑在 `apps/svelte_projects/**`
- 或手動觸發（`workflow_dispatch`）

### 3. 部署流程

每個 app 在 monorepo 中有自己的 `Dockerfile`，部署到 Docker VM 的 `~/services/<app>/`：

```bash
# Runner 執行的步驟（簡化）：
cd apps/svelte_projects

# Build Docker images
docker build -t homelab/entry:latest -f entry/Dockerfile .
docker build -t homelab/profile:latest -f profile/Dockerfile .

# Deploy
docker compose -f ~/services/entry/docker-compose.yml up -d
docker compose -f ~/services/profile/docker-compose.yml up -d
```

### 4. 部署目標與反向代理配置

> 詳細的部署目標表、反向代理配置結構、Docker Host VM 環境設定，
> 請見 private configs 倉庫的相關文檔。

未來新增 app 時：
1. 在 `apps/<app>/` 加 `Dockerfile`
2. 在 `~/services/<app>/` 加 `docker-compose.yml`
3. 反向代理加對應站點配置（一次性，手動設定）
4. Workflow 加 path filter 和 build/deploy 步驟

---

## 常見問題

### Runner 顯示 Offline

```bash
# 重啟 runner 服務
sudo ./svc.sh stop
sudo ./svc.sh start
# 確認網路可以連到 GitHub
curl -I https://github.com
```

### docker build 失敗

```bash
# 確認 Dockerfile 語法
docker build --no-cache apps/<app>/

# 確認磁碟空間
df -h
# 清理舊 image
docker image prune -a
```

### docker build 中 pnpm install 失敗（lockfile 不同步）

Dockerfile 內 `pnpm install --frozen-lockfile`，若本地有更新套件但未 commit `pnpm-lock.yaml`，build 會失敗。解法：

```bash
cd apps/svelte_projects
pnpm install          # 更新 lockfile
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"
git push
```

---

## 相關檔案

- [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) — Self-hosted runner workflow