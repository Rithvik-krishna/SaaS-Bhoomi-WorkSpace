import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Folder,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Search,
  RefreshCw,
  ExternalLink,
  Download,
  Eye,
  Sparkles,
  MessageSquare,
  Clock,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  iconLink: string;
  webViewLink?: string;
  size?: string;
  modifiedTime?: string;
  createdTime?: string;
  thumbnailLink?: string;
}

interface DocumentSummary {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  readingTime: number;
  wordCount: number;
}

interface MeetingNotes {
  transcript: string;
  summary: string;
  keyDecisions: string[];
  actionItems: string[];
  participants: string[];
  duration: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

const API_BASE = 'http://localhost:5001/api';

const GoogleDriveIntegration: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name?: string; email?: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [documentSummary, setDocumentSummary] = useState<DocumentSummary | null>(null);
  const [meetingNotes, setMeetingNotes] = useState<MeetingNotes | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);

  // Check connection status on mount
  useEffect(() => {
    if (user) {
      checkConnectionStatus();
    }
  }, [user]);

  // Handle OAuth callback
  useEffect(() => {
    const googleConnected = searchParams.get('google_connected');
    const userId = searchParams.get('user_id');
    const googleError = searchParams.get('google_error');

    if (googleConnected === 'true' && userId) {
      toast.success('Successfully connected to Google Drive!');
      setIsConnected(true);
      // Store in localStorage for other pages to use
      localStorage.setItem('google_user_id', userId);
      fetchFiles(userId);
    } else if (googleError === 'true') {
      toast.error('Failed to connect to Google Drive. Please try again.');
    }
  }, [searchParams]);

  const checkConnectionStatus = async () => {
    try {
      // For demo purposes, always show as connected
      setIsConnected(true);
      setUserProfile({
        name: 'Demo User',
        email: 'demo@company.com'
      });
      
      // Load demo files
      fetchFiles('demo-user-id');
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const connectToGoogle = async (forceReauth: boolean = false) => {
    try {
      const url = forceReauth 
        ? `${API_BASE}/google/auth/url?force=true`
        : `${API_BASE}/google/auth/url`;
        
      const response = await axios.get(url, {
        withCredentials: true
      });

      if (response.data.success) {
        window.location.href = response.data.data.authUrl;
      }
    } catch (error) {
      console.error('Error getting auth URL:', error);
      toast.error('Failed to initiate Google connection');
    }
  };

  const fetchFiles = async (userId: string) => {
    setLoading(true);
    try {
      // For demo purposes, use hardcoded sample files
      const sampleFiles = await getSampleFiles();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setFiles(sampleFiles);
      console.log('Demo files loaded:', sampleFiles.length);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch Drive files');
    } finally {
      setLoading(false);
    }
  };

  const searchFiles = async () => {
    const userId = localStorage.getItem('google_user_id');
    if (!userId) {
      toast.error('Please connect your Google account first');
      return;
    }

    if (!searchQuery.trim()) {
      fetchFiles(userId);
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, filter the hardcoded files
      const allFiles = await getSampleFiles();
      const filteredFiles = allFiles.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.mimeType.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setFiles(filteredFiles);
      console.log(`Search results for "${searchQuery}":`, filteredFiles.length);
    } catch (error) {
      console.error('Error searching files:', error);
      toast.error('Failed to search files');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get sample files (extracted from fetchFiles)
  const getSampleFiles = async (): Promise<DriveFile[]> => {
    return [
      {
        id: '1',
        name: 'Q4 Business Strategy Document',
        mimeType: 'application/vnd.google-apps.document',
        iconLink: '',
        webViewLink: 'https://docs.google.com/document/d/1',
        size: '245760',
        modifiedTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Team Meeting Recording - Dec 15',
        mimeType: 'video/mp4',
        iconLink: '',
        webViewLink: 'https://drive.google.com/file/d/2',
        size: '52428800',
        modifiedTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        name: 'Project Budget Spreadsheet',
        mimeType: 'application/vnd.google-apps.spreadsheet',
        iconLink: '',
        webViewLink: 'https://docs.google.com/spreadsheets/d/3',
        size: '102400',
        modifiedTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        name: 'Client Presentation Slides',
        mimeType: 'application/vnd.google-apps.presentation',
        iconLink: '',
        webViewLink: 'https://docs.google.com/presentation/d/4',
        size: '153600',
        modifiedTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        createdTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        name: 'Product Requirements Document',
        mimeType: 'application/pdf',
        iconLink: '',
        webViewLink: 'https://drive.google.com/file/d/5',
        size: '2048000',
        modifiedTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        name: 'Weekly Standup Audio',
        mimeType: 'audio/mp3',
        iconLink: '',
        webViewLink: 'https://drive.google.com/file/d/6',
        size: '15728640',
        modifiedTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        createdTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '7',
        name: 'Marketing Campaign Data',
        mimeType: 'text/csv',
        iconLink: '',
        webViewLink: 'https://drive.google.com/file/d/7',
        size: '51200',
        modifiedTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdTime: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '8',
        name: 'Code Review Meeting',
        mimeType: 'video/webm',
        iconLink: '',
        webViewLink: 'https://drive.google.com/file/d/8',
        size: '73400320',
        modifiedTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        createdTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '9',
        name: 'API Documentation',
        mimeType: 'text/markdown',
        iconLink: '',
        webViewLink: 'https://drive.google.com/file/d/9',
        size: '25600',
        modifiedTime: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        createdTime: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '10',
        name: 'User Research Report',
        mimeType: 'application/vnd.google-apps.document',
        iconLink: '',
        webViewLink: 'https://docs.google.com/document/d/10',
        size: '307200',
        modifiedTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdTime: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '11',
        name: 'Design Assets',
        mimeType: 'application/vnd.google-apps.folder',
        iconLink: '',
        webViewLink: 'https://drive.google.com/drive/folders/11',
        size: '',
        modifiedTime: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        createdTime: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '12',
        name: 'Company Logo',
        mimeType: 'image/png',
        iconLink: '',
        webViewLink: 'https://drive.google.com/file/d/12',
        size: '102400',
        modifiedTime: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        createdTime: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  const disconnectFromGoogle = async () => {
    try {
      const userId = localStorage.getItem('google_user_id');
      if (!userId) {
        toast.error('No Google account connected');
        return;
      }

      await axios.post(`${API_BASE}/google/auth/disconnect`, {
        user_id: userId
      }, {
        withCredentials: true
      });

      setIsConnected(false);
      setUserProfile(null);
      setFiles([]);
      localStorage.removeItem('google_user_id');
      toast.success('Disconnected from Google Drive');
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Failed to disconnect from Google Drive');
    }
  };

  const summarizeDocument = async (file: DriveFile) => {
    setSummaryLoading(true);
    setDocumentSummary(null);
    setSelectedFile(file);
    
    try {
      // For demo purposes, show sample summary
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing
      
      const demoSummary: DocumentSummary = {
        summary: `This ${file.name} contains comprehensive information about ${file.name.toLowerCase().includes('strategy') ? 'business strategy and planning' : file.name.toLowerCase().includes('budget') ? 'financial planning and budget allocation' : file.name.toLowerCase().includes('requirements') ? 'product requirements and specifications' : 'key business information'}. The document outlines important objectives, methodologies, and expected outcomes for the upcoming quarter.`,
        keyPoints: [
          'Strategic objectives and key performance indicators',
          'Resource allocation and budget planning',
          'Timeline and milestone tracking',
          'Risk assessment and mitigation strategies',
          'Stakeholder communication plan'
        ],
        actionItems: [
          'Review and approve the proposed strategy',
          'Allocate resources according to the budget plan',
          'Schedule regular progress review meetings',
          'Implement risk mitigation measures',
          'Prepare stakeholder communication materials'
        ],
        sentiment: 'positive' as const,
        readingTime: 8,
        wordCount: 2400
      };
      
      setDocumentSummary(demoSummary);
      toast.success('Document summarized successfully!');
    } catch (error: unknown) {
      console.error('Error summarizing document:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to summarize document';
      toast.error(errorMessage);
    } finally {
      setSummaryLoading(false);
    }
  };

  const transcribeFile = async (file: DriveFile) => {
    setTranscriptionLoading(true);
    setMeetingNotes(null);
    setSelectedFile(file);
    
    try {
      // For demo purposes, show sample transcription
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate AI processing
      
      const demoMeetingNotes: MeetingNotes = {
        transcript: `[00:00:00] Meeting started. Hello everyone, welcome to our ${file.name.toLowerCase().includes('team') ? 'team meeting' : file.name.toLowerCase().includes('code') ? 'code review session' : 'weekly standup'}. Let's go around and share our updates.\n\n[00:02:15] John: I've completed the frontend implementation for the new feature. The code is ready for review.\n\n[00:03:30] Sarah: Great work John. I've been working on the backend API integration. We should have it ready by Friday.\n\n[00:05:45] Mike: I've identified some potential performance issues we should address before the release.\n\n[00:08:20] Discussion about timeline and priorities continues...`,
        summary: `This ${file.name.toLowerCase().includes('team') ? 'team meeting' : file.name.toLowerCase().includes('code') ? 'code review session' : 'weekly standup'} covered project progress, technical challenges, and upcoming milestones. The team discussed implementation details, identified potential issues, and agreed on next steps.`,
        keyDecisions: [
          'Frontend implementation is complete and ready for review',
          'Backend API integration will be completed by Friday',
          'Performance optimization is needed before release',
          'Timeline adjustments may be required'
        ],
        actionItems: [
          'Schedule code review session for the new feature',
          'Complete backend API integration by Friday',
          'Investigate and resolve performance issues',
          'Update project timeline based on findings'
        ],
        participants: ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Wilson'],
        duration: 45,
        sentiment: 'positive' as const
      };
      
      setMeetingNotes(demoMeetingNotes);
      toast.success('File transcribed and meeting notes generated!');
    } catch (error: unknown) {
      console.error('Error transcribing file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to transcribe file';
      toast.error(errorMessage);
    } finally {
      setTranscriptionLoading(false);
    }
  };

  const isSummarizable = (mimeType: string) => {
    return [
      'application/vnd.google-apps.document',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      'application/json',
      'text/markdown'
    ].includes(mimeType);
  };

  const isTranscribable = (mimeType: string) => {
    return mimeType.startsWith('audio/') || mimeType.startsWith('video/');
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) return <Folder className="w-5 h-5 text-blue-500" />;
    if (mimeType.includes('document')) return <FileText className="w-5 h-5 text-green-500" />;
    if (mimeType.includes('image')) return <Image className="w-5 h-5 text-purple-500" />;
    if (mimeType.includes('video')) return <Video className="w-5 h-5 text-red-500" />;
    if (mimeType.includes('audio')) return <Music className="w-5 h-5 text-yellow-500" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="w-5 h-5 text-gray-500" />;
    return <FileText className="w-5 h-5 text-gray-400" />;
  };

  const formatFileSize = (size?: string) => {
    if (!size) return '';
    const bytes = parseInt(size);
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBackNavigation = () => {
    navigate('/dashboard');
  };

  const handleConnectGoogle = () => {
    connectToGoogle();
  };

  const handleReauthenticate = () => {
    connectToGoogle(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Google Drive Integration</h1>
          <p className="text-gray-400 mb-6">Please log in to access Google Drive</p>
          <Button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-blue-950/20 text-gray-100">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
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
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-md shadow-xl sticky top-0 z-10"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackNavigation}
                className="text-gray-300 hover:bg-gray-800 p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-50">Google Drive Integration</h1>
                  <p className="text-sm text-gray-400">Access and manage your Drive files</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isConnected && userProfile && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span>Connected as: {userProfile.name || userProfile.email}</span>
                </div>
              )}
              
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => fetchFiles(user?.email || '')}
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    onClick={disconnectFromGoogle}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-900/40"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleConnectGoogle}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Folder className="w-4 h-4" />
                  Connect Google Drive
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Connect to Google Drive</h2>
            <p className="text-gray-400 mb-6">
              Connect your Google Drive to access and manage your files
            </p>
            <div className="flex items-center gap-3 justify-center">
                             <Button
                 onClick={handleConnectGoogle}
                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
               >
                 <Folder className="w-4 h-4" />
                 Connect Google Drive
               </Button>
               <Button
                 onClick={handleReauthenticate}
                 variant="outline"
                 className="border-orange-500 text-orange-500 hover:bg-orange-900/40"
               >
                 Re-authenticate
               </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search Bar */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchFiles()}
                      className="pl-10 bg-gray-800 border-gray-700 text-gray-100 focus-visible:ring-blue-500"
                    />
                  </div>
                  <Button
                    onClick={searchFiles}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Files List */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Files ({files.length})</span>
                  {searchQuery && (
                    <Badge variant="secondary" className="bg-blue-900/40 text-blue-400">
                      Search: "{searchQuery}"
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="ml-2 text-gray-400">Loading files...</span>
                  </div>
                ) : files.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No files found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {getFileIcon(file.mimeType)}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-200 truncate">{file.name}</h3>
                            <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                              {file.size && <span>{formatFileSize(file.size)}</span>}
                              {file.modifiedTime && <span>Modified: {formatDate(file.modifiedTime)}</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* AI Summarize Button */}
                          {isSummarizable(file.mimeType) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => summarizeDocument(file)}
                              disabled={summaryLoading}
                              className="text-gray-400 hover:text-purple-400"
                              title="AI Summarize"
                            >
                              <Sparkles className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {/* AI Transcribe Button */}
                          {isTranscribable(file.mimeType) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => transcribeFile(file)}
                              disabled={transcriptionLoading}
                              className="text-gray-400 hover:text-green-400"
                              title="AI Transcribe"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {file.webViewLink && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(file.webViewLink, '_blank')}
                              className="text-gray-400 hover:text-blue-400"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Results Section */}
            {(documentSummary || meetingNotes) && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    AI Analysis Results
                    {selectedFile && (
                      <span className="text-sm text-gray-400 font-normal">
                        - {selectedFile.name}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Document Summary */}
                  {documentSummary && (
                    <div className="space-y-4">
                      <div className="border-b border-gray-700 pb-4">
                        <h3 className="text-lg font-semibold text-purple-400 mb-2">Document Summary</h3>
                        <p className="text-gray-300 mb-3">{documentSummary.summary}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-200 mb-2">Key Points</h4>
                            <ul className="space-y-1">
                              {documentSummary.keyPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-200 mb-2">Action Items</h4>
                            <ul className="space-y-1">
                              {documentSummary.actionItems.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {documentSummary.readingTime} min read
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {documentSummary.wordCount} words
                          </span>
                          <span className={`flex items-center gap-1 ${getSentimentColor(documentSummary.sentiment)}`}>
                            {getSentimentIcon(documentSummary.sentiment)}
                            {documentSummary.sentiment} sentiment
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Meeting Notes */}
                  {meetingNotes && (
                    <div className="space-y-4">
                      <div className="border-b border-gray-700 pb-4">
                        <h3 className="text-lg font-semibold text-green-400 mb-2">Meeting Notes</h3>
                        <p className="text-gray-300 mb-3">{meetingNotes.summary}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-200 mb-2">Key Decisions</h4>
                            <ul className="space-y-1">
                              {meetingNotes.keyDecisions.map((decision, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                  {decision}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-200 mb-2">Action Items</h4>
                            <ul className="space-y-1">
                              {meetingNotes.actionItems.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {meetingNotes.participants.length} participants
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {meetingNotes.duration} minutes
                          </span>
                          <span className={`flex items-center gap-1 ${getSentimentColor(meetingNotes.sentiment)}`}>
                            {getSentimentIcon(meetingNotes.sentiment)}
                            {meetingNotes.sentiment} sentiment
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-200 mb-2">Transcript</h4>
                        <div className="bg-gray-800 p-3 rounded-lg max-h-40 overflow-y-auto">
                          <p className="text-sm text-gray-400 whitespace-pre-wrap">{meetingNotes.transcript}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleDriveIntegration;
