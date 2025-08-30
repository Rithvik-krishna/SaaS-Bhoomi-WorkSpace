# Workspace Calendar - Simplified Version

## Overview

A simplified Google Calendar month view that integrates with Gmail data and allows direct event creation on the calendar. Built with React, TypeScript, and Tailwind CSS, maintaining the existing dark mode interface.

## Features

### 📅 Month View Calendar
- **Traditional Calendar Layout**: Month view with navigation between months
- **Click to Add Events**: Click on any date to create new events
- **Event Display**: Shows events directly on calendar days
- **Color-coded Events**: Different colors for meetings, interviews, Gmail events, etc.

### 📧 Gmail Integration
- **Email to Calendar**: Automatically converts Gmail emails to calendar events
- **Email Threads**: Links calendar events back to Gmail conversations
- **Smart Categorization**: Identifies meeting-related emails automatically

### ➕ Event Management
- **Quick Event Creation**: Simple form for adding events
- **Time Selection**: Start and end time picker
- **Attendee Management**: Add participants via email addresses
- **AI Scheduling**: Uses backend AI to find optimal time slots

## How to Use

### 1. View Calendar
- Navigate to `/workspace-ai` to see the month view
- Use arrow buttons to navigate between months
- Today's date is highlighted with a blue ring

### 2. Add Events
- Click on any date to open the event creation modal
- Fill in event title, description, time, and attendees
- Click "Create Event" to schedule

### 3. View Gmail Events
- Gmail emails automatically appear as purple events
- Click on Gmail events to see email details
- Events are linked to original email threads

### 4. Navigate
- Use the "Back to Dashboard" button to return to main page
- Access via the Google Calendar integration card on the homepage

## Technical Details

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling (dark mode)
- **date-fns** for date manipulation
- **Axios** for API communication

### Backend Integration
- **Google Calendar API** for event management
- **Gmail API** for email integration
- **OpenAI API** for intelligent scheduling
- **OAuth2** authentication

### Event Types
- **Meetings** (Blue): Team meetings, client calls
- **Interviews** (Green): Job interviews, candidate meetings
- **Reminders** (Yellow): Personal reminders, tasks
- **Gmail** (Purple): Email-based events

## API Endpoints Used

- `GET /api/calendar/upcoming-events` - Fetch calendar events
- `POST /api/calendar/schedule-meeting` - Create new events
- `GET /api/gmail/emails` - Fetch Gmail data

## Setup

1. **Ensure backend is running** with calendar and Gmail APIs configured
2. **Navigate to `/workspace-ai`** in your browser
3. **Authenticate** with Google OAuth if needed
4. **Start using** the calendar interface

## Interface

- **Dark Mode**: Maintains existing dark theme
- **Responsive**: Works on desktop and tablet
- **Clean Design**: Minimal interface focused on calendar functionality
- **Easy Navigation**: Simple month navigation and event creation

---

**Simple, focused calendar management with Gmail integration**
