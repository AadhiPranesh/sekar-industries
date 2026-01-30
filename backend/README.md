# Sekar Industries Backend

Backend API for Sekar Industries e-commerce platform with authentication using Express, Node.js, and MongoDB.

## Features

- User Registration (Signup)
- User Login
- Session-based authentication (no JWT)
- Password hashing with bcrypt
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` file and update MongoDB URI if needed
   - Default MongoDB URI: `mongodb://localhost:27017/sekar-industries`

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will run on: **http://localhost:5000**

## API Endpoints

### Authentication

#### 1. Signup
- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

#### 2. Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. Logout
- **URL**: `/api/auth/logout`
- **Method**: `POST`

#### 4. Get Current User
- **URL**: `/api/auth/me`
- **Method**: `GET`

#### 5. Health Check
- **URL**: `/api/health`
- **Method**: `GET`

## Database Schema

### User Model
```javascript
{
  name: String (required, min 3 chars),
  email: String (required, unique, valid email),
  phone: String (required, 10 digits),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date
}
```

## Testing with MongoDB

### Local MongoDB:
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or start manually
mongod
```

### MongoDB Atlas:
Update `.env` file with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sekar-industries
```

## Frontend Integration

Frontend should make requests to `http://localhost:5000/api/auth/*` with:
- `credentials: 'include'` for session cookies
- `Content-Type: application/json` header

## Security Notes

- Passwords are hashed using bcrypt
- Session secret should be changed in production
- CORS is configured for `http://localhost:5174`
- Use HTTPS in production
