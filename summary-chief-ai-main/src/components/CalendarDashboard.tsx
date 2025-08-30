import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  Users, 
  Eye, 
  RefreshCw, 
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import axios from 'axios';
import { format, parseISO, isToday, isTomorrow, isThisWeek } from 'date-fns';

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

interface CalendarDashboardProps {
  onViewEvent?: (event: CalendarEvent) => void;
  onSummarizeEvent?: (eventId: string) => void;
}

const CalendarDashboard: React.FC<CalendarDashboardProps> = ({ 
  onViewEvent, 
  onSummarizeEvent 
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const API_BASE = 'http://localhost:5001/api';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Get user_id from localStorage or URL params
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('user_id') || localStorage.getItem('google_user_id');
      
      if (!userId) {
        console.log('No user ID found, skipping calendar events');
        setEvents([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE}/calendar/upcoming-events?maxResults=20&user_id=${userId}`, {
        withCredentials: true
      });
      setEvents(response.data.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch calendar events');
      
      // Load sample data for demo
      setEvents(getSampleEvents());
    } finally {
      setLoading(false);
    }
  };

  const getSampleEvents = (): CalendarEvent[] => {
    const now = new Date();
    return [
      {
        id: '1',
        summary: 'Team Standup Meeting',
        description: 'Daily team standup to discuss progress and blockers',
        start: { dateTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), timeZone: 'UTC' },
        end: { dateTime: new Date(now.getTime() + 2.5 * 60 * 60 * 1000).toISOString(), timeZone: 'UTC' },
        attendees: [
          { email: 'john@company.com', displayName: 'John Doe', responseStatus: 'accepted' },
          { email: 'jane@company.com', displayName: 'Jane Smith', responseStatus: 'accepted' },
          { email: 'bob@company.com', displayName: 'Bob Johnson', responseStatus: 'needsAction' }
        ],
        organizer: { email: 'team@company.com', displayName: 'Team Lead' }
      },
      {
        id: '2',
        summary: 'Client Presentation',
        description: 'Present quarterly results to key client stakeholders',
        start: { dateTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), timeZone: 'UTC' },
        end: { dateTime: new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString(), timeZone: 'UTC' },
        attendees: [
          { email: 'client@company.com', displayName: 'Client Team', responseStatus: 'accepted' },
          { email: 'sales@company.com', displayName: 'Sales Team', responseStatus: 'accepted' }
        ],
        organizer: { email: 'sales@company.com', displayName: 'Sales Manager' }
      },
      {
        id: '3',
        summary: 'Interview: Sarah Wilson',
        description: 'Technical interview for Senior Developer position',
        start: { dateTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), timeZone: 'UTC' },
        end: { dateTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), timeZone: 'UTC' },
        attendees: [
          { email: 'sarah.wilson@email.com', displayName: 'Sarah Wilson', responseStatus: 'accepted' },
          { email: 'tech@company.com', displayName: 'Tech Team', responseStatus: 'accepted' }
        ],
        organizer: { email: 'hr@company.com', displayName: 'HR Team' }
      }
    ];
  };

  const handleViewEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
    if (onViewEvent) {
      onViewEvent(event);
    }
  };

  const handleSummarizeEvent = async (eventId: string) => {
    try {
      if (onSummarizeEvent) {
        onSummarizeEvent(eventId);
      }
      toast.success('Meeting summary requested');
    } catch (error) {
      toast.error('Failed to request meeting summary');
    }
  };

  const getEventDateLabel = (dateTime: string) => {
    const date = parseISO(dateTime);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d');
  };

  const getEventTimeRange = (start: string, end: string) => {
    const startTime = format(parseISO(start), 'h:mm a');
    const endTime = format(parseISO(end), 'h:mm a');
    return `${startTime} - ${endTime}`;
  };

  const getAttendeeStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'declined':
        return <XCircle className="w-3 h-3 text-red-500" />;
      case 'needsAction':
        return <AlertCircle className="w-3 h-3 text-yellow-500" />;
      default:
        return <AlertCircle className="w-3 h-3 text-gray-400" />;
    }
  };

  const getAttendeeStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'declined':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'needsAction':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Calendar Dashboard</h2>
            <p className="text-gray-600">Manage your upcoming meetings and events</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchEvents}
            disabled={loading}
            variant="outline"
            className="border-gray-200 hover:bg-gray-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* Events List */}
      <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <Clock className="w-5 h-5 text-blue-600" />
            Upcoming Events ({events.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No upcoming events</p>
                <p className="text-sm">Your calendar is clear for now</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {events.map((event) => (
                  <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge 
                            variant="secondary" 
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {getEventDateLabel(event.start.dateTime)}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {getEventTimeRange(event.start.dateTime, event.end.dateTime)}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {event.summary}
                        </h3>
                        
                        {event.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        
                        {/* Attendees */}
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <Users className="w-4 h-4 text-gray-400" />
                            <div className="flex flex-wrap gap-1">
                              {event.attendees.slice(0, 3).map((attendee, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className={`text-xs ${getAttendeeStatusColor(attendee.responseStatus || 'needsAction')}`}
                                >
                                  {getAttendeeStatusIcon(attendee.responseStatus || 'needsAction')}
                                  {attendee.displayName || attendee.email.split('@')[0]}
                                </Badge>
                              ))}
                              {event.attendees.length > 3 && (
                                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                  +{event.attendees.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          onClick={() => handleViewEvent(event)}
                          variant="outline"
                          size="sm"
                          className="border-gray-200 hover:bg-gray-50 text-gray-700"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button
                          onClick={() => handleSummarizeEvent(event.id)}
                          variant="outline"
                          size="sm"
                          className="border-blue-200 hover:bg-blue-50 text-blue-700"
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Summarize
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white border-gray-200 shadow-2xl rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-gray-900">
                  {selectedEvent.summary}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                {/* Event Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Date & Time</h4>
                    <div className="text-sm text-gray-600">
                      <p>{format(parseISO(selectedEvent.start.dateTime), 'EEEE, MMMM d, yyyy')}</p>
                      <p>{getEventTimeRange(selectedEvent.start.dateTime, selectedEvent.end.dateTime)}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Duration</h4>
                    <div className="text-sm text-gray-600">
                      {Math.round((parseISO(selectedEvent.end.dateTime).getTime() - parseISO(selectedEvent.start.dateTime).getTime()) / (1000 * 60))} minutes
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                {selectedEvent.description && (
                  <>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Attendees */}
                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Participants</h4>
                    <div className="space-y-2">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">
                              {attendee.displayName || attendee.email.split('@')[0]}
                            </p>
                            <p className="text-sm text-gray-500">{attendee.email}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={getAttendeeStatusColor(attendee.responseStatus || 'needsAction')}
                          >
                            {getAttendeeStatusIcon(attendee.responseStatus || 'needsAction')}
                            {attendee.responseStatus || 'needsAction'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => handleSummarizeEvent(selectedEvent.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Generate Summary
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowEventModal(false)}
                    className="border-gray-200 hover:bg-gray-50 flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CalendarDashboard;
