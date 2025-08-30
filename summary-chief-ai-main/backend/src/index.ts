import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import gmailRoutes from './routes/gmail';
import aiRoutes from './routes/ai';
import calendarRoutes from './routes/calendar';
import googleRoutes from './routes/google';
import driveRoutes from './routes/drive';
import documentRoutes from './routes/documents';
import databaseRoutes from './routes/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:8083'
  ],
  credentials: true
}));
app.use(express.json());

// Session middleware (required for passport)
app.use(session({
  secret: process.env.JWT_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gmail', gmailRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/drive', driveRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/database', databaseRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'WorkSpace AI Backend API',
            version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          gmail: '/api/gmail',
          ai: '/api/ai',
          calendar: '/api/calendar',
          google: '/api/google',
          drive: '/api/drive',
          documents: '/api/documents',
          database: '/api/database'
        }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
      console.log(`📊 API: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
      console.log(`🗄️ MongoDB: Connected`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();