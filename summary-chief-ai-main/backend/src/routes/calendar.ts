import express from 'express';
import { google } from 'googleapis';
import { CalendarService } from '../services/calendarService';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

// Middleware to get OAuth2 client from session
const getAuthClient = (req: any): OAuth2Client | null => {
  if (!req.user || !req.user.accessToken) {
    console.log('No user or access token found');
    return null;
  }

  console.log('User found:', { 
    id: req.user.id, 
    email: req.user.email,
    hasAccessToken: !!req.user.accessToken,
    hasRefreshToken: !!req.user.refreshToken
  });

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: req.user.accessToken,
    refresh_token: req.user.refreshToken,
  });

  return oauth2Client;
};

// Middleware to check authentication
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  next();
};

/**
 * POST /schedule-meeting
 * Schedule a meeting using natural language command
 */
router.post('/schedule-meeting', requireAuth, async (req, res) => {
  try {
    const { command } = req.body;
    
    if (!command) {
      return res.status(400).json({
        success: false,
        message: 'Meeting command is required'
      });
    }

    const authClient = getAuthClient(req);
    if (!authClient) {
      return res.status(401).json({
        success: false,
        message: 'Google authentication required'
      });
    }

    const calendarService = new CalendarService(authClient);
    const event = await calendarService.scheduleMeeting(command);

    res.json({
      success: true,
      message: 'Meeting scheduled successfully',
      data: {
        event: {
          id: event.id,
          summary: event.summary,
          start: event.start,
          end: event.end,
          attendees: event.attendees,
          description: event.description
        }
      }
    });
  } catch (error: any) {
    console.error('Error scheduling meeting:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to schedule meeting'
    });
  }
});

/**
 * GET /test-auth
 * Test Google Calendar API authentication
 */
router.get('/test-auth', requireAuth, async (req, res) => {
  try {
    const authClient = getAuthClient(req);
    if (!authClient) {
      return res.status(401).json({
        success: false,
        message: 'Google authentication required'
      });
    }

    // Test if we can access the calendar
    const calendar = google.calendar({ version: 'v3', auth: authClient });
    const response = await calendar.calendarList.list();
    
    res.json({
      success: true,
      message: 'Google Calendar API accessible',
      data: {
        calendars: response.data.items?.length || 0,
        primaryCalendar: response.data.items?.find(cal => cal.primary)?.summary || 'Not found'
      }
    });
  } catch (error: any) {
    console.error('Error testing Calendar API:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to test Calendar API',
      details: error.stack
    });
  }
});

/**
 * POST /create-event
 * Create a simple calendar event directly
 */
router.post('/create-event', requireAuth, async (req, res) => {
  try {
    const { title, description, startTime, endTime, attendees, type } = req.body;
    
    console.log('Creating event with data:', { title, description, startTime, endTime, attendees, type });
    
    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Title, start time, and end time are required'
      });
    }

    const authClient = getAuthClient(req);
    if (!authClient) {
      return res.status(401).json({
        success: false,
        message: 'Google authentication required'
      });
    }

    console.log('Auth client created successfully');

    const calendarService = new CalendarService(authClient);
    console.log('Calendar service created');
    
    const event = await calendarService.createSimpleEvent({
      title,
      description,
      startTime,
      endTime,
      attendees: attendees ? attendees.split(',').map(email => email.trim()) : [],
      type
    });

    console.log('Event created successfully:', event.id);

    res.json({
      success: true,
      message: 'Event created successfully',
      data: {
        event: {
          id: event.id,
          summary: event.summary,
          start: event.start,
          end: event.end,
          attendees: event.attendees,
          description: event.description
        }
      }
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create event',
      details: error.stack
    });
  }
});

/**
 * POST /summarize-meeting
 * Generate AI summary of a past meeting
 */
router.post('/summarize-meeting', requireAuth, async (req, res) => {
  try {
    const { meetingId } = req.body;
    
    if (!meetingId) {
      return res.status(400).json({
        success: false,
        message: 'Meeting ID is required'
      });
    }

    const authClient = getAuthClient(req);
    if (!authClient) {
      return res.status(401).json({
        success: false,
        message: 'Google authentication required'
      });
    }

    const calendarService = new CalendarService(authClient);
    const summary = await calendarService.summarizeMeeting(meetingId);

    res.json({
      success: true,
      message: 'Meeting summarized successfully',
      data: {
        summary
      }
    });
  } catch (error: any) {
    console.error('Error summarizing meeting:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to summarize meeting'
    });
  }
});

/**
 * POST /book-interview
 * Book an interview slot
 */
router.post('/book-interview', requireAuth, async (req, res) => {
  try {
    const { candidateName, interviewerEmail, dateRange } = req.body;
    
    if (!candidateName || !interviewerEmail || !dateRange) {
      return res.status(400).json({
        success: false,
        message: 'Candidate name, interviewer email, and date range are required'
      });
    }

    const authClient = getAuthClient(req);
    if (!authClient) {
      return res.status(401).json({
        success: false,
        message: 'Google authentication required'
      });
    }

    const calendarService = new CalendarService(authClient);
    const event = await calendarService.bookInterview(candidateName, interviewerEmail, dateRange);

    res.json({
      success: true,
      message: 'Interview booked successfully',
      data: {
        event: {
          id: event.id,
          summary: event.summary,
          start: event.start,
          end: event.end,
          attendees: event.attendees,
          description: event.description
        }
      }
    });
  } catch (error: any) {
    console.error('Error booking interview:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to book interview'
    });
  }
});

/**
 * GET /upcoming-events
 * Get upcoming calendar events
 */
router.get('/upcoming-events', requireAuth, async (req, res) => {
  try {
    const { maxResults = 10 } = req.query;
    
    const authClient = getAuthClient(req);
    if (!authClient) {
      return res.status(401).json({
        success: false,
        message: 'Google authentication required'
      });
    }

    const calendarService = new CalendarService(authClient);
    const events = await calendarService.getUpcomingEvents(Number(maxResults));

    res.json({
      success: true,
      message: 'Events retrieved successfully',
      data: {
        events: events.map(event => ({
          id: event.id,
          summary: event.summary,
          start: event.start,
          end: event.end,
          attendees: event.attendees,
          description: event.description,
          organizer: event.organizer
        }))
      }
    });
  } catch (error: any) {
    console.error('Error getting upcoming events:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get upcoming events'
    });
  }
});

/**
 * GET /available-slots
 * Get available time slots for scheduling
 */
router.get('/available-slots', requireAuth, async (req, res) => {
  try {
    const { participants, dateRange, durationMinutes = 60 } = req.query;
    
    if (!participants || !dateRange) {
      return res.status(400).json({
        success: false,
        message: 'Participants and date range are required'
      });
    }

    const participantList = Array.isArray(participants) 
      ? participants 
      : [participants as string];

    const authClient = getAuthClient(req);
    if (!authClient) {
      return res.status(401).json({
        success: false,
        message: 'Google authentication required'
      });
    }

    const calendarService = new CalendarService(authClient);
    const slots = await calendarService.getAvailableSlots(
      participantList,
      dateRange as string,
      Number(durationMinutes)
    );

    res.json({
      success: true,
      message: 'Available slots retrieved successfully',
      data: {
        slots
      }
    });
  } catch (error: any) {
    console.error('Error getting available slots:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get available slots'
    });
  }
});

export default router;
