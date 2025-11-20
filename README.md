# Shoa Homes Real Estate PLC

A modern, full-stack property listing platform built with React, Node.js, Express, PostgreSQL, and Cloudinary.

## 🏗️ Project Structure

This is a monorepo containing both frontend and backend applications:

```
shoa-homes-monorepo/
├── frontend/          # React + Vite + TailwindCSS
├── backend/           # Node.js + Express + Prisma
├── .github/           # GitHub Actions CI/CD
├── package.json       # Root workspace configuration
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0 (or pnpm/yarn)
- PostgreSQL >= 14

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd shoa-homes-monorepo
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

4. Set up the database (backend):

```bash
cd backend
npx prisma generate
npx prisma migrate dev
cd ..
```

### Development

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or run them separately:

**Frontend only:**

```bash
npm run dev:frontend
# Access at http://localhost:5173
```

**Backend only:**

```bash
npm run dev:backend
# API runs at http://localhost:5000
```

## 📦 Frontend

Built with:

- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Routing
- **React Query** - Data fetching
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Zustand** - State management

### Frontend Pages

**Client Side:**

- Landing page with hero and featured listings
- Property listing page with search/filters
- Property detail page with gallery and map
- Authentication (Login/Register)

**Admin Side:**

- Dashboard with analytics
- Property management (CRUD)
- Settings

### Frontend Commands

```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔧 Backend

Built with:

- **Node.js + Express** - Server framework
- **Prisma ORM** - Database management
- **PostgreSQL** - Database
- **Cloudinary** - Media storage
- **JWT** - Authentication

### Backend Structure

```
backend/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   ├── prisma/        # Prisma schema
│   ├── utils/         # Helper functions
│   └── server.js      # Entry point
└── package.json
```

### API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property (admin)
- `PUT /api/properties/:id` - Update property (admin)
- `DELETE /api/properties/:id` - Delete property (admin)
- `GET /api/dashboard/stats` - Dashboard statistics (admin)

### Backend Commands

```bash
cd backend
npm run dev              # Start dev server with nodemon
npm start                # Start production server
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate Prisma Client
```

## 🧪 Code Quality

### Linting & Formatting

```bash
npm run lint             # Run ESLint on all workspaces
npm run format           # Format code with Prettier
```

### Pre-commit Hooks

This project uses Husky and lint-staged for pre-commit hooks:

- Lints staged files
- Formats code with Prettier
- Validates commit messages

## 🌐 Environment Variables

See `.env.example` for all required environment variables.

## 📝 Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit with conventional commits: `git commit -m "feat: add new feature"`
4. Push and create a pull request

## 🚢 Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Railway/Render/Heroku)

1. Set environment variables on your hosting platform
2. Run database migrations: `npx prisma migrate deploy`
3. Start server: `npm start`

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

Shoa Homes Real Estate PLC

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.
