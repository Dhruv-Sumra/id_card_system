import mongoose from 'mongoose';

// Import routes
import playerRoutes from '../backend/routes/playerRoutes.js';
import idcardRoutes from '../backend/routes/idCardRoutes.js';  

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://gujaratparasports:paraSports07@parasports.sc63qgr.mongodb.net/?retryWrites=true&w=majority&appName=ParaSports';
    
    if (mongoose.connection.readyState === 0) {
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
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  }
};

// Connect to MongoDB
connectDB();

// Vercel serverless function handler
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { path } = req.query;
    const fullPath = Array.isArray(path) ? path.join('/') : path || '';

    // Health check route
    if (fullPath === 'health') {
      return res.status(200).json({ 
        message: 'Para Sports ID Card API is running!',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    }

    // Test route
    if (fullPath === 'test') {
      return res.status(200).json({ 
        message: 'Server is working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    }

    // Route to appropriate handler based on path
    if (fullPath.startsWith('players')) {
      // Handle player routes
      const playerPath = fullPath.replace('players', '');
      return await handlePlayerRoutes(req, res, playerPath);
    }

    if (fullPath.startsWith('idcards')) {
      // Handle ID card routes
      const idcardPath = fullPath.replace('idcards', '');
      return await handleIdCardRoutes(req, res, idcardPath);
    }

    // Default response
    return res.status(404).json({ 
      error: 'Route not found',
      availableRoutes: ['/api/health', '/api/test', '/api/players', '/api/idcards']
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Handle player routes
async function handlePlayerRoutes(req, res, path) {
  try {
    // Import the router and handle the request
    const router = playerRoutes;
    
    // Create a mock request object for the router
    const mockReq = {
      ...req,
      url: path,
      path: path
    };

    // Handle the route using the router
    return await router(mockReq, res);
  } catch (error) {
    console.error('Player route error:', error);
    return res.status(500).json({ error: 'Player route error', message: error.message });
  }
}

// Handle ID card routes
async function handleIdCardRoutes(req, res, path) {
  try {
    // Import the router and handle the request
    const router = idcardRoutes;
    
    // Create a mock request object for the router
    const mockReq = {
      ...req,
      url: path,
      path: path
    };

    // Handle the route using the router
    return await router(mockReq, res);
  } catch (error) {
    console.error('ID card route error:', error);
    return res.status(500).json({ error: 'ID card route error', message: error.message });
  }
} 