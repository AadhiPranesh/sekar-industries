# Sekar Industries - Backend Implementation Plan

**Project:** Sekar Industries Furniture E-commerce Platform  
**Created:** January 30, 2026  
**Execution Mode:** Autonomous Agent  
**Tech Stack:** Node.js, Express, MongoDB, JWT, React

---

## 🎯 AUTONOMOUS AGENT EXECUTION INSTRUCTIONS

**This plan is designed for autonomous execution. Each version contains:**
- ✅ Complete task list with file paths
- ✅ Code examples and templates
- ✅ Success criteria
- ✅ No decisions required - all specifications included

**Agent should:**
1. Execute versions sequentially (v1.0 → v1.1 → v1.2 → v2.0 → v2.1 → v3.0)
2. Mark tasks as complete with ✅
3. Test each version before proceeding to next
4. Report blockers immediately
5. Never ask user for decisions - follow the plan exactly

---

## 📋 VERSION ROADMAP

| Version | Name | Features | Priority |
|---------|------|----------|----------|
| v1.0 | Authentication & Database | User auth, JWT, MongoDB | CRITICAL |
| v1.1 | Public Product API | Product browsing, categories | HIGH |
| v1.2 | Admin Product CRUD | Product management | HIGH |
| v2.0 | Sales Recording | Sales entry, stock management | MEDIUM |
| v2.1 | Analytics & Insights | Dashboard, product health | MEDIUM |
| v3.0 | Frontend Integration | React + API connection | HIGH |

---

# VERSION 1.0 - Authentication & Database Setup

**Goal:** Backend foundation with user authentication  
**Duration:** ~2 hours  
**Dependencies:** None  
**Blockers:** MongoDB must be running

## Tasks

### ✅ Task 1.0.1: Environment Configuration

**File:** `backend/.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sekar-industries
JWT_SECRET=sk_prod_2026_sekar_industries_jwt_secret_key_change_me
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

**File:** `backend/.gitignore`
```
node_modules/
.env
.DS_Store
*.log
coverage/
dist/
build/
```

---

### ✅ Task 1.0.2: Database Configuration

**File:** `backend/config/database.js`
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        mongoose.connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });

    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
```

---

### ✅ Task 1.0.3: User Model

**File:** `backend/models/User.js`
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    );
};

module.exports = mongoose.model('User', userSchema);
```

---

### ✅ Task 1.0.4: Authentication Controller

**File:** `backend/controllers/authController.js`
```javascript
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password
        });

        // Generate tokens
        const accessToken = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();

        // Remove password from response
        user.password = undefined;

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if email and password provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Generate tokens
        const accessToken = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();

        // Remove password from response
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logoutUser = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        // Verify refresh token
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Generate new access token
        const newAccessToken = user.generateAuthToken();

        res.status(200).json({
            success: true,
            data: {
                accessToken: newAccessToken
            }
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token'
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            user: req.user
        }
    });
};
```

---

### ✅ Task 1.0.5: Authentication Middleware

**File:** `backend/middleware/authMiddleware.js`
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized - No token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await User.findById(decoded.id).select('-password');

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized - User not found'
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized - Invalid token'
        });
    }
};

// Restrict to specific roles
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};
```

---

### ✅ Task 1.0.6: Validation Middleware

**File:** `backend/middleware/validationMiddleware.js`
```javascript
const { body, validationResult } = require('express-validator');

// Validation rules for signup
exports.validateSignup = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('phone')
        .matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Validation rules for login
exports.validateLogin = [
    body('email')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    
    next();
};
```

---

### ✅ Task 1.0.7: Error Handling Middleware

**File:** `backend/middleware/errorMiddleware.js`
```javascript
// Global error handler
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error.message = 'Resource not found';
        error.statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        error.message = 'Duplicate field value entered';
        error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        error.message = Object.values(err.errors).map(e => e.message).join(', ');
        error.statusCode = 400;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error.message = 'Invalid token';
        error.statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        error.message = 'Token expired';
        error.statusCode = 401;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
```

---

### ✅ Task 1.0.8: Authentication Routes

**File:** `backend/routes/authRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateSignup, validateLogin, handleValidationErrors } = require('../middleware/validationMiddleware');
const {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
    getCurrentUser
} = require('../controllers/authController');

router.post('/signup', validateSignup, handleValidationErrors, registerUser);
router.post('/login', validateLogin, handleValidationErrors, loginUser);
router.post('/logout', protect, logoutUser);
router.post('/refresh', refreshToken);
router.get('/me', protect, getCurrentUser);

module.exports = router;
```

---

### ✅ Task 1.0.9: Express Server

**File:** `backend/server.js`
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
```

---

### ✅ Task 1.0.10: Update package.json Scripts

**File:** `backend/package.json` (add to scripts section)
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## v1.0 Testing Checklist

```bash
# Start MongoDB
mongod

# Start backend
cd backend
npm run dev

# Test endpoints with curl or Postman:

# 1. Health check
GET http://localhost:5000/health

# 2. Register user
POST http://localhost:5000/api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}

# 3. Login
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

# 4. Get current user (use token from login)
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your_access_token>

# 5. Test without token (should return 401)
GET http://localhost:5000/api/auth/me
```

**Success Criteria:**
- ✅ Server starts without errors
- ✅ MongoDB connected message appears
- ✅ Signup creates user and returns tokens
- ✅ Login returns tokens
- ✅ /me endpoint returns user data with valid token
- ✅ /me endpoint returns 401 without token

---

# VERSION 1.1 - Public Product API

[Continue with v1.1 tasks... Would you like me to continue with the full plan?]

---

**AGENT CHECKPOINT:** After completing v1.0, report status and proceed to v1.1
