#!/usr/bin/env bash
set -euo pipefail

# Deploy script for manual server deployments
# Assumes repo is checked out at /var/www/shoa-homes-monorepo
REPO_DIR=/var/www/shoa-homes-monorepo
cd "$REPO_DIR"

echo "Pulling latest changes..."
git fetch --all --prune
git reset --hard origin/main

echo "Installing backend dependencies..."
cd backend
npm ci

# Apply migrations (if any) - for SQLite this may be a no-op, for Postgres this runs migrations
npx prisma migrate deploy || true
npx prisma generate

echo "Starting / restarting with PM2..."
# startOrRestart will add the process if missing
pm2 startOrRestart ecosystem.config.js --env production
pm2 save

echo "Building frontend..."
cd "$REPO_DIR/frontend"
# Allow overriding API base URL via env var, default to production API
export VITE_API_BASE_URL="${VITE_API_BASE_URL:-https://api.shoahomes.com/api}"
npm ci
npm run build

echo "Deploying built frontend to /var/www/shoa-frontend..."
sudo mkdir -p /var/www/shoa-frontend
sudo rm -rf /var/www/shoa-frontend/*
sudo cp -r dist/* /var/www/shoa-frontend/
sudo chown -R www-data:www-data /var/www/shoa-frontend
sudo systemctl reload nginx || true

echo "Deployment complete."
