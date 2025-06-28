# 🔧 Detailed Backend Features

This document provides a detailed breakdown of the next-generation backend features for the real-time chat application.

---

## 🔐 Authentication & Security

### 1. Multi-Factor Authentication (MFA)

**Description**: Implement TOTP-based multi-factor authentication to provide an extra layer of security for user accounts.

**Implementation Details**:
- Use `speakeasy` library for TOTP generation
- Store secrets in User model
- Provide recovery codes for account recovery
- Integrate with existing JWT authentication

**Code Example**:
```javascript
// mfaController.js
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import User from '../models/userModel.js';

export const setupMFA = async (req, res) => {
  try {
    const { userId } = req.user;
    
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: 'ChatApp',
      issuer: 'YourApp',
      length: 20
    });
    
    // Generate recovery codes
    const recoveryCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );
    
    // Update user with MFA data
    await User.findByIdAndUpdate(userId, {
      mfaSecret: secret.base32,
      mfaEnabled: false,
      recoveryCodes: recoveryCodes.map(code => ({
        code: await bcrypt.hash(code, 10),
        used: false
      }))
    });
    
    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    
    res.json({
      success: true,
      qrCode: qrCodeUrl,
      secret: secret.base32,
      recoveryCodes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyMFA = async (req, res) => {
  try {
    const { token, userId } = req.body;
    
    const user = await User.findById(userId);
    if (!user.mfaSecret) {
      return res.status(400).json({ success: false, message: 'MFA not set up' });
    }
    
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time steps tolerance
    });
    
    if (verified) {
      // Enable MFA if not already enabled
      if (!user.mfaEnabled) {
        await User.findByIdAndUpdate(userId, { mfaEnabled: true });
      }
      
      res.json({ success: true, message: 'MFA verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid MFA token' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

**Database Schema Update**:
```javascript
// userModel.js - Add MFA fields
const userSchema = new mongoose.Schema({
  // ... existing fields
  mfaSecret: {
    type: String,
    select: false
  },
  mfaEnabled: {
    type: Boolean,
    default: false
  },
  recoveryCodes: [{
    code: String,
    used: {
      type: Boolean,
      default: false
    }
  }]
});
```

**Success Metrics**:
- Users can enable/disable MFA from profile settings
- Login attempts fail without valid TOTP when MFA is enabled
- Recovery codes work for account recovery

---

### 2. Advanced Security Features

**Description**: Implement comprehensive security measures to protect against common web vulnerabilities.

**Implementation Details**:
- Input validation and sanitization
- Rate limiting on sensitive endpoints
- Security headers with Helmet
- Content Security Policy (CSP)

**Code Example**:
```javascript
// securityMiddleware.js
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import validator from 'express-validator';

// Rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Input validation middleware
export const validateUserInput = [
  validator.body('email').isEmail().normalizeEmail(),
  validator.body('password').isLength({ min: 8 }),
  validator.body('name').trim().isLength({ min: 2, max: 50 }),
  validator.sanitizeBody('*').escape(),
];

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "ws:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// XSS protection
export const xssProtection = (req, res, next) => {
  // Sanitize user input
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .replace(/[<>]/g, '')
          .trim();
      }
    });
  }
  next();
};
```

**Success Metrics**:
- OWASP Top 10 vulnerabilities mitigated
- Security audits pass with no critical issues
- Rate limiting prevents brute force attacks

---

## ⚡ Performance & Caching

### 3. Redis Caching Strategy

**Description**: Implement Redis caching to reduce database load and improve API response times.

**Implementation Details**:
- Cache frequently accessed data (user sessions, recent messages, profiles)
- Implement cache invalidation strategies
- Use Redis for session storage

**Code Example**:
```javascript
// cacheService.js
import Redis from 'ioredis';
import { promisify } from 'util';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

export class CacheService {
  constructor() {
    this.redis = redis;
    this.defaultTTL = 3600; // 1 hour
  }

  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = this.defaultTTL) {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async invalidatePattern(pattern) {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache pattern invalidation error:', error);
      return false;
    }
  }
}

// Cached controller methods
export const getCachedUser = async (userId) => {
  const cacheKey = `user:${userId}`;
  const cacheService = new CacheService();
  
  // Try cache first
  let user = await cacheService.get(cacheKey);
  
  if (!user) {
    // Fetch from database
    user = await User.findById(userId).select('-password');
    
    if (user) {
      // Cache for 1 hour
      await cacheService.set(cacheKey, user, 3600);
    }
  }
  
  return user;
};

