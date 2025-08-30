import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Mail, 
  Send, 
  RefreshCw, 
  FileText, 
  Clock, 
  User, 
  ArrowLeft,
  Sparkles,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import axios from 'axios';

interface EmailData {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
  snippet: string;
  threadId: string;
}

interface EmailSummary {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  priority: 'high' | 'medium' | 'low';
}

interface EmailDraft {
  subject: string;
  body: string;
  suggestions: string[];
}

const GmailIntegration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null);
  const [emailSummary, setEmailSummary] = useState<EmailSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [draftForm, setDraftForm] = useState({
    context: '',
    recipient: '',
    purpose: '',
    tone: 'professional' as 'formal' | 'casual' | 'professional'
  });

  const API_BASE = 'http://localhost:5001/api';

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchEmails();
  }, [user, navigate]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/gmail/emails?maxResults=20`, {
        withCredentials: true
      });
      setEmails(response.data.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };

  const summarizeEmail = async (email: EmailData) => {
    setSummaryLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/gmail/emails/${email.id}/summarize`, {}, {
        withCredentials: true
      });
      setEmailSummary(response.data.data.summary);
      toast.success('Email summarized successfully');
    } catch (error) {
      console.error('Error summarizing email:', error);
      toast.error('Failed to summarize email');
    } finally {
      setSummaryLoading(false);
    }
  };

  const generateDraft = async () => {
    setDraftLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/gmail/draft`, draftForm, {
        withCredentials: true
      });
      setDraft(response.data.data);
      toast.success('Email draft generated');
    } catch (error) {
      console.error('Error generating draft:', error);
      toast.error('Failed to generate email draft');
    } finally {
      setDraftLoading(false);
    }
  };

  const sendEmail = async (to: string, subject: string, body: string) => {
    try {
      await axios.post(`${API_BASE}/gmail/send`, { to, subject, body }, {
        withCredentials: true
      });
      toast.success('Email sent successfully');
      setDraft(null);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <Mail className="w-6 h-6 text-red-500" />
                <h1 className="text-2xl font-bold">Gmail Integration</h1>
              </div>
            </div>
            <Button onClick={fetchEmails} disabled={loading} className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="emails" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="emails" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Emails
            </TabsTrigger>
            <TabsTrigger value="draft" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Draft Email
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Emails Tab */}
          <TabsContent value="emails" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Email List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Inbox ({emails.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                      ) : emails.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No emails found
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {emails.map((email) => (
                            <div
                              key={email.id}
                              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedEmail?.id === email.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => setSelectedEmail(email)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-sm line-clamp-1">
                                  {email.subject}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(email.date)}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">
                                From: {email.from}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {email.snippet}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Email Details */}
              <div className="lg:col-span-2">
                {selectedEmail ? (
                  <div className="space-y-6">
                    {/* Email Content */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="mb-2">{selectedEmail.subject}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {selectedEmail.from}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDate(selectedEmail.date)}
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={() => summarizeEmail(selectedEmail)}
                            disabled={summaryLoading}
                            className="flex items-center gap-2"
                          >
                            <Sparkles className="w-4 h-4" />
                            {summaryLoading ? 'Analyzing...' : 'AI Summary'}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <p className="whitespace-pre-wrap">{selectedEmail.body}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* AI Summary */}
                    {emailSummary && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            AI Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Summary</h4>
                            <p className="text-sm text-muted-foreground">{emailSummary.summary}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Key Points</h4>
                              <ul className="space-y-1">
                                {emailSummary.keyPoints.map((point, index) => (
                                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Action Items</h4>
                              <ul className="space-y-1">
                                {emailSummary.actionItems.map((item, index) => (
                                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <Badge className={getSentimentColor(emailSummary.sentiment)}>
                              {emailSummary.sentiment} sentiment
                            </Badge>
                            <Badge className={getPriorityColor(emailSummary.priority)}>
                              {emailSummary.priority} priority
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-[600px] text-muted-foreground">
                      <div className="text-center">
                        <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Select an email to view details</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Draft Email Tab */}
          <TabsContent value="draft" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Generate Email Draft
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="context">Context</Label>
                    <Textarea
                      id="context"
                      placeholder="Describe the context or situation for this email..."
                      value={draftForm.context}
                      onChange={(e) => setDraftForm({ ...draftForm, context: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Email</Label>
                    <Input
                      id="recipient"
                      type="email"
                      placeholder="recipient@example.com"
                      value={draftForm.recipient}
                      onChange={(e) => setDraftForm({ ...draftForm, recipient: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Textarea
                      id="purpose"
                      placeholder="What is the purpose of this email?"
                      value={draftForm.purpose}
                      onChange={(e) => setDraftForm({ ...draftForm, purpose: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select
                      value={draftForm.tone}
                      onValueChange={(value: 'formal' | 'casual' | 'professional') =>
                        setDraftForm({ ...draftForm, tone: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={generateDraft}
                  disabled={draftLoading || !draftForm.context || !draftForm.recipient || !draftForm.purpose}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {draftLoading ? 'Generating...' : 'Generate Draft'}
                </Button>

                {draft && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Generated Draft
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input value={draft.subject} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Body</Label>
                        <Textarea value={draft.body} readOnly rows={8} />
                      </div>
                      {draft.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <Label>Alternative Subjects</Label>
                          <div className="flex flex-wrap gap-2">
                            {draft.suggestions.map((suggestion, index) => (
                              <Badge key={index} variant="outline">
                                {suggestion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => sendEmail(draftForm.recipient, draft.subject, draft.body)}
                          className="flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Send Email
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setDraft(null)}
                        >
                          Clear Draft
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Email Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{emails.length}</div>
                    <div className="text-sm text-muted-foreground">Total Emails</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {emails.filter(email => email.date > new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Last 24 Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {new Set(emails.map(email => email.from)).size}
                    </div>
                    <div className="text-sm text-muted-foreground">Unique Senders</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GmailIntegration;
