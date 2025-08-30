import 'dotenv/config';
import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const router = Router();

// In-memory user storage (replace with database in production)
const users: any[] = [];

// Passport Google Strategy (conditionally enabled)
const hasGoogleOAuth = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

if (hasGoogleOAuth) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "http://localhost:5001/api/google/auth/callback"
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    console.log('🔍 Passport Google Strategy - Tokens received:');
    console.log('🔍 Access Token:', !!accessToken);
    console.log('🔍 Refresh Token:', !!refreshToken);
    console.log('🔍 Profile ID:', profile.id);
    
    if (!refreshToken) {
      console.error('❌ No refresh token in Passport strategy!');
      console.error('🔧 User should revoke access and re-authenticate');
    } else {
      console.log('✅ Refresh token received in Passport strategy!');
    }
    try {
      // Check if user already exists
      let user = users.find(u => u.googleId === profile.id);
      
      if (!user) {
        // Create new user
        user = {
          id: Date.now().toString(),
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value,
          accessToken,
          refreshToken,
          createdAt: new Date().toISOString()
        };
        users.push(user);
      } else {
        // Update existing user's tokens
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

// Validation middleware
const validateSignup = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Google OAuth routes (registered only if configured)
if (hasGoogleOAuth) {
  router.get('/google', passport.authenticate('google', { 
    scope: [
      'profile', 
      'email', 
      'https://www.googleapis.com/auth/gmail.readonly', 
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ],
    accessType: 'offline',
    prompt: 'consent'
  }));

  router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      const user = req.user as any;
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET || 'defaultsecret',
        { expiresIn: '2h' }
      );
      
      // Redirect to frontend with token (updated to port 8080)
      res.redirect(`http://localhost:8080?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
    }
  );
} else {
  // Graceful response if Google OAuth is not configured
  router.get('/google', (_req, res) => {
    res.status(503).json({ success: false, error: 'Google OAuth not configured on server' });
  });
  router.get('/google/callback', (_req, res) => {
    res.status(503).json({ success: false, error: 'Google OAuth not configured on server' });
  });
}

// Signup endpoint
router.post('/signup', validateSignup, async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
});

// Login endpoint
router.post('/login', validateLogin, async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '2h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to login'
    });
  }
});

export default router;