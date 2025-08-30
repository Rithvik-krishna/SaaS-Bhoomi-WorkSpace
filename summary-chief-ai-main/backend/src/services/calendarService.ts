import { google } from 'googleapis';
import OpenAI from 'openai';
import { OAuth2Client } from 'google-auth-library';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  organizer?: {
    email: string;
    displayName?: string;
  };
}

interface MeetingRequest {
  meetingType: string;
  participants: string[];
  preferredDateRange: string;
  description?: string;
}

interface MeetingSummary {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  nextSteps: string[];
}

interface AvailableSlot {
  startTime: string;
  endTime: string;
  date: string;
}

export class CalendarService {
  private calendar: any;
  private auth: OAuth2Client;

  constructor(auth: OAuth2Client) {
    this.auth = auth;
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  /**
   * Parse natural language command to extract meeting details
   */
  async parseMeetingCommand(command: string): Promise<MeetingRequest> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that parses natural language meeting requests. Extract the following information:
            - meetingType: The type of meeting (interview, team meeting, client call, etc.)
            - participants: Array of participant emails or names
            - preferredDateRange: Preferred date range (e.g., "next week", "tomorrow", "this Friday")
            - description: Brief description of the meeting purpose
            
            Return only valid JSON with these fields.`
          },
          {
            role: 'user',
            content: command
          }
        ],
        temperature: 0.1,
        max_tokens: 200
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('Failed to parse meeting command');
      }

      return JSON.parse(response);
    } catch (error) {
      console.error('Error parsing meeting command:', error);
      throw new Error('Failed to parse meeting command');
    }
  }

  /**
   * Get available time slots for scheduling
   */
  async getAvailableSlots(
    participants: string[],
    dateRange: string,
    durationMinutes: number = 60
  ): Promise<AvailableSlot[]> {
    try {
      // Parse date range
      const { startDate, endDate } = this.parseDateRange(dateRange);
      
      // Get busy times for all participants
      const busyTimes = await this.getBusyTimes(participants, startDate, endDate);
      
      // Find free slots
      const freeSlots = this.findFreeSlots(busyTimes, startDate, endDate, durationMinutes);
      
      return freeSlots;
    } catch (error) {
      console.error('Error getting available slots:', error);
      throw new Error('Failed to get available slots');
    }
  }

  /**
   * Schedule a meeting using AI
   */
  async scheduleMeeting(command: string): Promise<CalendarEvent> {
    try {
      // Parse the command
      const meetingRequest = await this.parseMeetingCommand(command);
      
      // Get available slots
      const availableSlots = await this.getAvailableSlots(
        meetingRequest.participants,
        meetingRequest.preferredDateRange
      );

      if (availableSlots.length === 0) {
        throw new Error('No available time slots found');
      }

      // Choose the best slot (first available)
      const bestSlot = availableSlots[0];
      
      // Create calendar event
      const event = await this.createCalendarEvent({
        summary: meetingRequest.meetingType,
        description: meetingRequest.description || `AI-scheduled ${meetingRequest.meetingType}`,
        startTime: bestSlot.startTime,
        endTime: bestSlot.endTime,
        attendees: meetingRequest.participants,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      // Send calendar invites
      await this.sendCalendarInvites(event);

      return event;
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      throw error;
    }
  }

  /**
   * Summarize a past meeting
   */
  async summarizeMeeting(meetingId: string): Promise<MeetingSummary> {
    try {
      // Get meeting details from calendar
      const meeting = await this.getCalendarEvent(meetingId);
      
      // Get related emails/notes (dummy data for now)
      const meetingNotes = await this.getMeetingNotes(meetingId);
      
      // Generate AI summary
      const summary = await this.generateMeetingSummary(meeting, meetingNotes);
      
      // Update calendar event with summary
      await this.updateEventDescription(meetingId, summary);
      
      return summary;
    } catch (error) {
      console.error('Error summarizing meeting:', error);
      throw error;
    }
  }

  /**
   * Book an interview
   */
  async bookInterview(candidateName: string, interviewerEmail: string, dateRange: string): Promise<CalendarEvent> {
    try {
      const participants = [interviewerEmail];
      const availableSlots = await this.getAvailableSlots(participants, dateRange, 90); // 90 min for interview

      if (availableSlots.length === 0) {
        throw new Error('No available interview slots found');
      }

      const bestSlot = availableSlots[0];
      
      const event = await this.createCalendarEvent({
        summary: `Interview: ${candidateName}`,
        description: `Interview with ${candidateName} for the position.`,
        startTime: bestSlot.startTime,
        endTime: bestSlot.endTime,
        attendees: participants,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      await this.sendCalendarInvites(event);
      
      return event;
    } catch (error) {
      console.error('Error booking interview:', error);
      throw error;
    }
  }

  /**
   * Create a calendar event
   */
  private async createCalendarEvent(eventData: {
    summary: string;
    description: string;
    startTime: string;
    endTime: string;
    attendees: string[];
    timeZone: string;
  }): Promise<CalendarEvent> {
    try {
      const event = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime,
          timeZone: eventData.timeZone,
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: eventData.timeZone,
        },
        attendees: eventData.attendees.map(email => ({ email })),
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        sendUpdates: 'all',
      });

      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  /**
   * Create a simple calendar event directly (without AI parsing)
   */
  async createSimpleEvent(eventData: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    attendees?: string[];
    type?: string;
  }): Promise<CalendarEvent> {
    try {
      console.log('CalendarService: Starting to create event with data:', eventData);
      
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('CalendarService: Using timezone:', timeZone);
      
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime,
          timeZone: timeZone,
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: timeZone,
        },
        attendees: eventData.attendees?.map(email => ({ email })) || [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      };

      console.log('CalendarService: Event object prepared:', JSON.stringify(event, null, 2));

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        sendUpdates: 'all',
      });

      console.log('CalendarService: Google API response received');
      return response.data;
    } catch (error) {
      console.error('CalendarService: Error creating simple calendar event:', error);
      console.error('CalendarService: Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        status: error.status
      });
      throw new Error(`Failed to create calendar event: ${error.message}`);
    }
  }

  /**
   * Get busy times for participants
   */
  private async getBusyTimes(participants: string[], startDate: Date, endDate: Date) {
    try {
      const timeMin = startDate.toISOString();
      const timeMax = endDate.toISOString();

      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin,
          timeMax,
          items: participants.map(email => ({ id: email })),
        },
      });

      return response.data.calendars || {};
    } catch (error) {
      console.error('Error getting busy times:', error);
      throw new Error('Failed to get busy times');
    }
  }

  /**
   * Find free time slots
   */
  private findFreeSlots(
    busyTimes: any,
    startDate: Date,
    endDate: Date,
    durationMinutes: number
  ): AvailableSlot[] {
    const slots: AvailableSlot[] = [];
    const workingHours = { start: 9, end: 17 }; // 9 AM to 5 PM
    
    let currentTime = new Date(startDate);
    currentTime.setHours(workingHours.start, 0, 0, 0);

    while (currentTime < endDate) {
      const slotEnd = new Date(currentTime.getTime() + durationMinutes * 60000);
      
      if (slotEnd.getHours() <= workingHours.end) {
        // Check if slot conflicts with any busy time
        const isSlotFree = this.isSlotAvailable(currentTime, slotEnd, busyTimes);
        
        if (isSlotFree) {
          slots.push({
            startTime: currentTime.toISOString(),
            endTime: slotEnd.toISOString(),
            date: currentTime.toDateString()
          });
        }
      }
      
      // Move to next slot (30-minute intervals)
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return slots;
  }

  /**
   * Check if a time slot is available
   */
  private isSlotAvailable(startTime: Date, endTime: Date, busyTimes: any): boolean {
    for (const calendarId in busyTimes) {
      const busy = busyTimes[calendarId].busy || [];
      
      for (const busyPeriod of busy) {
        const busyStart = new Date(busyPeriod.start);
        const busyEnd = new Date(busyPeriod.end);
        
        // Check for overlap
        if (startTime < busyEnd && endTime > busyStart) {
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Parse date range string
   */
  private parseDateRange(dateRange: string): { startDate: Date; endDate: Date } {
    const now = new Date();
    let startDate = new Date(now);
    let endDate = new Date(now);

    if (dateRange.includes('next week')) {
      startDate.setDate(now.getDate() + 7);
      endDate.setDate(now.getDate() + 14);
    } else if (dateRange.includes('tomorrow')) {
      startDate.setDate(now.getDate() + 1);
      endDate.setDate(now.getDate() + 1);
    } else if (dateRange.includes('this week')) {
      startDate.setDate(now.getDate() - now.getDay());
      endDate.setDate(now.getDate() + (6 - now.getDay()));
    } else if (dateRange.includes('this Friday')) {
      const daysUntilFriday = (5 - now.getDay() + 7) % 7;
      startDate.setDate(now.getDate() + daysUntilFriday);
      endDate.setDate(now.getDate() + daysUntilFriday);
    } else {
      // Default to next 7 days
      startDate.setDate(now.getDate() + 1);
      endDate.setDate(now.getDate() + 7);
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }

  /**
   * Get calendar event details
   */
  private async getCalendarEvent(eventId: string): Promise<CalendarEvent> {
    try {
      const response = await this.calendar.events.get({
        calendarId: 'primary',
        eventId: eventId,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting calendar event:', error);
      throw new Error('Failed to get calendar event');
    }
  }

  /**
   * Get meeting notes (dummy implementation)
   */
  private async getMeetingNotes(meetingId: string): Promise<string> {
    // In a real implementation, this would fetch from Gmail, Google Docs, or other sources
    return `Meeting notes for ${meetingId}. This is a placeholder for actual meeting content.`;
  }

  /**
   * Generate AI summary of meeting
   */
  private async generateMeetingSummary(meeting: CalendarEvent, notes: string): Promise<MeetingSummary> {
    try {
      const prompt = `Summarize this meeting:
      
Meeting: ${meeting.summary}
Date: ${meeting.start.dateTime}
Notes: ${notes}

Please provide:
1. A concise summary
2. Key points discussed
3. Action items
4. Next steps

Format as JSON with fields: summary, keyPoints, actionItems, nextSteps`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('Failed to generate meeting summary');
      }

      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating meeting summary:', error);
      throw new Error('Failed to generate meeting summary');
    }
  }

  /**
   * Update event description with summary
   */
  private async updateEventDescription(eventId: string, summary: MeetingSummary): Promise<void> {
    try {
      const description = `AI Summary:
${summary.summary}

Key Points:
${summary.keyPoints.map(point => `• ${point}`).join('\n')}

Action Items:
${summary.actionItems.map(item => `• ${item}`).join('\n')}

Next Steps:
${summary.nextSteps.map(step => `• ${step}`).join('\n')}`;

      await this.calendar.events.patch({
        calendarId: 'primary',
        eventId: eventId,
        resource: { description },
      });
    } catch (error) {
      console.error('Error updating event description:', error);
      // Don't throw error as this is not critical
    }
  }

  /**
   * Send calendar invites
   */
  private async sendCalendarInvites(event: CalendarEvent): Promise<void> {
    // Calendar invites are automatically sent when creating events with sendUpdates: 'all'
    // Additional email logic can be added here if needed
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(maxResults: number = 10): Promise<CalendarEvent[]> {
    try {
      const now = new Date();
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: now.toISOString(),
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error getting upcoming events:', error);
      throw new Error('Failed to get upcoming events');
    }
  }
}
