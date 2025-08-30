# Gmail Integration Setup Guide

## Overview
This guide will help you set up the Gmail integration for your WorkSpace AI application. The integration allows users to:
- View and manage their Gmail emails
- Get AI-powered email summaries
- Generate email drafts with AI assistance
- Send emails directly from the application

## Prerequisites
1. Google Cloud Console project with Gmail API enabled
2. OpenAI API key for AI features
3. Node.js and npm installed

## Backend Setup

### 1. Install Dependencies
Navigate to the backend directory and install the new dependencies:
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
GOOGLE_CLIENT_ID=916348344632-mc7n8m1e0a77i7tbj58o9bu13gvuh1bs.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
OPENAI_API_KEY=your-openai-api-key-here
```

**Important Notes:**
- Replace `your-openai-api-key-here` with your actual OpenAI API key
- The Google OAuth credentials are already provided
- Change the JWT_SECRET in production

### 3. Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API:
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

4. Configure OAuth consent screen:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in the required information
   - Add scopes:
     - `https://www.googleapis.com/auth/gmail.readonly`
     - `https://www.googleapis.com/auth/gmail.send`
     - `https://www.googleapis.com/auth/userinfo.email`
     - `https://www.googleapis.com/auth/userinfo.profile`

5. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5001/api/auth/google/callback`
   - Copy the Client ID and Client Secret to your `.env` file

### 4. Start the Backend
```bash
npm run dev
```

The backend will start on `http://localhost:5001`

## Frontend Setup

### 1. Install Dependencies
Navigate to the frontend directory and install the new dependencies:
```bash
cd ../
npm install
```

### 2. Start the Frontend
```bash
npm run dev
```

The frontend will start on `http://localhost:8080`

## Usage

### 1. Authentication
1. Open the application in your browser
2. Click "Sign in with Google"
3. Grant the necessary permissions for Gmail access

### 2. Gmail Integration
1. After signing in, you'll see the dashboard with integration cards
2. Click on the "Gmail" card (it should show "Connected" status)
3. You'll be redirected to the Gmail integration page

### 3. Features Available

#### Email Management
- View your inbox emails
- Click on any email to see full details
- Use the "AI Summary" button to get AI-powered analysis

#### AI Email Summary
- Provides a concise summary of the email
- Extracts key points and action items
- Analyzes sentiment and priority level

#### Email Draft Generation
- Navigate to the "Draft Email" tab
- Provide context, recipient, purpose, and tone
- Generate AI-powered email drafts
- Send emails directly from the application

#### Analytics
- View email statistics
- Track recent activity
- Monitor sender patterns

## API Endpoints

The backend provides the following Gmail-related endpoints:

- `GET /api/gmail/emails` - Fetch emails from Gmail
- `GET /api/gmail/emails/:emailId` - Get specific email details
- `POST /api/gmail/emails/:emailId/summarize` - Generate AI summary
- `POST /api/gmail/draft` - Generate email draft
- `POST /api/gmail/send` - Send email
- `GET /api/gmail/analytics` - Get email analytics

## Troubleshooting

### Common Issues

1. **"Gmail access token not found"**
   - Make sure you've signed in with Google
   - Check that the OAuth scopes include Gmail permissions

2. **"Failed to fetch emails"**
   - Verify your Google Cloud Console configuration
   - Check that the Gmail API is enabled
   - Ensure the OAuth consent screen includes Gmail scopes

3. **"Failed to summarize email"**
   - Verify your OpenAI API key is correct
   - Check that you have sufficient OpenAI credits

4. **CORS errors**
   - Make sure the backend is running on port 5001
   - Check that the frontend is making requests to the correct URL

### Debug Mode
To enable debug logging, set `NODE_ENV=development` in your `.env` file.

## Security Considerations

1. **Environment Variables**: Never commit your `.env` file to version control
2. **API Keys**: Keep your OpenAI API key secure
3. **OAuth Credentials**: Use environment variables for all sensitive data
4. **HTTPS**: Use HTTPS in production for secure OAuth flows

## Production Deployment

For production deployment:

1. Update the OAuth redirect URIs in Google Cloud Console
2. Set `NODE_ENV=production`
3. Use a strong JWT_SECRET
4. Enable HTTPS
5. Set up proper CORS configuration
6. Use a production database instead of in-memory storage

## Support

If you encounter any issues:
1. Check the browser console for frontend errors
2. Check the backend logs for server errors
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed

## Next Steps

Future enhancements could include:
- Email threading and conversation view
- Advanced email filtering and search
- Email templates and automation
- Integration with other Google services (Calendar, Drive)
- Team collaboration features
- Advanced analytics and reporting
