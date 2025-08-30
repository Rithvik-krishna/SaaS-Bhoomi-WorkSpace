import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import gmailService, { EmailData, EmailSummary, EmailDraft } from '../services/gmailService';

const router = Router();

// Middleware to verify user is authenticated
const authenticateUser = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  next();
};

// Set Gmail credentials from user's OAuth tokens
const setGmailCredentials = (req: any, res: any, next: any) => {
  try {
    const user = req.user;
    if (user.accessToken) {
      gmailService.setCredentials(user.accessToken, user.refreshToken);
      next();
    } else {
      res.status(401).json({ success: false, error: 'Gmail access token not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to set Gmail credentials' });
  }
};

// Get emails from Gmail
router.get('/emails', authenticateUser, setGmailCredentials, async (req, res) => {
  try {
    const maxResults = parseInt(req.query.maxResults as string) || 10;
    const emails = await gmailService.getEmails(maxResults);
    
    res.json({
      success: true,
      data: emails,
      count: emails.length
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch emails'
    });
  }
});

// Get specific email details
router.get('/emails/:emailId', authenticateUser, setGmailCredentials, async (req, res) => {
  try {
    const { emailId } = req.params;
    const email = await gmailService.getEmailDetails(emailId);
    
    if (!email) {
      return res.status(404).json({
        success: false,
        error: 'Email not found'
      });
    }
    
    res.json({
      success: true,
      data: email
    });
  } catch (error) {
    console.error('Error fetching email details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch email details'
    });
  }
});

// Summarize an email
router.post('/emails/:emailId/summarize', authenticateUser, setGmailCredentials, async (req, res) => {
  try {
    const { emailId } = req.params;
    const email = await gmailService.getEmailDetails(emailId);
    
    if (!email) {
      return res.status(404).json({
        success: false,
        error: 'Email not found'
      });
    }
    
    const summary = await gmailService.summarizeEmail(email);
    
    res.json({
      success: true,
      data: {
        email,
        summary
      }
    });
  } catch (error) {
    console.error('Error summarizing email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to summarize email'
    });
  }
});

// Generate email draft
const validateDraftRequest = [
  body('context').notEmpty().withMessage('Context is required'),
  body('recipient').isEmail().withMessage('Valid recipient email is required'),
  body('purpose').notEmpty().withMessage('Purpose is required'),
  body('tone').optional().isIn(['formal', 'casual', 'professional']).withMessage('Invalid tone')
];

router.post('/draft', authenticateUser, setGmailCredentials, validateDraftRequest, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { context, recipient, purpose, tone = 'professional' } = req.body;
    
    const draft = await gmailService.generateEmailDraft(context, recipient, purpose, tone);
    
    res.json({
      success: true,
      data: draft
    });
  } catch (error) {
    console.error('Error generating email draft:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate email draft'
    });
  }
});

// Send email
const validateSendEmail = [
  body('to').isEmail().withMessage('Valid recipient email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('body').notEmpty().withMessage('Email body is required')
];

router.post('/send', authenticateUser, setGmailCredentials, validateSendEmail, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { to, subject, body } = req.body;
    
    const success = await gmailService.sendEmail(to, subject, body);
    
    if (success) {
      res.json({
        success: true,
        message: 'Email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send email'
      });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email'
    });
  }
});

// Get email analytics/summary
router.get('/analytics', authenticateUser, setGmailCredentials, async (req, res) => {
  try {
    const emails = await gmailService.getEmails(50); // Get more emails for analytics
    
    // Basic analytics
    const analytics = {
      totalEmails: emails.length,
      unreadCount: emails.filter(email => !email.id.includes('UNREAD')).length,
      recentEmails: emails.slice(0, 5).map(email => ({
        id: email.id,
        subject: email.subject,
        from: email.from,
        date: email.date
      })),
      topSenders: emails.reduce((acc: any, email) => {
        const sender = email.from.split('<')[0].trim();
        acc[sender] = (acc[sender] || 0) + 1;
        return acc;
      }, {})
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

export default router;
