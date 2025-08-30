import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  Send, 
  Mic, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import axios from 'axios';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: {
    eventId?: string;
    summary?: string;
    actionItems?: string[];
  };
}

interface ChatbotProps {
  onScheduleMeeting?: (event: any) => void;
  onSummarizeMeeting?: (summary: any) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onScheduleMeeting, onSummarizeMeeting }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. I can help you schedule meetings, summarize past meetings, and manage your calendar. Try saying something like "Schedule an interview with John next week" or "Summarize the meeting from last Friday".',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const API_BASE = 'http://localhost:5001/api';

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Check if it's a scheduling command
      if (inputValue.toLowerCase().includes('schedule') || 
          inputValue.toLowerCase().includes('book') ||
          inputValue.toLowerCase().includes('interview')) {
        await handleScheduleMeeting(inputValue);
      } 
      // Check if it's a summary command
      else if (inputValue.toLowerCase().includes('summarize') || 
               inputValue.toLowerCase().includes('summary')) {
        await handleSummarizeMeeting(inputValue);
      } 
      // Default AI response
      else {
        await handleGeneralQuery(inputValue);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleMeeting = async (command: string) => {
    try {
      const response = await axios.post(`${API_BASE}/calendar/schedule-meeting`, {
        command
      }, {
        withCredentials: true
      });

      const event = response.data.data.event;
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `✅ Meeting scheduled successfully!\n\n**${event.summary}**\n📅 ${formatDateTime(event.start.dateTime)}\n⏰ ${formatTime(event.start.dateTime)} - ${formatTime(event.end.dateTime)}\n👥 ${event.attendees?.length || 0} participants`,
        timestamp: new Date(),
        metadata: {
          eventId: event.id
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (onScheduleMeeting) {
        onScheduleMeeting(event);
      }

      toast.success('Meeting scheduled successfully!');
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `❌ Failed to schedule meeting: ${error.response?.data?.message || error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to schedule meeting');
    }
  };

  const handleSummarizeMeeting = async (command: string) => {
    try {
      // Extract meeting ID or date from command (simplified)
      const meetingId = 'sample-meeting-id'; // In real app, extract from command
      
      // Get user_id from localStorage or URL params
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('user_id') || localStorage.getItem('google_user_id');
      
      if (!userId) {
        toast.error('Please connect your Google account first');
        return;
      }

      const response = await axios.post(`${API_BASE}/calendar/summarize-meeting?user_id=${userId}`, {
        meetingId
      }, {
        withCredentials: true
      });

      const summary = response.data.data.summary;
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `📋 **Meeting Summary**\n\n${summary.summary}\n\n**Key Points:**\n${summary.keyPoints.map(point => `• ${point}`).join('\n')}\n\n**Action Items:**\n${summary.actionItems.map(item => `• ${item}`).join('\n')}`,
        timestamp: new Date(),
        metadata: {
          summary: summary.summary,
          actionItems: summary.actionItems
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (onSummarizeMeeting) {
        onSummarizeMeeting(summary);
      }

      toast.success('Meeting summarized successfully!');
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `❌ Failed to summarize meeting: ${error.response?.data?.message || error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to summarize meeting');
    }
  };

  const handleGeneralQuery = async (query: string) => {
    // Simulate AI response for general queries
    const responses = [
      "I can help you with calendar management, meeting scheduling, and meeting summaries. What would you like to do?",
      "I'm here to assist with your workspace productivity. Try asking me to schedule a meeting or summarize a past meeting.",
      "I can schedule meetings, book interviews, and provide meeting summaries. Just let me know what you need!"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: randomResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
    toast.info('Voice input coming soon!');
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-white border-gray-200 shadow-lg rounded-xl h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          AI Assistant
          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4 py-3">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Processing your request...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your command here... (e.g., 'Schedule an interview with John next week')"
              className="flex-1 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <Button
              onClick={toggleVoiceInput}
              variant="outline"
              size="icon"
              className="border-gray-200 hover:bg-gray-50"
              disabled={isLoading}
            >
              <Mic className={`w-4 h-4 ${isListening ? 'text-red-500' : 'text-gray-500'}`} />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue('Schedule an interview with John next week')}
              className="text-xs border-gray-200 hover:bg-gray-50"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Schedule Interview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue('Summarize the meeting from last Friday')}
              className="text-xs border-gray-200 hover:bg-gray-50"
            >
              <Clock className="w-3 h-3 mr-1" />
              Summarize Meeting
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue('Book a team meeting this week')}
              className="text-xs border-gray-200 hover:bg-gray-50"
            >
              <Users className="w-3 h-3 mr-1" />
              Team Meeting
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
