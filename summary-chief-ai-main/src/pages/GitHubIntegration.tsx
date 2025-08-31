import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Github, 
  GitBranch, 
  GitPullRequest, 
  GitCommit, 
  Star, 
  Eye, 
  Code, 
  Users, 
  Calendar,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageCircle,
  FileText,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  private: boolean;
  html_url: string;
}

interface GitHubPR {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed' | 'merged';
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
  html_url: string;
  review_comments: number;
  comments: number;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

interface GitHubReview {
  id: number;
  user: {
    login: string;
    avatar_url: string;
  };
  body: string;
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED';
  submitted_at: string;
  html_url: string;
}

const API_BASE = 'http://localhost:5001/api';

export default function GitHubIntegration() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [pullRequests, setPullRequests] = useState<GitHubPR[]>([]);
  const [prReviews, setPrReviews] = useState<GitHubReview[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [selectedPR, setSelectedPR] = useState<GitHubPR | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<'all' | 'open' | 'closed' | 'merged'>('all');
  const [githubAccessToken, setGithubAccessToken] = useState<string>('');

  useEffect(() => {
    // Check if we have a GitHub access token in localStorage
    const token = localStorage.getItem('github_access_token');
    if (token) {
      setGithubAccessToken(token);
      fetchGitHubDataWithToken(token);
    } else {
      // Try to fetch data directly without explicit connection
      fetchGitHubDataDirectly();
    }
  }, []);

  const fetchGitHubDataWithToken = async (accessToken: string) => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      const [userResponse, reposResponse] = await Promise.all([
        fetch(`${API_BASE}/github/profile`, { headers }),
        fetch(`${API_BASE}/github/repositories`, { headers })
      ]);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setGithubUser(userData);
        setIsConnected(true);
      }

