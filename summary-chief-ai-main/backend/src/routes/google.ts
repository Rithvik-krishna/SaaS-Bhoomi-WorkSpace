import express from 'express';
import GoogleAuthService from '../services/googleAuthService';
import { UserService } from '../services/userService';
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * GET /api/google/auth/url
 * Generate OAuth2 authorization URL
 */
router.get('/auth/url', (req, res) => {
  try {
    const forceReauth = req.query.force === 'true';
    const authUrl = GoogleAuthService.generateAuthUrl(forceReauth);
    res.json({
      success: true,
      data: {
        authUrl
      }
    });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate authorization URL'
    });
  }
});

/**
 * GET /api/google/auth/callback
 * Handle OAuth2 callback and exchange code for tokens
 */
router.get('/auth/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Authorization code is required'
      });
    }

    // Exchange code for tokens
    const tokens = await GoogleAuthService.exchangeCodeForTokens(code as string);
    
    // Get user profile
    const userProfile = await GoogleAuthService.getUserProfile(tokens.access_token);
    
    // Find or create user in database
    const user = await UserService.findOrCreateUser(userProfile.email, userProfile.name);
    
    // Update user's Google information
    await UserService.updateGoogleInfo(
      user._id.toString(),
      userProfile.id,
      tokens,
      userProfile
    );

    // Create a JWT token for app authentication
    const appToken = jwt.sign(
      { 
        id: user._id.toString(), 
        email: user.email, 
        name: user.name 
      }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Redirect to frontend with success and app authentication
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const userData = encodeURIComponent(JSON.stringify({
      id: user._id.toString(),
      email: user.email,
      name: user.name
    }));
    res.redirect(`${frontendUrl}/dashboard?google_connected=true&user_id=${user._id.toString()}&token=${appToken}&user=${userData}`);
    
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    res.redirect(`${frontendUrl}/dashboard?google_error=true`);
  }
});

  /**
   * GET /api/google/auth/status
   * Check if user is connected to Google
   */
  router.get('/auth/status', async (req, res) => {
    try {
      const { user_id } = req.query;
      
      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      const user = await UserService.findById(user_id as string);
      
      if (!user || !user.googleTokens) {
        return res.json({
          success: true,
          data: {
            connected: false
          }
        });
      }

      res.json({
        success: true,
        data: {
          connected: true,
          userProfile: user.googleProfile,
          connectedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check authentication status'
      });
    }
  });

  /**
   * POST /api/google/auth/disconnect
   * Disconnect user from Google
   */
  router.post('/auth/disconnect', async (req, res) => {
    try {
      const { user_id } = req.body;
      
      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      // Remove Google tokens from user
      await UserService.updateGoogleInfo(user_id, '', null, null);
      
      res.json({
        success: true,
        message: 'Successfully disconnected from Google'
      });
    } catch (error) {
      console.error('Error disconnecting from Google:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to disconnect from Google'
      });
    }
  });

  /**
   * GET /api/google/auth/tokens
   * Get user's Google tokens (for internal use)
   */
  router.get('/auth/tokens', async (req, res) => {
    try {
      const { user_id } = req.query;
      
      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      const user = await UserService.findById(user_id as string);
      
      if (!user || !user.googleTokens) {
        return res.status(404).json({
          success: false,
          error: 'User not connected to Google'
        });
      }

      res.json({
        success: true,
        data: {
          access_token: user.googleTokens.access_token,
          refresh_token: user.googleTokens.refresh_token,
          scope: user.googleTokens.scope,
          expiry_date: user.googleTokens.expiry_date
        }
      });
    } catch (error) {
      console.error('Error getting tokens:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get tokens'
      });
    }
  });

export default router;
