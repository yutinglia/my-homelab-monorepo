# Stage 1: Build
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@11.15.1 --activate

WORKDIR /build
COPY pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY shared/package.json shared/
COPY profile/package.json profile/
RUN pnpm install --frozen-lockfile

COPY shared/ shared/
COPY profile/ profile/
COPY project.inlang/ project.inlang/
COPY messages/ messages/
RUN pnpm --filter @homelab/profile build

# Stage 2: Serve (non-root)
FROM nginxinc/nginx-unprivileged:alpine
COPY --from=builder /build/profile/build /usr/share/nginx/html
COPY shared/nginx/default.conf.template /etc/nginx/conf.d/default.conf
EXPOSE 8080

USER nginx