      if (reposResponse.ok) {
        const reposData = await reposResponse.json();
        setRepositories(reposData);
        console.log('Fetched real repositories:', reposData.length);
      }
    } catch (error) {
      console.error('Failed to fetch GitHub data with token:', error);
      toast.error('Failed to fetch GitHub data');
    } finally {
      setLoading(false);
    }
  };

  const fetchGitHubDataDirectly = async () => {
    setLoading(true);
    try {
      // Try to fetch repositories directly without checking connection status
      const reposResponse = await fetch(`${API_BASE}/github/repositories`);

      if (reposResponse.ok) {
        const reposData = await reposResponse.json();
        setRepositories(reposData);
        console.log('Fetched repositories:', reposData.length);
        
        // If we have repositories, also try to fetch user profile
        if (reposData.length > 0) {
          const userResponse = await fetch(`${API_BASE}/github/profile`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setGithubUser(userData);
            setIsConnected(true);
          }
        }
      } else {
        console.log('Failed to fetch repositories:', reposResponse.status);
      }
    } catch (error) {
      console.error('Failed to fetch GitHub data directly:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRepositoryPRs = async (repoName: string) => {
    if (!githubUser) return;
    
    try {
      const [owner, repo] = repoName.split('/');
      const response = await fetch(`${API_BASE}/github/repos/${owner}/${repo}/pulls`, {
        headers: {
          'Authorization': `Bearer ${githubAccessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const prs = await response.json();
        setPullRequests(prs);
        setSelectedRepo(repoName);
      }
    } catch (error) {
      console.error('Failed to fetch pull requests:', error);
      toast.error('Failed to fetch pull requests');
    }
  };

  const fetchPRReviews = async (pr: GitHubPR) => {
    if (!githubUser || !selectedRepo) return;
    
    try {
      const [owner, repo] = selectedRepo.split('/');
      const response = await fetch(`${API_BASE}/github/repos/${owner}/${repo}/pulls/${pr.number}/reviews`, {
        headers: {
          'Authorization': `Bearer ${githubAccessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const reviews = await response.json();
        setPrReviews(reviews);
        setSelectedPR(pr);
      }
    } catch (error) {
      console.error('Failed to fetch PR reviews:', error);
      toast.error('Failed to fetch PR reviews');
    }
  };

  const handleConnectGitHub = () => {
    // Check if GitHub OAuth is configured
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'your_github_client_id';
    
    if (clientId === 'your_github_client_id') {
      toast.error('GitHub OAuth not configured. Please set up GitHub OAuth credentials first.');
      return;
    }
    
    // Redirect to GitHub OAuth
    const redirectUri = encodeURIComponent(`${window.location.origin}/github-callback`);
    const scope = encodeURIComponent('repo user');
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const disconnectGitHub = async () => {
    try {
      const response = await fetch(`${API_BASE}/github/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubAccessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setIsConnected(false);
        setGithubUser(null);
        setRepositories([]);
        setPullRequests([]);
        localStorage.removeItem('github_access_token');
        setGithubAccessToken('');
        toast.success('GitHub disconnected successfully');
      }
    } catch (error) {
      console.error('Failed to disconnect GitHub:', error);
      toast.error('Failed to disconnect GitHub');
    }
  };

  const filteredPRs = pullRequests.filter(pr => {
    if (filterState !== 'all' && pr.state !== filterState) return false;
    if (searchQuery && !pr.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStateColor = (state: string) => {
    switch (state) {
      case 'open': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'merged': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getReviewStateColor = (state: string) => {
    switch (state) {
      case 'APPROVED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'CHANGES_REQUESTED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'COMMENTED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate summary statistics
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
  const languages = [...new Set(repositories.map(repo => repo.language).filter(Boolean))];
  
  const openPRs = pullRequests.filter(pr => pr.state === 'open').length;
  const mergedPRs = pullRequests.filter(pr => pr.state === 'merged').length;
  const closedPRs = pullRequests.filter(pr => pr.state === 'closed').length;
  const totalComments = pullRequests.reduce((sum, pr) => sum + pr.comments, 0);
  
  const approvedReviews = prReviews.filter(review => review.state === 'APPROVED').length;
  const changesRequested = prReviews.filter(review => review.state === 'CHANGES_REQUESTED').length;
  const commentedReviews = prReviews.filter(review => review.state === 'COMMENTED').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 backdrop-blur-xl border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-center">
                  <Github className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">GitHub Integration</h1>
                  <p className="text-white/70">Manage repositories, PRs, and code reviews</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isConnected && githubUser && (
                <Button
                  onClick={disconnectGitHub}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                >
                  Disconnect GitHub
                </Button>
              )}
              
              {!isConnected && (
                <Button
                  onClick={handleConnectGitHub}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Connect GitHub Account
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Connection Status */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-black/20 backdrop-blur-xl border-white/10">
              <CardContent className="p-6">
                <div className="text-center">
                  <Github className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Connect Your GitHub Account
                  </h3>
                  <p className="text-white/70 mb-4">
                    Connect your GitHub account to view repositories, pull requests, and code reviews.
                  </p>
                  <Button
                    onClick={handleConnectGitHub}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Connect GitHub Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Debug Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-white/70">Connected:</span>
                  <span className={`ml-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                    {isConnected ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-white/70">Repositories:</span>
                  <span className="ml-2 text-white">{repositories.length}</span>
                </div>
                <div>
                  <span className="text-white/70">Loading:</span>
                  <span className={`ml-2 ${loading ? 'text-yellow-400' : 'text-green-400'}`}>
                    {loading ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              <Button
                onClick={fetchGitHubDataDirectly}
                variant="outline"
                size="sm"
                className="mt-4 border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try to Load Existing Data
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Summary Section */}
        {repositories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Data Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Total Repos</p>
                      <p className="text-white text-xl font-semibold">{repositories.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Total Stars</p>
                      <p className="text-white text-xl font-semibold">{totalStars}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Total Forks</p>
                      <p className="text-white text-xl font-semibold">{totalForks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Code className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Languages</p>
                      <p className="text-white text-xl font-semibold">{languages.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        {repositories.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Tabs defaultValue="repositories" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-xl border-white/10">
                <TabsTrigger value="repositories" className="text-white data-[state=active]:bg-white/10">
                  <GitBranch className="w-4 h-4 mr-2" />
                  Repositories
                </TabsTrigger>
                <TabsTrigger value="pull-requests" className="text-white data-[state=active]:bg-white/10">
                  <GitPullRequest className="w-4 h-4 mr-2" />
                  Pull Requests
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-white data-[state=active]:bg-white/10">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Code Reviews
                </TabsTrigger>
              </TabsList>

              {/* Repositories Tab */}
              <TabsContent value="repositories" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {repositories.map((repo) => (
                    <motion.div
                      key={repo.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:bg-black/30 transition-all cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-white text-lg mb-2">{repo.name}</CardTitle>
                              <p className="text-white/70 text-sm line-clamp-2">
                                {repo.description || 'No description available'}
                              </p>
                            </div>
                            <Badge variant={repo.private ? 'destructive' : 'secondary'} className="ml-2">
                              {repo.private ? 'Private' : 'Public'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-white/70 mb-3">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                {repo.stargazers_count}
                              </span>
                              <span className="flex items-center gap-1">
                                <GitBranch className="w-4 h-4" />
                                {repo.forks_count}
                              </span>
                            </div>
                            <span className="text-xs">{formatDate(repo.updated_at)}</span>
                          </div>
                          
                          {repo.language && (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <span className="text-white/70 text-sm">{repo.language}</span>
                            </div>
                          )}
                          
                          <div className="mt-4 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fetchRepositoryPRs(repo.full_name)}
                              className="flex-1 border-white/20 text-white hover:bg-white/10"
                            >
                              <GitPullRequest className="w-4 h-4 mr-2" />
                              View PRs
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(repo.html_url, '_blank')}
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Pull Requests Tab */}
              <TabsContent value="pull-requests" className="mt-6">
                {selectedRepo ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white">
                        Pull Requests for {selectedRepo}
                      </h3>
                      <Button
                        onClick={() => setSelectedRepo('')}
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Change Repository
                      </Button>
                    </div>
                    
                    {/* PR Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-white/70 text-sm">Open PRs</p>
                            <p className="text-green-400 text-2xl font-bold">{openPRs}</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-white/70 text-sm">Merged PRs</p>
                            <p className="text-purple-400 text-2xl font-bold">{mergedPRs}</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-white/70 text-sm">Closed PRs</p>
                            <p className="text-red-400 text-2xl font-bold">{closedPRs}</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-white/70 text-sm">Total Comments</p>
                            <p className="text-blue-400 text-2xl font-bold">{totalComments}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                        <Input
                          placeholder="Search pull requests..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/50"
                        />
                      </div>
                      <select
                        value={filterState}
                        onChange={(e) => setFilterState(e.target.value as any)}
                        className="px-4 py-2 bg-black/20 border border-white/10 text-white rounded-md"
                      >
                        <option value="all">All States</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="merged">Merged</option>
                      </select>
                    </div>

                    {/* PR List */}
                    <div className="space-y-4">
                      {filteredPRs.map((pr) => (
                        <motion.div
                          key={pr.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:bg-black/30 transition-all">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Badge className={getStateColor(pr.state)}>
                                      {pr.state.charAt(0).toUpperCase() + pr.state.slice(1)}
                                    </Badge>
                                    <span className="text-white/70 text-sm">#{pr.number}</span>
                                  </div>
                                  <h4 className="text-white text-lg font-semibold mb-2">{pr.title}</h4>
                                  {pr.body && (
                                    <p className="text-white/70 text-sm line-clamp-2 mb-3">
                                      {pr.body}
                                    </p>
                                  )}
                                </div>
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={pr.user.avatar_url} />
                                  <AvatarFallback className="bg-gray-700 text-white">
                                    {pr.user.login.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                                <div className="text-center">
                                  <p className="text-white/70">Commits</p>
                                  <p className="text-white font-semibold">{pr.commits}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-white/70">Changed Files</p>
                                  <p className="text-white font-semibold">{pr.changed_files}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-white/70">Additions</p>
                                  <p className="text-green-400 font-semibold">+{pr.additions}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-white/70">Deletions</p>
                                  <p className="text-red-400 font-semibold">-{pr.deletions}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-white/70">
                                  <span>Created {formatDate(pr.created_at)}</span>
                                  <span>Updated {formatDate(pr.updated_at)}</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchPRReviews(pr)}
                                    className="border-white/20 text-white hover:bg-white/10"
                                  >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    View Reviews
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(pr.html_url, '_blank')}
                                    className="border-white/20 text-white hover:bg-white/10"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                      
                      {filteredPRs.length === 0 && (
                        <div className="text-center py-12">
                          <GitPullRequest className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-white/70">No pull requests found</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <GitPullRequest className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-white/70 mb-4">Select a repository to view pull requests</p>
                    <p className="text-white/50 text-sm">Click on "View PRs" from any repository card above</p>
                  </div>
                )}
              </TabsContent>

              {/* Code Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                {selectedPR ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white">
                        Code Reviews for PR #{selectedPR.number} - {selectedPR.title}
                      </h3>
                      <Button
                        onClick={() => setSelectedPR(null)}
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Back to PRs
                      </Button>
                    </div>
                    
                    {/* Review Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-white/70 text-sm">Approved</p>
                            <p className="text-green-400 text-2xl font-bold">{approvedReviews}</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-white/70 text-sm">Changes Requested</p>
                            <p className="text-red-400 text-2xl font-bold">{changesRequested}</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-white/70 text-sm">Commented</p>
                            <p className="text-blue-400 text-2xl font-bold">{commentedReviews}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {prReviews.map((review) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={review.user.avatar_url} />
                                    <AvatarFallback className="bg-gray-700 text-white">
                                      {review.user.login.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="text-white font-semibold">{review.user.login}</h4>
                                    <Badge className={getReviewStateColor(review.state)}>
                                      {review.state.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                </div>
                                <span className="text-white/70 text-sm">
                                  {formatDate(review.submitted_at)}
                                </span>
                              </div>
                              
                              {review.body && (
                                <div className="mb-4">
                                  <p className="text-white/90">{review.body}</p>
                                </div>
                              )}
                              
                              <div className="flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(review.html_url, '_blank')}
                                  className="border-white/20 text-white hover:bg-white/10"
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View on GitHub
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                      
                      {prReviews.length === 0 && (
                        <div className="text-center py-12">
                          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-white/70">No code reviews found for this PR</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-white/70 mb-4">Select a pull request to view code reviews</p>
                    <p className="text-white/50 text-sm">Click on "View Reviews" from any PR above</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            {loading ? (
              <div>
                <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-white/70">Loading GitHub data...</p>
              </div>
            ) : (
              <div>
                <Github className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-white/70 mb-4">No repositories found</p>
                <p className="text-white/50 text-sm">Connect your GitHub account or try loading existing data</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