export const getCachedChats = async (userId) => {
  const cacheKey = `chats:${userId}`;
  const cacheService = new CacheService();
  
  let chats = await cacheService.get(cacheKey);
  
  if (!chats) {
    chats = await Chat.find({ users: userId })
      .populate('users', '-password')
      .populate('latestMessage')
      .sort('-updatedAt');
    
    // Cache for 30 minutes
    await cacheService.set(cacheKey, chats, 1800);
  }
  
  return chats;
};
```

**Success Metrics**:
- API response times reduced by 50%+ for cached endpoints
- Database read operations decreased significantly
- Cache hit rate above 80%

---

### 4. Database Optimization

**Description**: Optimize database performance through indexing, query optimization, and connection pooling.

**Implementation Details**:
- Create strategic indexes for frequently queried fields
- Optimize MongoDB queries
- Implement connection pooling
- Add database monitoring

**Code Example**:
```javascript
// databaseOptimization.js
import mongoose from 'mongoose';

// Connection pooling configuration
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Indexes for optimal query performance
export const createIndexes = async () => {
  try {
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ name: 'text' });
    
    // Chat indexes
    await Chat.collection.createIndex({ users: 1 });
    await Chat.collection.createIndex({ updatedAt: -1 });
    await Chat.collection.createIndex({ isGroup: 1 });
    
    // Message indexes
    await Message.collection.createIndex({ chatId: 1, createdAt: -1 });
    await Message.collection.createIndex({ sender: 1 });
    await Message.collection.createIndex({ content: 'text' });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Index creation error:', error);
  }
};

// Optimized query methods
export const getOptimizedChats = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const chats = await Chat.aggregate([
    { $match: { users: mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'users',
        localField: 'users',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    {
      $lookup: {
        from: 'messages',
        localField: '_id',
        foreignField: 'chatId',
        as: 'latestMessage',
        pipeline: [
          { $sort: { createdAt: -1 } },
          { $limit: 1 }
        ]
      }
    },
    { $unwind: { path: '$latestMessage', preserveNullAndEmptyArrays: true } },
    { $sort: { updatedAt: -1 } },
    { $skip: skip },
    { $limit: limit }
  ]);
  
  return chats;
};
```

**Success Metrics**:
- Query execution time reduced by 60%+
- Database connection pool efficiently managed
- Index usage optimized for common queries

---

## 🏗️ Architecture & Scalability

### 5. Microservices Architecture

**Description**: Refactor the monolithic backend into microservices for better scalability and maintainability.

**Implementation Details**:
- Decompose into Auth, Chat, Notification, and File services
- Implement service-to-service communication
- Use message brokers for async communication
- Independent deployment and scaling

**Code Example**:
```javascript
// Service Architecture Example

// Auth Service (auth-service/index.js)
import express from 'express';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 3001;

app.post('/auth/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

// Chat Service (chat-service/index.js)
import express from 'express';
import { createClient } from 'redis';
import Message from './models/Message.js';

const app = express();
const PORT = process.env.CHAT_SERVICE_PORT || 3002;
const redis = createClient();

app.post('/chat/message', async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;
    
    const message = new Message({
      chatId,
      sender: senderId,
      content
    });
    
    await message.save();
    
    // Publish to Redis for real-time updates
    await redis.publish('new-message', JSON.stringify(message));
    
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// API Gateway (gateway/index.js)
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

// Route requests to appropriate services
app.use('/auth', createProxyMiddleware({
  target: 'http://auth-service:3001',
  changeOrigin: true
}));

app.use('/chat', createProxyMiddleware({
  target: 'http://chat-service:3002',
  changeOrigin: true
}));

app.use('/notifications', createProxyMiddleware({
  target: 'http://notification-service:3003',
  changeOrigin: true
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
```

**Docker Compose for Microservices**:
```yaml
# docker-compose.yml
version: '3.8'

services:
  auth-service:
    build: ./auth-service
    ports:
      - "3001:3001"
    environment:
      - MONGO_DB_URL=mongodb://mongo:27017/auth
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
      - redis

  chat-service:
    build: ./chat-service
    ports:
      - "3002:3002"
    environment:
      - MONGO_DB_URL=mongodb://mongo:27017/chat
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis

  notification-service:
    build: ./notification-service
    ports:
      - "3003:3003"
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis

  api-gateway:
    build: ./gateway
    ports:
      - "3000:3000"
    depends_on:
      - auth-service
      - chat-service
      - notification-service

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

**Success Metrics**:
- Services can be deployed and scaled independently
- Failure in one service doesn't affect others
- Improved development velocity with team autonomy

---

## 📊 Monitoring & Observability

### 6. Advanced Logging and Monitoring

**Description**: Implement comprehensive logging and monitoring for production readiness.

**Implementation Details**:
- Structured logging with Winston
- Application metrics with Prometheus
- Error tracking with Sentry
- Health check endpoints

**Code Example**:
```javascript
// logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'chat-app' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;

// metrics.js
import prometheus from 'prom-client';

// Create metrics
const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware to collect metrics
export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration / 1000);
    
    httpRequestsTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });
  
  next();
};

// Health check endpoint
export const healthCheck = async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    // Check Redis connection
    await redis.ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
};
```

**Success Metrics**:
- Real-time visibility into application health
- Proactive alerting for critical errors
- Performance metrics tracked and optimized

---

This comprehensive backend feature set will create a robust, scalable, and secure foundation for your chat application. 