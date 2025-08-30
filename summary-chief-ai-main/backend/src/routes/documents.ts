import express from 'express';
import DocumentService, { DocumentSummary, MeetingNotes } from '../services/documentService';
import tokenStorage from '../services/tokenStorage';

const router = express.Router();

/**
 * POST /api/documents/summarize
 * Summarize a document using AI
 */
router.post('/summarize', async (req, res) => {
  try {
    const { user_id, fileId } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    if (!fileId) {
      return res.status(400).json({
        success: false,
        error: 'File ID is required'
      });
    }

    // Get user tokens
    const userToken = tokenStorage.getUserTokens(user_id);
    
    if (!userToken) {
      return res.status(401).json({
        success: false,
        error: 'User not connected to Google'
      });
    }

    // Create document service instance
    const documentService = new DocumentService(
      userToken.access_token,
      userToken.refresh_token
    );

    // Summarize document
    const summary = await documentService.summarizeDocument(fileId);

    res.json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    console.error('Error summarizing document:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to summarize document'
    });
  }
});

/**
 * POST /api/documents/transcribe
 * Transcribe an audio/video file and generate meeting notes
 */
router.post('/transcribe', async (req, res) => {
  try {
    const { user_id, fileId } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    if (!fileId) {
      return res.status(400).json({
        success: false,
        error: 'File ID is required'
      });
    }

    // Get user tokens
    const userToken = tokenStorage.getUserTokens(user_id);
    
    if (!userToken) {
      return res.status(401).json({
        success: false,
        error: 'User not connected to Google'
      });
    }

    // Create document service instance
    const documentService = new DocumentService(
      userToken.access_token,
      userToken.refresh_token
    );

    // Transcribe file and generate meeting notes
    const meetingNotes = await documentService.transcribeFile(fileId);

    res.json({
      success: true,
      data: meetingNotes
    });
  } catch (error: any) {
    console.error('Error transcribing file:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to transcribe file'
    });
  }
});

/**
 * GET /api/documents/supported-types
 * Get list of supported file types for summarization and transcription
 */
router.get('/supported-types', (req, res) => {
  res.json({
    success: true,
    data: {
      summarization: [
        'application/vnd.google-apps.document', // Google Docs
        'application/pdf', // PDF files
        'text/plain', // Text files
        'application/msword', // Word documents
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // Word documents (.docx)
      ],
      transcription: [
        'audio/mpeg', // MP3
        'audio/wav', // WAV
        'audio/ogg', // OGG
        'audio/mp4', // M4A
        'video/mp4', // MP4
        'video/avi', // AVI
        'video/mov', // MOV
        'video/webm' // WebM
      ]
    }
  });
});

export default router;
