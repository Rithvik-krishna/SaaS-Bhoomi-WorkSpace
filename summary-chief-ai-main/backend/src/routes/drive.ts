import express from 'express';
import GoogleDriveService from '../services/googleDriveService';
import tokenStorage from '../services/tokenStorage';

const router = express.Router();

/**
 * GET /api/drive/files
 * Get user's Drive files
 */
router.get('/files', async (req, res) => {
  try {
    const { user_id, maxResults = 20 } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Get user tokens
    const userToken = tokenStorage.getUserTokens(user_id as string);
    
    if (!userToken) {
      return res.status(401).json({
        success: false,
        error: 'User not connected to Google'
      });
    }

    // Create Drive service instance
    const driveService = new GoogleDriveService(
      userToken.access_token,
      userToken.refresh_token
    );

    // Get files
    const files = await driveService.getFiles(Number(maxResults));

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Error fetching Drive files:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Drive files'
    });
  }
});

/**
 * GET /api/drive/files/:fileId
 * Get file metadata
 */
router.get('/files/:fileId', async (req, res) => {
  try {
    const { user_id } = req.query;
    const { fileId } = req.params;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Get user tokens
    const userToken = tokenStorage.getUserTokens(user_id as string);
    
    if (!userToken) {
      return res.status(401).json({
        success: false,
        error: 'User not connected to Google'
      });
    }

    // Create Drive service instance
    const driveService = new GoogleDriveService(
      userToken.access_token,
      userToken.refresh_token
    );

    // Get file metadata
    const file = await driveService.getFileMetadata(fileId);

    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    console.error('Error fetching file metadata:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch file metadata'
    });
  }
});

/**
 * GET /api/drive/files/:fileId/content
 * Get file content (for text files)
 */
router.get('/files/:fileId/content', async (req, res) => {
  try {
    const { user_id } = req.query;
    const { fileId } = req.params;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Get user tokens
    const userToken = tokenStorage.getUserTokens(user_id as string);
    
    if (!userToken) {
      return res.status(401).json({
        success: false,
        error: 'User not connected to Google'
      });
    }

    // Create Drive service instance
    const driveService = new GoogleDriveService(
      userToken.access_token,
      userToken.refresh_token
    );

    // Get file content
    const content = await driveService.getFileContent(fileId);

    res.json({
      success: true,
      data: {
        content,
        fileId
      }
    });
  } catch (error) {
    console.error('Error fetching file content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch file content'
    });
  }
});

/**
 * GET /api/drive/search
 * Search files
 */
router.get('/search', async (req, res) => {
  try {
    const { user_id, query, maxResults = 20 } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    // Get user tokens
    const userToken = tokenStorage.getUserTokens(user_id as string);
    
    if (!userToken) {
      return res.status(401).json({
        success: false,
        error: 'User not connected to Google'
      });
    }

    // Create Drive service instance
    const driveService = new GoogleDriveService(
      userToken.access_token,
      userToken.refresh_token
    );

    // Search files
    const files = await driveService.searchFiles(
      query as string,
      Number(maxResults)
    );

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Error searching files:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search files'
    });
  }
});

/**
 * GET /api/drive/files/type/:mimeType
 * Get files by MIME type
 */
router.get('/files/type/:mimeType', async (req, res) => {
  try {
    const { user_id, maxResults = 20 } = req.query;
    const { mimeType } = req.params;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Get user tokens
    const userToken = tokenStorage.getUserTokens(user_id as string);
    
    if (!userToken) {
      return res.status(400).json({
        success: false,
        error: 'User not connected to Google'
      });
    }

    // Create Drive service instance
    const driveService = new GoogleDriveService(
      userToken.access_token,
      userToken.refresh_token
    );

    // Get files by type
    const files = await driveService.getFilesByType(
      mimeType,
      Number(maxResults)
    );

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Error fetching files by type:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch files by type'
    });
  }
});

export default router;
