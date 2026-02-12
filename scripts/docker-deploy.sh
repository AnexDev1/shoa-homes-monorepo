#!/usr/bin/env bash
set -euo pipefail

REPO_DIR=${REPO_DIR:-/var/www/shoa-homes-monorepo}
COMPOSE_FILE=${COMPOSE_FILE:-docker-compose.prod.yml}
BRANCH=${BRANCH:-main}
BACKUP_DIR=${BACKUP_DIR:-$REPO_DIR/.db-backups}

cd "$REPO_DIR"

echo "[1/7] Pulling latest code from $BRANCH..."
git fetch --all --prune
git reset --hard "origin/$BRANCH"

echo "[2/7] Creating data backup for SQLite..."
mkdir -p "$BACKUP_DIR"
if [ -f backend/prisma/dev.db ]; then
  cp backend/prisma/dev.db "$BACKUP_DIR/dev.db.$(date +%F-%H%M%S).bak"
  echo "Backup created under $BACKUP_DIR"
else
  echo "No backend/prisma/dev.db found; skipping SQLite backup"
fi

echo "[3/7] Preparing runtime directories..."
mkdir -p backend/uploads

echo "[4/7] Building Docker images..."
docker compose -f "$COMPOSE_FILE" build --pull backend

echo "[5/7] Applying non-destructive Prisma migrations..."
docker compose -f "$COMPOSE_FILE" run --rm backend npm run migrate:deploy || true

echo "[6/7] Starting containers..."
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans backend

echo "[7/7] Health checks..."
sleep 5
curl -fsS http://127.0.0.1:5000/api/health >/dev/null && echo "Backend health check OK"

echo "Docker deployment complete."
