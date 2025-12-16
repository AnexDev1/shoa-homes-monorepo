# Deployment & Server Setup (summary)

This file documents a minimal, repeatable deployment approach for the Shoa Homes backend.

1. Setup server (Ubuntu 22.04) - run as root or via sudo:

```bash
# create deploy user
adduser deploy
usermod -aG sudo deploy

# install prerequisites
apt update && apt upgrade -y
apt install -y curl git build-essential ufw

# add swap (1GB)
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# install node 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# pm2
npm install -g pm2 pm2-logrotate
sudo -H -u deploy bash -lc "pm2 startup systemd -u deploy --hp /home/deploy"
```

2. Clone repo & deploy

```bash
# as deploy user
cd /var/www
git clone git@github.com:AnexDev1/shoa-homes-monorepo.git
cd shoa-homes-monorepo
cp backend/.env.example backend/.env   # then edit backend/.env

# run deploy script (after filling .env)
sudo /var/www/shoa-homes-monorepo/scripts/deploy.sh
```

3. Nginx & SSL

```bash
apt install -y nginx certbot python3-certbot-nginx
# create nginx site and enable
# obtain cert
certbot --nginx -d api.shoahomes.com
```

4. Frontend build & serve with Nginx

Build the frontend with the backend API URL injected at build time. Example (run in repo root):

```bash
# set the API base that the frontend will use for all /api requests
export VITE_API_BASE_URL=https://api.shoahomes.com/api
cd frontend
npm ci
npm run build
```

Copy static files to your Nginx site (example site root `/var/www/shoa-frontend`):

```bash
sudo mkdir -p /var/www/shoa-frontend
sudo rm -rf /var/www/shoa-frontend/*
sudo cp -r frontend/dist/* /var/www/shoa-frontend/
sudo chown -R www-data:www-data /var/www/shoa-frontend
```

Example Nginx site that serves the frontend and proxies `/api` to the backend:

```
server {
	listen 80;
	server_name shoa-homes.com www.shoa-homes.com api.shoahomes.com;

	root /var/www/shoa-frontend;
	index index.html;

	location /api/ {
		proxy_pass http://127.0.0.1:5000/api/;
		proxy_http_version 1.1;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}

	location / {
		try_files $uri $uri/ /index.html;
	}
}
```

Then obtain TLS certs and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/shoa-frontend /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d shoa-homes.com -d www.shoa-homes.com -d api.shoahomes.com
```

4. CI (GitHub Actions)

- The included workflow pushes repository files to the server and runs the `scripts/deploy.sh` script.
- Create repository secrets: `SSH_HOST`, `SSH_USER`, `SSH_KEY`, and optionally `SSH_PORT`.

---

If you'd like, I can:

- create a `systemd` unit for PM2 instead of `pm2 startup` (if you prefer),
- convert the DB to Postgres and update Prisma (create `DATABASE_URL`), or
- create a one-off script to seed / reset admin credentials automatically.
