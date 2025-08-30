import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  Settings, 
  Mail, 
  FileText, 
  MessageSquare, 
  CheckSquare, 
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  Tag,
  Pencil,
  ChevronRight,
  Bell,
  Loader2,
  RefreshCw,
  X,
  ArrowLeft,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  attendees?: string[];
}

interface EmailItem {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  threadId: string;
}

const Dashboard: React.FC = () => {
  const [currentDate] = useState(new Date());
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // API configuration
  const API_BASE = 'http://localhost:5001/api';
  
  // State for real data
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Task state
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('dashboard-tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [
      { id: '1', title: 'Standup at 5PM', completed: true },
      { id: '2', title: 'Review pending emails', completed: false },
    ];
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const connectedDocs = [
    'Finance Review',
    'Draft Presentation', 
    'Deployed Features'
  ];

  // State for Google user ID
  const [googleUserId, setGoogleUserId] = useState<string | null>(() => {
    // Try to get from localStorage first
    return localStorage.getItem('google_user_id');
  });

  // Handle Google OAuth callback and initialize Google user ID
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleConnected = urlParams.get('google_connected');
    const userId = urlParams.get('user_id');
    const googleError = urlParams.get('google_error');
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    
    if (googleConnected === 'true' && userId && token && userParam) {
      try {
        // Log the user into the app
        const userData = JSON.parse(decodeURIComponent(userParam));
        login(userData, token);
        toast.success("Successfully connected to Google Workspace!");
        setGoogleUserId(userId);
        localStorage.setItem('google_user_id', userId);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Error processing Google OAuth login:', error);
        toast.error("Failed to process Google login");
      }
    } else if (googleConnected === 'true' && userId) {
      // Just Google connection without app login
      toast.success("Successfully connected to Google Workspace!");
      setGoogleUserId(userId);
      localStorage.setItem('google_user_id', userId);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (googleError === 'true') {
      toast.error("Failed to connect to Google Workspace. Please try again.");
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Initialize from localStorage if no OAuth callback
      const storedUserId = localStorage.getItem('google_user_id');
      if (storedUserId) {
        setGoogleUserId(storedUserId);
      }
    }
  }, [login]);

  // Fetch real data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching dashboard data for user:', user);
        
        // Fetch emails from Gmail API
        try {
          if (!googleUserId) {
            console.log('No Google user ID available, skipping Gmail fetch');
            setEmails([]);
            return;
          }
          
          const emailsResponse = await axios.get(`${API_BASE}/gmail/emails?maxResults=5&user_id=${googleUserId}`, {
            withCredentials: true
          });
          
          console.log('Gmail API response:', emailsResponse.data);
          
          if (emailsResponse.data.success) {
            setEmails(emailsResponse.data.data || []);
          } else {
            console.warn('Gmail API returned success: false');
            setEmails([]);
          }
        } catch (gmailError: any) {
          console.error('Gmail API error:', gmailError);
          // Don't fail the entire dashboard for Gmail errors
          setEmails([]);
        }
        
        // Fetch upcoming calendar events
        try {
          const calendarResponse = await axios.get(`${API_BASE}/calendar/upcoming-events?maxResults=5`, {
            withCredentials: true
          });
          
          console.log('Calendar API response:', calendarResponse.data);
          
          if (calendarResponse.data.success) {
            // Handle different possible data structures
            let events = [];
            if (Array.isArray(calendarResponse.data.data)) {
              events = calendarResponse.data.data;
            } else if (calendarResponse.data.data && Array.isArray(calendarResponse.data.data.items)) {
              events = calendarResponse.data.data.items;
            } else if (calendarResponse.data.data && Array.isArray(calendarResponse.data.data.events)) {
              events = calendarResponse.data.data.events;
            }
            
            console.log('Processed calendar events:', events);
            setCalendarEvents(events);
          } else {
            console.warn('Calendar API returned success: false');
            setCalendarEvents([]);
          }
        } catch (calendarError: any) {
          console.error('Calendar API error:', calendarError);
          // Don't fail the entire dashboard for Calendar errors
          setCalendarEvents([]);
        }
        
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        setError('Some services are unavailable. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
      setError('Please log in to view dashboard data');
    }
  }, [user, googleUserId]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dashboard-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Helper functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'h:mm a');
    } catch {
      return 'Invalid time';
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours === 1) return '1h ago';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return '1 day ago';
      return `${diffInDays} days ago`;
    } catch {
      return 'Unknown time';
    }
  };

  const getAvatarInitial = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const getEventDuration = (start: string, end: string) => {
    try {
      const startDate = parseISO(start);
      const endDate = parseISO(end);
      const diffInMinutes = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 60) return `${diffInMinutes}m`;
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    } catch {
      return 'Unknown duration';
    }
  };

  // Task management functions
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const addNewTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addNewTask();
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleBackNavigation = () => {
    // If we're on the dashboard, go to homepage
    if (location.pathname === '/dashboard') {
      navigate('/');
    } else {
      // Otherwise, go back to dashboard
      navigate('/dashboard');
    }
  };

  // Redirect to homepage if no user
  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 text-gray-100">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Top Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50 px-6 py-4 sticky top-0 z-50"
      >
        <div className="flex items-center justify-between">
          {/* Logo and Back Button */}
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackNavigation}
                className="text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 p-2 rounded-lg transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
              <h1 className="text-2xl font-bold">
                <span className="text-white">Workspace</span>
                <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">AI</span>
              </h1>
            </motion.div>
          </div>

          {/* Search Bar */}
          <motion.div 
            className="flex-1 max-w-md mx-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <motion.input
                type="text"
                placeholder="Search Workspace..."
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                whileFocus={{ 
                  scale: 1.02,
                  boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)",
                }}
              />
            </div>
          </motion.div>

          {/* User Profile */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">
                {user.name || user.email || 'User'}
              </span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button variant="ghost" size="sm" className="p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-300">
                <Settings className="w-5 h-5 text-gray-400" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 relative z-10">
          <nav className="space-y-2">
            <Button 
              variant="default" 
              className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white relative z-20"
            >
              <CheckSquare className="w-4 h-4 mr-3" />
              Your Briefing
            </Button>
                         <Button 
               variant="ghost" 
               className="w-full justify-start text-gray-300 hover:bg-gray-700 relative z-20"
               onClick={() => navigate('/gmail')}
             >
               <Mail className="w-4 h-4 mr-3" />
               Email
             </Button>
                           <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-300 hover:bg-gray-700 relative z-20"
                onClick={() => navigate('/google-drive')}
              >
                <FileText className="w-4 h-4 mr-3" />
                Google Drive
              </Button>
             <Button 
               variant="ghost" 
               className="w-full justify-start text-gray-300 hover:bg-gray-700 relative z-20"
               onClick={() => navigate('/chat')}
             >
               <MessageSquare className="w-4 h-4 mr-3" />
               Chats
             </Button>
                         <Button 
               variant="ghost" 
               className="w-full justify-start text-gray-300 hover:bg-gray-700 relative z-20"
               onClick={() => {
                 const taskboardElement = document.getElementById('taskboard-section');
                 if (taskboardElement) {
                   taskboardElement.scrollIntoView({ behavior: 'smooth' });
                 }
               }}
             >
               <CheckSquare className="w-4 h-4 mr-3" />
               Taskboard
             </Button>
            
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 relative z-10">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Your Briefing Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-100">Your Briefing</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                  className="text-gray-400 hover:text-gray-300 relative z-20"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-300">Loading your briefing...</span>
                  </div>
                ) : error ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-red-300">Error: {error}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.location.reload()}
                      className="border-red-600 text-red-300 hover:bg-red-900/20 relative z-20"
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">
                        Today's Events: {calendarEvents.length} upcoming events
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">
                        {emails.length} new emails to review
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-300">
                          {tasks.filter(t => !t.completed).length} pending tasks
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-gray-300 relative z-20"
                        onClick={() => navigate('/workspace-ai')}
                      >
                        View Calendar →
                      </Button>
                    </div>
                    
                    {/* Debug Info - Remove in production */}
                    <div className="pt-3 border-t border-gray-700">
                      <details className="text-xs text-gray-500">
                        <summary className="cursor-pointer hover:text-gray-400">Debug Info</summary>
                        <div className="mt-2 space-y-1">
                          <div>User: {user ? 'Logged in' : 'Not logged in'}</div>
                          <div>Emails: {Array.isArray(emails) ? emails.length : 'Not array'} items</div>
                          <div>Events: {Array.isArray(calendarEvents) ? calendarEvents.length : 'Not array'} items</div>
                          <div>API Base: {API_BASE}</div>
                          <div>Emails Type: {Array.isArray(emails) ? 'Array' : typeof emails}</div>
                          <div>Events Type: {Array.isArray(calendarEvents) ? 'Array' : typeof calendarEvents}</div>
                        </div>
                      </details>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Smart & Priority Inbox Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-100">Smart & Priority Inbox</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                  </div>
                ) : Array.isArray(emails) && emails.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No emails found</p>
                  </div>
                ) : Array.isArray(emails) && emails.length > 0 ? (
                  emails.slice(0, 3).map((email) => (
                    <div 
                      key={email.id} 
                      className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors"
                      onClick={() => navigate('/gmail')}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-600 text-white text-sm font-medium">
                          {getAvatarInitial(email.from)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-200">{email.from}</span>
                          <span className="text-xs text-gray-400">{getTimeAgo(email.date)}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-200">{email.subject}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{email.snippet}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Email data unavailable</p>
                  </div>
                )}
                {Array.isArray(emails) && emails.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => navigate('/gmail')}
                  >
                    View All {emails.length} Emails
                  </Button>
                )}
              </CardContent>
            </Card>

                         {/* Daily Taskboard Card */}
             <Card id="taskboard-section" className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-100">Daily Taskboard</CardTitle>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                    {tasks.filter(task => task.completed).length}/{tasks.length} completed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Add new task input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                  <Button
                    onClick={addNewTask}
                    disabled={!newTaskTitle.trim()}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </Button>
                </div>
                
                {/* Task list */}
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors group"
                    >
                      <div 
                        className="flex items-center space-x-3 flex-1 cursor-pointer"
                        onClick={() => toggleTaskCompletion(task.id)}
                      >
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                        <span className={`text-sm flex-1 ${task.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                          {task.title}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-600 rounded relative z-20"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    <p className="text-sm">No tasks yet. Add one above!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 bg-gray-800 border-l border-gray-700 p-6 relative z-10">
          <div className="space-y-6">
            {/* AI Suggestions Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-100">AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white relative z-20"
                  onClick={() => navigate('/chat')}
                >
                  <MessageSquare className="w-4 h-4 mr-3" />
                  Chat with AI Assistant
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700 relative z-20"
                  onClick={() => navigate('/gmail')}
                >
                  <Mail className="w-4 h-4 mr-3" />
                  Summarize Emails
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700 relative z-20"
                  onClick={() => navigate('/workspace-ai')}
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>

            {/* Calendar Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-100">Calendar</CardTitle>
                <Calendar className="w-5 h-5 text-gray-400" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-400 mb-3">
                  {formatDate(currentDate)}
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  </div>
                ) : calendarEvents.length === 0 ? (
                  <div className="text-center py-4 text-gray-400">
                    <p className="text-sm">No upcoming events</p>
                  </div>
                ) : (
                  Array.isArray(calendarEvents) && calendarEvents.length > 0 ? (
                    calendarEvents.slice(0, 3).map((event) => (
                      <div 
                        key={event.id || event.summary} 
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors relative z-20"
                        onClick={() => navigate('/workspace-ai')}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-200">{event.summary || event.title || 'Untitled Event'}</p>
                          <p className="text-xs text-gray-400">
                            {event.start && event.end ? `${formatTime(event.start)} - ${formatTime(event.end)}` : 'Time TBD'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {event.attendees && Array.isArray(event.attendees) && event.attendees.length > 0 && (
                            <Badge variant="secondary" className="text-xs bg-purple-600 text-white">
                              {event.attendees.length} attending
                            </Badge>
                          )}
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      <p className="text-sm">No upcoming events</p>
                    </div>
                  )
                )}
                {Array.isArray(calendarEvents) && calendarEvents.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 relative z-20"
                    onClick={() => navigate('/workspace-ai')}
                  >
                    View All {calendarEvents.length} Events
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Connected Docs Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-100">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700 relative z-20"
                  onClick={() => navigate('/gmail')}
                >
                  <Mail className="w-4 h-4 mr-3" />
                  Check Gmail
                </Button>
                                 <Button 
                   variant="outline" 
                   className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700 relative z-20"
                   onClick={() => navigate('/workspace-ai')}
                 >
                   <Calendar className="w-4 h-4 mr-3" />
                   View Calendar
                 </Button>
                 <Button 
                   variant="outline" 
                   className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700 relative z-20"
                   onClick={() => navigate('/google-drive')}
                 >
                   <FileText className="w-4 h-4 mr-3" />
                   Google Drive
                 </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700 relative z-20"
                  onClick={() => navigate('/chat')}
                >
                  <MessageSquare className="w-4 h-4 mr-3" />
                  AI Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
