# Workspace AI - AI-Powered Calendar Management

## Overview

Workspace AI is a comprehensive React frontend application that integrates with Google Calendar and Gmail APIs to provide AI-powered meeting scheduling, summarization, and productivity management. Built with Vite, Tailwind CSS, and modern React patterns.

## Features

### 🗓️ AI-Powered Meeting Scheduler
- **Natural Language Commands**: Schedule meetings using natural language like "Schedule an interview with John next week"
- **Smart Slot Detection**: Automatically finds available time slots based on participant calendars
- **AI Parsing**: Uses OpenAI to understand meeting requests and extract key details
- **Automatic Invites**: Sends calendar invites to all participants

### 📋 Meeting Summarization
- **AI-Generated Summaries**: Automatically summarize past meetings using OpenAI
- **Key Points Extraction**: Identifies main discussion points and decisions
- **Action Items**: Lists actionable tasks and next steps
- **Calendar Integration**: Attaches summaries directly to calendar events

### 👥 Interview & Task Management
- **Interview Scheduling**: Book interview slots with automatic availability checking
- **Participant Management**: Add/remove participants with real-time status tracking
- **Meeting Types**: Support for interviews, team meetings, client calls, and more

### 🚀 Productivity Dashboard
- **Quick Actions**: One-click access to common tasks
- **AI Suggestions**: Intelligent recommendations for productivity optimization
- **Real-time Stats**: Track meetings, interviews, and summaries
- **Responsive Design**: Works seamlessly on desktop and tablet

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling with custom color scheme
- **Shadcn/ui** components for consistent UI
- **Axios** for API communication
- **React Router** for navigation
- **Sonner** for toast notifications

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Google APIs** (Calendar, Gmail)
- **OpenAI API** for AI-powered features
- **OAuth2** authentication

## Color Scheme

The application uses a professional color palette:
- **Background**: Light beige (`amber-50` to `yellow-50`)
- **Primary**: Blue (`#1E40AF` / `blue-800`)
- **Accent**: Red (`#DC2626` / `red-600`)
- **Cards**: White with rounded corners and soft shadows
- **Typography**: Clean, readable fonts with proper hierarchy

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Google Cloud Console project with Calendar and Gmail APIs enabled
- OpenAI API key

### Frontend Setup
```bash
cd summary-chief-ai-main
npm install
npm run dev
```

### Backend Setup
```bash
cd summary-chief-ai-main/backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Environment Variables
```bash
# Backend .env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
```

## Usage Guide

### 1. Dashboard
The main dashboard provides an overview of your workspace:
- **Welcome Card**: Personalized greeting with key metrics
- **Quick Actions**: Large buttons for common tasks
- **Productivity Sidebar**: AI suggestions and quick actions

### 2. Calendar Management
Navigate to the Calendar tab to:
- View upcoming events in a scrollable list
- Click "View Details" to see full event information
- Generate AI summaries for past meetings
- Track participant response status

### 3. AI Assistant
Use the AI Assistant tab to:
- Type natural language commands for scheduling
- Get instant responses and confirmations
- Use quick action buttons for common tasks
- Access productivity suggestions

### 4. Meeting Scheduler
Manual meeting scheduling with:
- **Meeting Type Selection**: Choose from predefined categories
- **Date & Time Picker**: Intuitive calendar and time selection
- **Duration Management**: Automatic end time calculation
- **Participant Management**: Add/remove attendees
- **Suggested Slots**: AI-recommended time slots

### 5. Meeting Summaries
View AI-generated summaries with:
- **Executive Summary**: High-level overview
- **Key Points**: Main discussion topics
- **Action Items**: Tasks and responsibilities
- **Next Steps**: Follow-up actions
- **Export Options**: Download and share capabilities

## API Endpoints

### Calendar Management
- `POST /api/calendar/schedule-meeting` - Schedule meeting via AI
- `POST /api/calendar/summarize-meeting` - Generate meeting summary
- `POST /api/calendar/book-interview` - Book interview slot
- `GET /api/calendar/upcoming-events` - Get upcoming events
- `GET /api/calendar/available-slots` - Find available time slots

### Authentication
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - OAuth callback
- `POST /api/auth/logout` - User logout

## Component Architecture

### Core Components
- **Chatbot**: AI assistant interface with natural language processing
- **CalendarDashboard**: Event display and management
- **SummaryModal**: Meeting summary display and actions
- **SchedulerForm**: Manual meeting scheduling interface
- **ProductivitySidebar**: Quick actions and AI suggestions

### Layout Components
- **WorkspaceAI**: Main page with tabbed interface
- **Responsive Grid**: Adaptive layout for different screen sizes
- **Modal System**: Overlay dialogs for forms and details

## Responsive Design

The application is fully responsive with:
- **Desktop**: Full-featured interface with sidebar
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Stacked layout for small screens
- **Touch-friendly**: Large buttons and touch targets

## Performance Features

- **Lazy Loading**: Components load on demand
- **Optimized Rendering**: Efficient React patterns
- **API Caching**: Smart data fetching and caching
- **Smooth Animations**: CSS transitions and transforms

## Security Features

- **OAuth2 Authentication**: Secure Google API access
- **JWT Tokens**: Secure session management
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Server-side data validation

## Future Enhancements

- **Voice Input**: Speech-to-text for meeting scheduling
- **Advanced Analytics**: Detailed productivity insights
- **Team Collaboration**: Multi-user workspace features
- **Integration Hub**: Connect with more productivity tools
- **Mobile App**: Native mobile applications

## Troubleshooting

### Common Issues
1. **Google API Errors**: Check OAuth credentials and API permissions
2. **OpenAI Errors**: Verify API key and rate limits
3. **Authentication Issues**: Clear browser cookies and re-authenticate
4. **Calendar Sync**: Ensure Google Calendar permissions are granted

### Debug Mode
Enable debug logging in the backend:
```typescript
// In calendarService.ts
console.log('Debug info:', { participants, dateRange, duration });
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the troubleshooting section

---

**Built with ❤️ using modern web technologies**
