import express from 'express';
import { UserService } from '../services/userService';
import User from '../models/User';

const router = express.Router();

/**
 * GET /api/database/users
 * Get all users (for debugging)
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-googleTokens.access_token -googleTokens.refresh_token');
    
    res.json({
      success: true,
      data: {
        count: users.length,
        users: users.map(user => ({
          id: user._id,
          email: user.email,
          name: user.name,
          googleId: user.googleId,
          hasGoogleTokens: !!user.googleTokens,
          googleProfile: user.googleProfile ? {
            id: user.googleProfile.id,
            email: user.googleProfile.email,
            name: user.googleProfile.name,
            picture: user.googleProfile.picture
          } : null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

/**
 * GET /api/database/users/:userId
 * Get specific user details
 */
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-googleTokens.access_token -googleTokens.refresh_token');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        googleId: user.googleId,
        hasGoogleTokens: !!user.googleTokens,
        googleTokensInfo: user.googleTokens ? {
          scope: user.googleTokens.scope,
          expiry_date: user.googleTokens.expiry_date,
          hasAccessToken: !!user.googleTokens.access_token,
          hasRefreshToken: !!user.googleTokens.refresh_token
        } : null,
        googleProfile: user.googleProfile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

/**
 * GET /api/database/stats
 * Get database statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const usersWithGoogle = await User.countDocuments({ googleId: { $exists: true, $ne: null } });
    const usersWithTokens = await User.countDocuments({ 'googleTokens.access_token': { $exists: true } });
    
    res.json({
      success: true,
      data: {
        totalUsers,
        usersWithGoogle,
        usersWithTokens,
        googleConnectionRate: totalUsers > 0 ? ((usersWithGoogle / totalUsers) * 100).toFixed(2) + '%' : '0%',
        tokenStorageRate: totalUsers > 0 ? ((usersWithTokens / totalUsers) * 100).toFixed(2) + '%' : '0%'
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats'
    });
  }
});

/**
 * DELETE /api/database/users/:userId
 * Delete a user (for testing)
 */
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await UserService.deleteUser(userId);
    
    if (result) {
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

export default router;
