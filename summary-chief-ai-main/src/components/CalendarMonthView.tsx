import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  X,
  Mail
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import axios from 'axios';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  attendees?: string[];
  type: 'meeting' | 'interview' | 'reminder' | 'gmail';
  gmailId?: string;
}

interface GmailEvent {
  id: string;
  subject: string;
  from: string;
  date: string;
  threadId: string;
}

const CalendarMonthView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [gmailEvents, setGmailEvents] = useState<GmailEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'schedule'>('view');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '09:00',
    endTime: '10:00',
    attendees: '',
    type: 'meeting' as const
  });
  const [scheduleMeeting, setScheduleMeeting] = useState({
    command: '',
    participants: '',
    dateRange: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:5001/api';

  useEffect(() => {
    fetchEvents();
    fetchGmailEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE}/calendar/upcoming-events`, {
        withCredentials: true
      });
      
      if (response.data.success && response.data.data?.events) {
        // Convert API events to local format
        const calendarEvents = response.data.data.events.map((event: any) => ({
          id: event.id,
          title: event.summary,
          description: event.description,
          start: new Date(event.start.dateTime || event.start.date),
          end: new Date(event.end.dateTime || event.end.date),
          attendees: event.attendees?.map((a: any) => a.email) || [],
          type: 'meeting' as const
        }));
        
        setEvents(calendarEvents);
        console.log('Real calendar events loaded:', calendarEvents.length);
      } else {
        console.warn('No calendar events data in response');
        setEvents([]);
      }
    } catch (error: any) {
      console.error('Error fetching calendar events:', error);
      if (error.response?.status === 401) {
        console.log('User not authenticated for calendar, skipping calendar events');
      } else {
        console.log('Failed to fetch calendar events:', error.message);
      }
      setEvents([]);
    }
  };

  const fetchGmailEvents = async () => {
    try {
      // Fetch Gmail emails directly - the backend will use the session to identify the user
      const response = await axios.get(`${API_BASE}/gmail/emails?maxResults=50`, {
        withCredentials: true
      });
      
      if (response.data.success && response.data.data && Array.isArray(response.data.data)) {
        // Convert Gmail emails to calendar events
        const gmailCalendarEvents = response.data.data.map((email: any) => ({
          id: `gmail-${email.id}`,
          title: email.subject,
          description: email.snippet,
          start: new Date(email.date),
          end: new Date(new Date(email.date).getTime() + 60 * 60 * 1000), // 1 hour duration
          attendees: [email.from],
          type: 'gmail' as const,
          gmailId: email.id
        }));
        
        setGmailEvents(gmailCalendarEvents);
        console.log('Real Gmail events loaded:', gmailCalendarEvents.length);
      } else {
        console.warn('No Gmail data in response');
        setGmailEvents([]);
      }
    } catch (error: any) {
      console.error('Error fetching Gmail events:', error);
      if (error.response?.status === 401) {
        console.log('User not authenticated for Gmail, skipping Gmail events');
      } else {
        console.log('Failed to fetch Gmail events:', error.message);
      }
      setGmailEvents([]);
    }
  };

  const getSampleEvents = (): CalendarEvent[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return [
      {
        id: '1',
        title: 'Team Standup',
        description: 'Daily team meeting to discuss progress and blockers',
        start: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM today
        end: new Date(today.getTime() + 9.5 * 60 * 60 * 1000), // 9:30 AM today
        attendees: ['john@company.com', 'jane@company.com', 'mike@company.com'],
        type: 'meeting'
      },
      {
        id: '2',
        title: 'Client Call - Q4 Planning',
        description: 'Quarterly review and planning session',
        start: new Date(tomorrow.getTime() + 14 * 60 * 60 * 1000), // 2 PM tomorrow
        end: new Date(tomorrow.getTime() + 15 * 60 * 60 * 1000), // 3 PM tomorrow
        attendees: ['client@company.com', 'manager@company.com'],
        type: 'meeting'
      },
      {
        id: '3',
        title: 'Product Demo',
        description: 'Showcase new features to stakeholders',
        start: new Date(dayAfterTomorrow.getTime() + 10 * 60 * 60 * 1000), // 10 AM day after tomorrow
        end: new Date(dayAfterTomorrow.getTime() + 11 * 60 * 60 * 1000), // 11 AM day after tomorrow
        attendees: ['stakeholder@company.com', 'product@company.com'],
        type: 'meeting'
      },
      {
        id: '4',
        title: 'Code Review',
        description: 'Review pull requests and discuss technical decisions',
        start: new Date(nextWeek.getTime() + 15 * 60 * 60 * 1000), // 3 PM next week
        end: new Date(nextWeek.getTime() + 16 * 60 * 60 * 1000), // 4 PM next week
        attendees: ['dev@company.com', 'tech@company.com'],
        type: 'meeting'
      }
    ];
  };

  const getSampleGmailEvents = (): GmailEvent[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
    
    return [
      {
        id: 'g1',
        subject: 'Project Update Required',
        from: 'manager@company.com',
        date: new Date(today.getTime() + 11 * 60 * 60 * 1000).toISOString(), // 11 AM today
        threadId: 'thread1'
      },
      {
        id: 'g2',
        subject: 'Meeting Follow-up',
        from: 'team@company.com',
        date: new Date(yesterday.getTime() + 16 * 60 * 60 * 1000).toISOString(), // 4 PM yesterday
        threadId: 'thread2'
      },
      {
        id: 'g3',
        subject: 'Weekly Report',
        from: 'reports@company.com',
        date: new Date(twoDaysAgo.getTime() + 10 * 60 * 60 * 1000).toISOString(), // 10 AM two days ago
        threadId: 'thread3'
      }
    ];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const startWeek = startOfWeek(start);
    const endWeek = endOfWeek(end);
    
    return eachDayOfInterval({ start: startWeek, end: endWeek });
  };

  const getEventsForDate = (date: Date) => {
    const allEvents = [...events, ...gmailEvents];
    return allEvents.filter(event => isSameDay(event.start, date));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setModalMode('view');
    setShowEventModal(true);
  };

  const handleScheduleMeeting = async () => {
    if (!scheduleMeeting.command.trim()) {
      toast.error('Please enter a meeting command');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE}/calendar/schedule-meeting`, {
        command: scheduleMeeting.command
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Meeting scheduled successfully!');
        setScheduleMeeting({
          command: '',
          participants: '',
          dateRange: '',
          description: ''
        });
        setShowEventModal(false);
        fetchEvents(); // Refresh events
      } else {
        toast.error(response.data.message || 'Failed to schedule meeting');
      }
    } catch (error: any) {
      console.error('Error scheduling meeting:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!selectedDate || !newEvent.title.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Create event date by combining selected date with time
      const startDateTime = new Date(selectedDate);
      const [startHour, startMinute] = newEvent.startTime.split(':').map(Number);
      startDateTime.setHours(startHour, startMinute, 0, 0);
      
      const endDateTime = new Date(selectedDate);
      const [endHour, endMinute] = newEvent.endTime.split(':').map(Number);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      // Create event directly without AI parsing
      const response = await axios.post(`${API_BASE}/calendar/create-event`, {
        title: newEvent.title,
        description: newEvent.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        attendees: newEvent.attendees,
        type: newEvent.type
      }, {
        withCredentials: true
      });

      const createdEvent = response.data.data.event;
      
      // Add to local events
      const newCalendarEvent: CalendarEvent = {
        id: createdEvent.id,
        title: createdEvent.summary,
        description: createdEvent.description,
        start: new Date(createdEvent.start.dateTime),
        end: new Date(createdEvent.end.dateTime),
        attendees: createdEvent.attendees ? createdEvent.attendees.map((a: any) => a.email) : [],
        type: newEvent.type
      };

      setEvents(prev => [...prev, newCalendarEvent]);
      
      // Reset form
      setNewEvent({
        title: '',
        description: '',
        startTime: '09:00',
        endTime: '10:00',
        attendees: '',
        type: 'meeting'
      });
      
      setShowEventModal(false);
      toast.success('Event created successfully!');
      
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500';
      case 'interview':
        return 'bg-green-500';
      case 'reminder':
        return 'bg-yellow-500';
      case 'gmail':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="w-3 h-3" />;
      case 'interview':
        return <Users className="w-3 h-3" />;
      case 'reminder':
        return <Clock className="w-3 h-3" />;
      case 'gmail':
        return <Mail className="w-3 h-3" />;
      default:
        return <CalendarIcon className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <h2 className="text-2xl font-bold text-gray-100">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setSelectedDate(new Date());
              setModalMode('schedule');
              setShowEventModal(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
          <Button
            onClick={() => {
              setSelectedDate(new Date());
              setModalMode('create');
              setShowEventModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="bg-gray-900 border-gray-800 shadow-xl">
        <CardContent className="p-0">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-px bg-gray-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-gray-800 p-3 text-center">
                <span className="text-sm font-medium text-gray-300">{day}</span>
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-px bg-gray-700">
            {getDaysInMonth().map((date, index) => {
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isToday = isSameDay(date, new Date());
              const dayEvents = getEventsForDate(date);
              
              return (
                <div
                  key={index}
                  className={`min-h-[120px] bg-gray-800 p-2 cursor-pointer hover:bg-gray-700 transition-colors ${
                    !isCurrentMonth ? 'opacity-50' : ''
                  } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="text-sm font-medium text-gray-300 mb-2">
                    {format(date, 'd')}
                  </div>
                  
                  {/* Events for this day */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)} text-white flex items-center gap-1`}
                        title={`${event.title} - ${format(event.start, 'h:mm a')}`}
                      >
                        {getEventTypeIcon(event.type)}
                        {event.title}
                      </div>
                    ))}
                    
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-400 text-center">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Modal - View or Create */}
      {showEventModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-900 border-gray-800 shadow-2xl rounded-xl max-w-2xl w-full">
            <CardHeader className="pb-3 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-100">
                  {modalMode === 'view' 
                    ? `Events for ${format(selectedDate, 'EEEE, MMMM d, yyyy')}`
                    : modalMode === 'create'
                    ? `Add Event - ${format(selectedDate, 'EEEE, MMMM d, yyyy')}`
                    : `Schedule Meeting - ${format(selectedDate, 'EEEE, MMMM d, yyyy')}`
                  }
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="max-h-[70vh] overflow-y-auto">
                <div className="p-6">
                  {modalMode === 'view' ? (
                    // View Mode - Show events for the selected date
                    <div className="space-y-4">
                      {(() => {
                        const dayEvents = getEventsForDate(selectedDate);
                        if (dayEvents.length === 0) {
                          return (
                            <div className="text-center py-8 text-gray-400">
                              <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p className="text-lg font-medium">No events scheduled</p>
                              <p className="text-sm">This day is free for new events</p>
                            </div>
                          );
                        }
                        
                        return (
                          <div className="space-y-3">
                            {dayEvents.map((event) => (
                              <div
                                key={event.id}
                                className={`p-4 rounded-lg border ${getEventTypeColor(event.type)} border-opacity-50`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      {getEventTypeIcon(event.type)}
                                      <h4 className="font-semibold text-white">{event.title}</h4>
                                    </div>
                                    {event.description && (
                                      <p className="text-white text-opacity-90 text-sm mb-2">
                                        {event.description}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-4 text-white text-opacity-80 text-sm">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                                      </span>
                                      {event.attendees && event.attendees.length > 0 && (
                                        <span className="flex items-center gap-1">
                                          <Users className="w-4 h-4" />
                                          {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                      
                      <div className="pt-4 border-t border-gray-700">
                        <Button
                          onClick={() => setModalMode('create')}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Event to This Day
                        </Button>
                      </div>
                    </div>
                  ) : modalMode === 'create' ? (
                    // Create Mode - Event creation form
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium text-gray-300">
                          Event Title *
                        </Label>
                        <Input
                          id="title"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter event title"
                          className="bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-300">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={newEvent.description}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Event description"
                          rows={3}
                          className="bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startTime" className="text-sm font-medium text-gray-300">
                            Start Time
                          </Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={newEvent.startTime}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                            className="bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="endTime" className="text-sm font-medium text-gray-300">
                            End Time
                          </Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={newEvent.endTime}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                            className="bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500"
                            />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="attendees" className="text-sm font-medium text-gray-300">
                          Attendees (comma-separated emails)
                        </Label>
                        <Input
                          id="attendees"
                          value={newEvent.attendees}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, attendees: e.target.value }))}
                          placeholder="email1@example.com, email2@example.com"
                          className="bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleCreateEvent}
                          disabled={loading || !newEvent.title.trim()}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {loading ? 'Creating...' : 'Create Event'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => setModalMode('view')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Back to Events
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Schedule Meeting Mode - Natural language meeting scheduling
                    <div className="space-y-4">
                      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-5 h-5 text-purple-400" />
                          <h4 className="font-semibold text-purple-300">AI-Powered Meeting Scheduler</h4>
                        </div>
                        <p className="text-sm text-purple-200">
                          Use natural language to schedule meetings. The AI will parse your request and create the event automatically.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="command" className="text-sm font-medium text-gray-300">
                          Meeting Command *
                        </Label>
                        <Textarea
                          id="command"
                          value={scheduleMeeting.command}
                          onChange={(e) => setScheduleMeeting(prev => ({ ...prev, command: e.target.value }))}
                          placeholder="e.g., Schedule a 1-hour team meeting with john@company.com and jane@company.com tomorrow at 2 PM to discuss Q4 planning"
                          rows={4}
                          className="bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Examples:</h5>
                        <ul className="text-xs text-gray-400 space-y-1">
                          <li>• "Schedule a 30-minute interview with candidate@email.com next Tuesday at 10 AM"</li>
                          <li>• "Book a 2-hour client meeting with client@company.com this Friday afternoon"</li>
                          <li>• "Set up a daily standup with team@company.com every weekday at 9 AM"</li>
                        </ul>
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleScheduleMeeting}
                          disabled={loading || !scheduleMeeting.command.trim()}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          {loading ? 'Scheduling...' : 'Schedule Meeting'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => setModalMode('view')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Back to Events
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CalendarMonthView;
