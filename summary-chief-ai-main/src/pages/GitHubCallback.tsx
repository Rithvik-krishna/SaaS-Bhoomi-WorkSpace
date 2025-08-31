import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const API_BASE = 'http://localhost:5001/api';

export default function GitHubCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing GitHub authorization...');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage(`GitHub authorization failed: ${error}`);
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('No authorization code received from GitHub');
      return;
    }

    // Exchange code for access token
    exchangeCodeForToken(code);
  }, [searchParams]);

  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await fetch(`${API_BASE}/github/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.accessToken) {
          // Store the access token in localStorage
          localStorage.setItem('github_access_token', data.accessToken);
          setStatus('success');
          setMessage('GitHub connected successfully! Redirecting...');
          
          // Redirect to GitHub integration page after a short delay
          setTimeout(() => {
            navigate('/github');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('No access token received from server');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setStatus('error');
        setMessage(`Failed to connect GitHub: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      setStatus('error');
      setMessage('Network error occurred while connecting to GitHub');
    }
  };

  const handleRetry = () => {
    setStatus('loading');
    setMessage('Processing GitHub authorization...');
    const code = searchParams.get('code');
    if (code) {
      exchangeCodeForToken(code);
    }
  };

  const handleGoToGitHub = () => {
    navigate('/github');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="bg-black/20 backdrop-blur-xl border-white/10">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center mx-auto mb-4">
              <Github className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white">GitHub Authorization</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {status === 'loading' && (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 text-blue-400 mx-auto animate-spin" />
                <p className="text-white/70">{message}</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                <p className="text-white/70">{message}</p>
                <Button
                  onClick={handleGoToGitHub}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Go to GitHub Integration
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <XCircle className="w-12 h-12 text-red-400 mx-auto" />
                <p className="text-white/70">{message}</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={handleGoToGitHub}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Go to GitHub
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
