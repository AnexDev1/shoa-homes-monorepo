# Project Setup Instructions

## Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14 (for production)

## Initial Setup

1. **Clone and navigate to the project:**
   ```bash
   cd shoa-homes-monorepo
   ```

2. **Install root dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your actual credentials.

4. **Install workspace dependencies:**
   ```bash
   npm install --workspaces
   ```

## Development Mode

### Run everything concurrently:
```bash
npm run dev
```

This starts both frontend and backend:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Run individually:

**Frontend only:**
```bash
npm run dev:frontend
# or
cd frontend && npm run dev
```

**Backend only:**
```bash
npm run dev:backend
# or
cd backend && npm run dev
```

## Database Setup (Production)

1. **Generate Prisma Client:**
   ```bash
   cd backend
   npx prisma generate
   ```

2. **Run migrations:**
   ```bash
   npx prisma migrate dev
   ```

3. **Open Prisma Studio (optional):**
   ```bash
   npx prisma studio
   ```

## Building for Production

### Frontend:
```bash
npm run build
# or
cd frontend && npm run build
```

The build output will be in `frontend/dist/`

### Backend:
```bash
cd backend
npm start
```

## Testing Credentials

**Admin Account:**
- Email: admin@shoahomes.com
- Password: admin123

**Regular User:**
- Email: user@shoahomes.com
- Password: user123

## Common Issues

### Port already in use:
Change the PORT in `.env` file.

### CORS errors:
Make sure backend URL in `frontend/.env` matches your backend server.

### Database connection failed:
1. Check PostgreSQL is running
2. Verify DATABASE_URL in `.env`
3. Run migrations: `npx prisma migrate dev`

## Project Structure

```
shoa-homes-monorepo/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── layouts/      # Layout components
│   │   ├── services/     # API services
│   │   ├── store/        # State management
│   │   ├── utils/        # Utilities
│   │   └── lib/          # Third-party configs
│   └── package.json
├── backend/              # Express API
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   ├── config/       # Configuration
│   │   └── server.js     # Entry point
│   ├── prisma/           # Database schema
│   └── package.json
├── .github/              # CI/CD workflows
├── package.json          # Root workspace config
└── README.md
```

## Available Scripts

**Root level:**
- `npm run dev` - Run both frontend and backend
- `npm run dev:frontend` - Run frontend only
- `npm run dev:backend` - Run backend only
- `npm run build` - Build frontend for production
- `npm run lint` - Lint all workspaces
- `npm run format` - Format code with Prettier

**Frontend:**
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Lint frontend code

**Backend:**
- `npm run dev` - Start with nodemon
- `npm start` - Start production server
- `npx prisma generate` - Generate Prisma Client
- `npx prisma migrate dev` - Run migrations
- `npx prisma studio` - Open database GUI

## Deployment

### Frontend (Vercel/Netlify):
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `frontend/dist`
4. Add environment variables

### Backend (Railway/Render/Heroku):
1. Connect your repository
2. Set start command: `npm start`
3. Add environment variables
4. Run migrations after first deploy

## Support

For issues and questions, please contact the development team.
