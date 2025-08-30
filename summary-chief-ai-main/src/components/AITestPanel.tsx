import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, FileText, MessageSquare } from 'lucide-react';

interface AIAdviceRequest {
  profession: string;
  location: string;
  temp: number;
  humidity: number;
  risk: string;
  content?: string;
  type?: 'email' | 'document' | 'meeting' | 'general';
}

interface AIAdviceResponse {
  success: boolean;
  advice: string;
  summary?: string;
  recommendations?: string[];
  timestamp: Date;
}

export function AITestPanel() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIAdviceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<AIAdviceRequest>({
    profession: 'Software Engineer',
    location: 'San Francisco',
    temp: 0,
    humidity: 0,
    risk: 'low',
    content: '',
    type: 'general'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('http://localhost:5001/api/ai-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (data.success) {
        setResponse(data.data);
      } else {
        setError(data.message || 'Failed to get AI advice');
      }
    } catch (err) {
      setError('Failed to connect to backend server. Make sure it\'s running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!formData.content) {
      setError('Please enter some content to summarize');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('http://localhost:5001/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: formData.content,
          type: formData.type
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setResponse({
          success: true,
          advice: data.data.summary,
          timestamp: new Date()
        });
      } else {
        setError(data.message || 'Failed to generate summary');
      }
    } catch (err) {
      setError('Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">🤖 AI Backend Test Panel</h2>
        <p className="text-muted-foreground">
          Test the WorkSpace AI backend functionality with Togather.ai integration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Advice Request
            </CardTitle>
            <CardDescription>
              Get personalized productivity advice based on your profession and content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., San Francisco"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type">Content Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="content">Content (Optional)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter content to analyze (emails, documents, meeting notes, etc.)"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Getting AI Advice...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Get AI Advice
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSummarize}
                  disabled={loading || !formData.content}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Summarize
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Response Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              AI Response
            </CardTitle>
            <CardDescription>
              {response ? 'AI-generated advice and insights' : 'Response will appear here'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive font-medium">Error</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            )}

            {response && !loading && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {response.timestamp.toLocaleString()}
                  </Badge>
                  {response.success && (
                    <Badge variant="default">Success</Badge>
                  )}
                </div>

                <div className="prose prose-sm max-w-none">
                  <h4 className="font-semibold mb-2">AI Advice:</h4>
                  <div className="bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">
                    {response.advice}
                  </div>
                </div>

                {response.summary && (
                  <div className="prose prose-sm max-w-none">
                    <h4 className="font-semibold mb-2">Summary:</h4>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      {response.summary}
                    </div>
                  </div>
                )}

                {response.recommendations && response.recommendations.length > 0 && (
                  <div className="prose prose-sm max-w-none">
                    <h4 className="font-semibold mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {response.recommendations.map((rec, index) => (
                        <li key={index} className="bg-muted/50 p-2 rounded">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Backend Status */}
      <Card>
        <CardHeader>
          <CardTitle>Backend Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Backend running on port 5001</span>
            </div>
            <Badge variant="outline">OpenAI Integration Ready</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            OpenAI API is configured and ready for real AI responses
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 