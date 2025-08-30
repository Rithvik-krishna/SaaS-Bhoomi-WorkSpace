import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Meh
} from 'lucide-react';
import axios from 'axios';

// --- Interfaces and Constants ---
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

const API_BASE = 'http://localhost:5001/api';

// --- Reusable Components ---
const EmailList = ({ emails, selectedEmail, setSelectedEmail, loading }) => (
  <Card className="bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        <Mail className="w-5 h-5 text-purple-400" />
        Inbox ({emails.length})
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[600px] pr-4">
        {loading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-20 w-full rounded-lg bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : emails.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No emails found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {emails.map((email) => (
              <div
                key={email.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedEmail?.id === email.id
                    ? 'border-purple-500 bg-purple-900/40 shadow-lg'
                    : 'border-gray-800 hover:border-purple-600 hover:bg-gray-800'
                }`}
                onClick={() => setSelectedEmail(email)}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm line-clamp-1">{email.subject}</h4>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatDate(email.date)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-1 line-clamp-1">
                  From: <span className="font-medium text-gray-200">{email.from}</span>
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {email.snippet}
                </p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </CardContent>
  </Card>
);

const EmailDetails = ({ email, summary, summaryLoading, onSummarize }) => (
  <div className="space-y-6">
    <Card className="bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="mb-1 text-2xl font-bold">{email.subject}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {email.from}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(email.date)}
              </span>
            </div>
          </div>
          <Button
            onClick={() => onSummarize(email)}
            disabled={summaryLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600 transition-all font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            {summaryLoading ? 'Analyzing...' : 'AI Summary'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Separator className="mb-4 bg-gray-700" />
        <div className="prose prose-invert max-w-none text-gray-300">
          <p className="whitespace-pre-wrap leading-relaxed">{email.body}</p>
        </div>
      </CardContent>
    </Card>

    {summary && (
      <Card className="bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-purple-400">
            <Sparkles className="w-5 h-5" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-bold text-base text-purple-300">Summary</h4>
            <p className="text-sm text-gray-400 leading-snug">{summary.summary}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-base text-purple-300">Key Points</h4>
              <ul className="space-y-2">
                {summary.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-base text-purple-300">Action Items</h4>
              <ul className="space-y-2">
                {summary.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge 
              className={`flex items-center gap-1 ${getSentimentColor(summary.sentiment)} text-xs px-3 py-1 rounded-full font-medium`}
            >
              {getSentimentIcon(summary.sentiment)}
              {summary.sentiment} sentiment
            </Badge>
            <Badge 
              className={`flex items-center gap-1 ${getPriorityColor(summary.priority)} text-xs px-3 py-1 rounded-full font-medium`}
            >
              <AlertCircle className="w-3 h-3" />
              {summary.priority} priority
            </Badge>
          </div>
        </CardContent>
      </Card>
    )}
  </div>
);

const DraftGenerator = ({ draft, draftForm, setDraftForm, onGenerate, onSend, onClear, loading }) => (
  <Card className="bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        <FileText className="w-5 h-5 text-cyan-400" />
        Generate Email Draft
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="recipient" className="font-semibold text-sm">Recipient Email</Label>
          <Input
            id="recipient"
            type="email"
            placeholder="recipient@example.com"
            value={draftForm.recipient}
            onChange={(e) => setDraftForm({ ...draftForm, recipient: e.target.value })}
            className="bg-gray-800 border-gray-700 text-gray-100 focus-visible:ring-purple-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tone" className="font-semibold text-sm">Tone</Label>
          <Select
            value={draftForm.tone}
            onValueChange={(value) => setDraftForm({ ...draftForm, tone: value })}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 focus-visible:ring-purple-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="purpose" className="font-semibold text-sm">Purpose</Label>
        <Textarea
          id="purpose"
          placeholder="What is the purpose of this email?"
          value={draftForm.purpose}
          onChange={(e) => setDraftForm({ ...draftForm, purpose: e.target.value })}
          rows={3}
          className="bg-gray-800 border-gray-700 text-gray-100 focus-visible:ring-purple-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="context" className="font-semibold text-sm">Context</Label>
        <Textarea
          id="context"
          placeholder="Provide any additional details or context needed for the email"
          value={draftForm.context}
          onChange={(e) => setDraftForm({ ...draftForm, context: e.target.value })}
          rows={4}
          className="bg-gray-800 border-gray-700 text-gray-100 focus-visible:ring-purple-500"
        />
      </div>
      <Button
        onClick={onGenerate}
        disabled={loading || !draftForm.context || !draftForm.recipient || !draftForm.purpose}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600 transition-all w-full md:w-auto font-semibold"
      >
        <Sparkles className="w-4 h-4" />
        {loading ? 'Generating...' : 'Generate Draft'}
      </Button>

      {draft && (
        <Card className="mt-6 border-purple-500 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-purple-400">
              <MessageSquare className="w-5 h-5" />
              Generated Draft
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-semibold text-sm">Subject</Label>
              <Input value={draft.subject} readOnly className="bg-gray-800 border-gray-700 text-gray-100" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-sm">Body</Label>
              <Textarea value={draft.body} readOnly rows={8} className="bg-gray-800 border-gray-700 text-gray-100" />
            </div>
            {draft.suggestions.length > 0 && (
              <div className="space-y-2">
                <Label className="font-semibold text-sm">Alternative Subjects</Label>
                <div className="flex flex-wrap gap-2">
                  {draft.suggestions.map((suggestion, index) => (
                    <Badge key={index} variant="outline" className="bg-purple-900/40 text-purple-400 border-purple-800 font-medium">
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => sendEmail(draftForm.recipient, draft.subject, draft.body)}
                className="flex-1 md:flex-none flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold"
              >
                <Send className="w-4 h-4" />
                Send Email
              </Button>
              <Button
                variant="outline"
                onClick={onClear}
                className="flex-1 md:flex-none border-red-500 text-red-500 hover:bg-red-900/40 hover:text-red-400 font-medium"
              >
                Clear Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </CardContent>
  </Card>
);

const AnalyticsDashboard = ({ emails }) => {
  const totalEmails = emails.length;
  const emailsLast24Hours = emails.filter(email => new Date(email.date).getTime() > Date.now() - 24 * 60 * 60 * 1000).length;
  const uniqueSenders = new Set(emails.map(email => email.from)).size;

  const statCardClasses = "text-center p-6 rounded-lg bg-gray-900 border border-gray-800";

  return (
    <Card className="bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-cyan-400">
          <TrendingUp className="w-5 h-5" />
          Email Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className={statCardClasses}>
            <div className="text-5xl font-bold text-purple-500">{totalEmails}</div>
            <div className="text-sm text-gray-400 mt-2">Total Emails</div>
          </div>
          <div className={statCardClasses}>
            <div className="text-5xl font-bold text-cyan-500">{emailsLast24Hours}</div>
            <div className="text-sm text-gray-400 mt-2">Last 24 Hours</div>
          </div>
          <div className={statCardClasses}>
            <div className="text-5xl font-bold text-purple-500">{uniqueSenders}</div>
            <div className="text-sm text-gray-400 mt-2">Unique Senders</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Helper Functions ---
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
    case 'positive': return 'bg-green-900 text-green-400 border-green-700';
    case 'negative': return 'bg-red-900 text-red-400 border-red-700';
    default: return 'bg-gray-800 text-gray-400 border-gray-700';
  }
};

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case 'positive': return <ThumbsUp className="w-3 h-3" />;
    case 'negative': return <ThumbsDown className="w-3 h-3" />;
    default: return <Meh className="w-3 h-3" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-900 text-red-400 border-red-700';
    case 'medium': return 'bg-yellow-900 text-yellow-400 border-yellow-700';
    default: return 'bg-green-900 text-green-400 border-green-700';
  }
};

// --- Main Component ---
const GmailIntegration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
    tone: 'professional'
  });

  const emailDetailRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchEmails();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedEmail) {
      setEmailSummary(null);
      if (emailDetailRef.current) {
        emailDetailRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedEmail]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      // Get user_id from localStorage or URL params
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('user_id') || localStorage.getItem('google_user_id');
      
      if (!userId) {
        toast.error('Please connect your Google account first');
        return;
      }

      const response = await axios.get(`${API_BASE}/gmail/emails?maxResults=20&user_id=${userId}`, {
        withCredentials: true
      });
      setEmails(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedEmail(response.data.data[0]);
      }
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
      const userId = new URLSearchParams(window.location.search).get('user_id') || localStorage.getItem('google_user_id');
      
      if (!userId) {
        toast.error('Please connect your Google account first');
        return;
      }

      const response = await axios.post(`${API_BASE}/gmail/emails/${email.id}/summarize?user_id=${userId}`, {}, {
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
      const userId = new URLSearchParams(window.location.search).get('user_id') || localStorage.getItem('google_user_id');
      
      if (!userId) {
        toast.error('Please connect your Google account first');
        return;
      }

      const response = await axios.post(`${API_BASE}/gmail/draft?user_id=${userId}`, draftForm, {
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
      const userId = new URLSearchParams(window.location.search).get('user_id') || localStorage.getItem('google_user_id');
      
      if (!userId) {
        toast.error('Please connect your Google account first');
        return;
      }

      await axios.post(`${API_BASE}/gmail/send?user_id=${userId}`, { to, subject, body }, {
        withCredentials: true
      });
      toast.success('Email sent successfully');
      setDraft(null);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  const handleBackNavigation = () => {
    navigate('/dashboard');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
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
              <div className="flex items-center gap-2">
                <Mail className="w-7 h-7 text-purple-500" />
                <h1 className="text-2xl font-bold text-gray-50">Gmail Integration</h1>
              </div>
            </div>
            <Button onClick={fetchEmails} disabled={loading} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600 transition-all font-semibold">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="emails" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-gray-800 p-1 rounded-lg shadow-xl">
            <TabsTrigger value="emails" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-colors rounded-lg py-2 text-gray-400 hover:text-gray-100">
              <Mail className="w-4 h-4" />
              Emails
            </TabsTrigger>
            <TabsTrigger value="draft" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-colors rounded-lg py-2 text-gray-400 hover:text-gray-100">
              <FileText className="w-4 h-4" />
              Draft Email
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-colors rounded-lg py-2 text-gray-400 hover:text-gray-100">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Emails Tab */}
          <TabsContent value="emails" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <EmailList
                  emails={emails}
                  selectedEmail={selectedEmail}
                  setSelectedEmail={setSelectedEmail}
                  loading={loading}
                />
              </div>
              <div ref={emailDetailRef} className="lg:col-span-2">
                {selectedEmail ? (
                  <EmailDetails
                    email={selectedEmail}
                    summary={emailSummary}
                    summaryLoading={summaryLoading}
                    onSummarize={summarizeEmail}
                  />
                ) : (
                  <Card className="bg-gray-900 border-gray-800 text-gray-100 shadow-xl h-[680px]">
                    <CardContent className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Mail className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <p className="text-lg font-medium">Select an email to view details</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Draft Email Tab */}
          <TabsContent value="draft" className="space-y-6">
            <DraftGenerator
              draft={draft}
              draftForm={draftForm}
              setDraftForm={setDraftForm}
              onGenerate={generateDraft}
              onSend={sendEmail}
              onClear={() => setDraft(null)}
              loading={draftLoading}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard emails={emails} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GmailIntegration;