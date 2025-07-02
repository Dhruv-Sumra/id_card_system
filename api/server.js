import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import routes
import playerRoutes from '../backend/routes/playerRoutes.js';
import idcardRoutes from '../backend/routes/idCardRoutes.js';  

// Import middleware
import { errorHandler } from '../backend/middleware/errorHandler.js';

const app = express();

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for Vercel deployment
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb'
}));

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, '../backend/uploads'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));
app.use('/idcards', express.static(path.join(__dirname, '../backend/idcards'), {
  maxAge: '7d',
  etag: true,
  lastModified: true
}));

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/idcards', idcardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.set('Cache-Control', 'public, max-age=30');
  res.json({ 
    message: 'Para Sports ID Card API is running!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.set('Cache-Control', 'public, max-age=60');
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.json({ 
    message: 'Para Sports ID Card Generator API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      test: '/api/test',
      players: '/api/players',
      idcards: '/api/idcards'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://gujaratparasports:paraSports07@parasports.sc63qgr.mongodb.net/?retryWrites=true&w=majority&appName=ParaSports';
    
    await mongoose.connect(mongoURI, {
      maxPoolSize: 50,
      minPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 60000,
      bufferCommands: false,
      bufferMaxEntries: 0,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority',
      readPreference: 'secondaryPreferred',
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  }
};

// Connect to MongoDB
connectDB();

// Export for Vercel
export default app; 