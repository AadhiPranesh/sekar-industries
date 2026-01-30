# 🚀 Backend + Frontend Integration Setup Guide

## ✅ Setup Complete!

Your Sekar Industries application is now connected with:
- **Backend**: Express + Node.js + MongoDB
- **Frontend**: React (Vite)
- **Authentication**: Session-based (no JWT)

---

## 📋 What's Been Set Up

### Backend (`/backend`)
- ✅ Express server with session authentication
- ✅ MongoDB integration
- ✅ User model with password hashing (bcrypt)
- ✅ Auth routes: signup, login, logout
- ✅ CORS configured for frontend
- ✅ Server running on port 5000

### Frontend (`/frontend`)
- ✅ Login page connected to backend API
- ✅ Signup page connected to backend API
- ✅ API calls with credentials for sessions

---

## 🏃 Running the Application

### 1. Start MongoDB
Make sure MongoDB is running on your machine:
```bash
# Windows - Start MongoDB service
net start MongoDB

# Or check if MongoDB is already running
mongod --version
```

### 2. Start Backend Server
```bash
cd backend
npm run dev
```
**Backend URL**: http://localhost:5000

### 3. Start Frontend Development Server
```bash
cd frontend
npm run dev
```
**Frontend URL**: http://localhost:5174

---

## 🧪 Testing the Authentication

### Test Signup:
1. Go to: http://localhost:5174/signup
2. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 9876543210
   - Password: password123
3. Click "Sign Up"
4. You'll be redirected to login page

### Test Login:
1. Go to: http://localhost:5174/login
2. Enter credentials:
   - Email: john@example.com
   - Password: password123
3. Click "Sign In"
4. You'll be redirected to home page

---

## 📁 Project Structure

```
sekar-industries/
├── backend/
│   ├── models/
│   │   └── User.js          # User schema with password hashing
│   ├── routes/
│   │   └── auth.js          # Auth endpoints
│   ├── .env                 # Environment variables
│   ├── .gitignore           # Git ignore file
│   ├── package.json         # Backend dependencies
│   ├── server.js            # Express server setup
│   └── README.md            # Backend documentation
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx    # ✅ Connected to backend
    │   │   └── Signup.jsx   # ✅ Connected to backend
    │   └── ...
    └── ...
```

---

## 🔐 User Fields

The User model stores:
- **name**: Full name (min 3 characters)
- **email**: Email address (unique, validated)
- **phone**: Phone number (10 digits)
- **password**: Hashed password (min 6 characters)
- **role**: user/admin (default: user)
- **createdAt**: Registration timestamp

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new user account |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user info |
| GET | `/api/health` | Server health check |

---

## 🛠️ Environment Variables

**Backend `.env` file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sekar-industries
SESSION_SECRET=sekar-industries-secret-key-change-in-production
NODE_ENV=development
```

---

## 💾 Database

- **Database Name**: `sekar-industries`
- **Collection**: `users`
- **Connection**: MongoDB local instance (port 27017)

### View your data:
```bash
# Connect to MongoDB shell
mongosh

# Switch to database
use sekar-industries

# View users
db.users.find().pretty()
```

---

## 🐛 Troubleshooting

### Backend won't start:
- Check if MongoDB is running
- Check if port 5000 is available
- Run `npm install` in backend folder

### Frontend can't connect:
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify API URL is `http://localhost:5000`

### Login/Signup fails:
- Check backend terminal for errors
- Check MongoDB connection
- Verify all required fields are filled

---

## 📝 Next Steps

1. ✅ Test signup and login functionality
2. Add user authentication state management
3. Protect routes that require authentication
4. Add logout functionality to frontend
5. Display user info after login
6. Add forgot password functionality

---

## 🔒 Security Notes

- Passwords are hashed with bcrypt (10 salt rounds)
- Sessions stored server-side
- CORS configured for localhost only
- **⚠️ Change SESSION_SECRET before production**
- **⚠️ Use HTTPS in production**
- **⚠️ Add rate limiting for production**

---

## ✨ Everything is Ready!

Both servers are running and connected. Try creating an account and logging in!
