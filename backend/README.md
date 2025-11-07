# Shoa Homes Backend API

This is the backend API for the Shoa Homes Real Estate platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp ../.env.example .env
# Edit .env with your actual values
```

3. Run Prisma migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property (protected)
- `PUT /api/properties/:id` - Update property (protected)
- `DELETE /api/properties/:id` - Delete property (protected)
- `POST /api/properties/:id/images` - Upload property images (protected)

### Inquiries
- `POST /api/inquiries` - Submit inquiry
- `GET /api/inquiries` - Get all inquiries (protected)
- `PATCH /api/inquiries/:id/read` - Mark inquiry as read (protected)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (protected)

## Development

The backend uses:
- Express.js for the server
- Prisma ORM for database management
- PostgreSQL for the database
- JWT for authentication
- Cloudinary for image storage

## Note

This is currently using mock data for development. Database integration will be added in production.
