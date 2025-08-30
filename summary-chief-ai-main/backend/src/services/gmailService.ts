import { google } from 'googleapis';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface EmailData {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
  snippet: string;
  threadId: string;
}

export interface EmailSummary {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  priority: 'high' | 'medium' | 'low';
}

export interface EmailDraft {
  subject: string;
  body: string;
  suggestions: string[];
}

class GmailService {
  private oauth2Client: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:5001/api/auth/google/callback'
    );
  }

  setCredentials(accessToken: string, refreshToken?: string) {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  async getEmails(maxResults: number = 10): Promise<EmailData[]> {
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults,
        q: 'is:inbox',
      });

      const messages = response.data.messages || [];
      const emails: EmailData[] = [];

      for (const message of messages) {
        const email = await this.getEmailDetails(message.id!);
        if (email) {
          emails.push(email);
        }
      }

      return emails;
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw new Error('Failed to fetch emails');
    }
  }

  async getEmailDetails(messageId: string): Promise<EmailData | null> {
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      
      const response = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      });

      const message = response.data;
      const headers = message.payload?.headers || [];
      
      const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find(h => h.name === 'From')?.value || '';
      const to = headers.find(h => h.name === 'To')?.value || '';
      const date = headers.find(h => h.name === 'Date')?.value || '';

      let body = '';
      if (message.payload?.body?.data) {
        body = this.decodeBody(message.payload.body.data);
      } else if (message.payload?.parts) {
        const textPart = message.payload.parts.find(part => 
          part.mimeType === 'text/plain' || part.mimeType === 'text/html'
        );
        if (textPart?.body?.data) {
          body = this.decodeBody(textPart.body.data);
        }
      }

      return {
        id: message.id!,
        subject,
        from,
        to,
        date,
        body: this.cleanHtml(body),
        snippet: message.snippet || '',
        threadId: message.threadId || '',
      };
    } catch (error) {
      console.error('Error fetching email details:', error);
      return null;
    }
  }

  private decodeBody(data: string): string {
    try {
      return Buffer.from(data, 'base64').toString('utf-8');
    } catch (error) {
      return '';
    }
  }

  private cleanHtml(html: string): string {
    // Simple HTML tag removal - in production, use a proper HTML parser
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async summarizeEmail(email: EmailData): Promise<EmailSummary> {
    try {
      const prompt = `
        Analyze the following email and provide a comprehensive summary:
        
        Subject: ${email.subject}
        From: ${email.from}
        Date: ${email.date}
        Content: ${email.body}
        
        Please provide:
        1. A concise summary (2-3 sentences)
        2. Key points (bullet points)
        3. Action items (if any)
        4. Sentiment analysis (positive/negative/neutral)
        5. Priority level (high/medium/low)
        
        Format the response as JSON with the following structure:
        {
          "summary": "brief summary",
          "keyPoints": ["point1", "point2"],
          "actionItems": ["action1", "action2"],
          "sentiment": "positive|negative|neutral",
          "priority": "high|medium|low"
        }
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Try to parse JSON response
      try {
        return JSON.parse(response);
      } catch (parseError) {
        // Fallback to structured response
        return {
          summary: response,
          keyPoints: [],
          actionItems: [],
          sentiment: 'neutral',
          priority: 'medium',
        };
      }
    } catch (error) {
      console.error('Error summarizing email:', error);
      throw new Error('Failed to summarize email');
    }
  }

  async generateEmailDraft(
    context: string,
    recipient: string,
    purpose: string,
    tone: 'formal' | 'casual' | 'professional' = 'professional'
  ): Promise<EmailDraft> {
    try {
      const prompt = `
        Generate an email draft based on the following context:
        
        Context: ${context}
        Recipient: ${recipient}
        Purpose: ${purpose}
        Tone: ${tone}
        
        Please provide:
        1. A clear and engaging subject line
        2. A well-structured email body
        3. Alternative suggestions for subject lines
        
        Format the response as JSON:
        {
          "subject": "main subject line",
          "body": "email body content",
          "suggestions": ["alternative subject 1", "alternative subject 2"]
        }
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      try {
        return JSON.parse(response);
      } catch (parseError) {
        return {
          subject: 'Email Draft',
          body: response,
          suggestions: [],
        };
      }
    } catch (error) {
      console.error('Error generating email draft:', error);
      throw new Error('Failed to generate email draft');
    }
  }

  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      
      const message = [
        `To: ${to}`,
        `Subject: ${subject}`,
        '',
        body
      ].join('\n');

      const encodedMessage = Buffer.from(message).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}

export default new GmailService();
