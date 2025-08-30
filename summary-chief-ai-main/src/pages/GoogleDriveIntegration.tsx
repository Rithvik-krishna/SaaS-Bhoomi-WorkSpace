import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Eye
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

const API_BASE = 'http://localhost:5001/api';

const GoogleDriveIntegration: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

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
      fetchFiles(userId);
    } else if (googleError === 'true') {
      toast.error('Failed to connect to Google Drive. Please try again.');
    }
  }, [searchParams]);

  const checkConnectionStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/google/auth/status`, {
        params: { user_id: user?.email },
        withCredentials: true
      });

      if (response.data.success && response.data.data.connected) {
        setIsConnected(true);
        setUserProfile(response.data.data.userProfile);
        fetchFiles(user?.email || '');
      }
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
      const response = await axios.get(`${API_BASE}/drive/files`, {
        params: { user_id: userId, maxResults: 50 },
        withCredentials: true
      });

      if (response.data.success) {
        setFiles(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch Drive files');
    } finally {
      setLoading(false);
    }
  };

  const searchFiles = async () => {
    if (!searchQuery.trim()) {
      fetchFiles(user?.email || '');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/drive/search`, {
        params: { 
          user_id: user?.email, 
          query: searchQuery,
          maxResults: 50 
        },
        withCredentials: true
      });

      if (response.data.success) {
        setFiles(response.data.data);
      }
    } catch (error) {
      console.error('Error searching files:', error);
      toast.error('Failed to search files');
    } finally {
      setLoading(false);
    }
  };

  const disconnectFromGoogle = async () => {
    try {
      await axios.post(`${API_BASE}/google/auth/disconnect`, {
        user_id: user?.email
      }, {
        withCredentials: true
      });

      setIsConnected(false);
      setUserProfile(null);
      setFiles([]);
      toast.success('Disconnected from Google Drive');
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Failed to disconnect from Google Drive');
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
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-md shadow-xl sticky top-0 z-10">
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
                  onClick={connectToGoogle}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Folder className="w-4 h-4" />
                  Connect Google Drive
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

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
                onClick={() => connectToGoogle(false)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Folder className="w-4 h-4" />
                Connect Google Drive
              </Button>
              <Button
                onClick={() => connectToGoogle(true)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleDriveIntegration;
