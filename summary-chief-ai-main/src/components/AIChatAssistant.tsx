// src/components/AIChatAssistant.tsx

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, Brain } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

// Add custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: hsl(var(--border));
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--border) / 0.8);
  }
`;

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AIChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm WorkSpaceAI, your intelligent assistant. I can help you with:\n\n• Email summarization and drafting\n• Document analysis and insights\n• Meeting scheduling and reminders\n• Task management and productivity tips\n• General questions and support\n\nHow can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiConnected, setAiConnected] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkAIConnection = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/ai/health');
        setAiConnected(response.data.ai_configured);
      } catch (error) {
        console.error('AI Backend not available:', error);
        setAiConnected(false);
      }
    };
    checkAIConnection();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/ai/chat', {
        message: inputValue,
        context: messages.slice(-10)
      });

      if (response.data.success) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: response.data.response,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error(response.data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting to my AI service right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="container mx-auto px-4 max-w-4xl h-full flex flex-col" style={{
        '--scrollbar-thumb': 'hsl(var(--border))',
        '--scrollbar-track': 'transparent'
      } as React.CSSProperties}>
      <div className="shrink-0 flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
                <h1 className="text-xl font-semibold">AI Assistant</h1>
                <p className="text-sm text-muted-foreground">Your intelligent productivity assistant</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant={aiConnected ? "default" : "destructive"}>
                <div className={`w-2 h-2 rounded-full mr-2 ${aiConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                {aiConnected ? 'AI Connected' : 'AI Offline'}
            </Badge>
            <Badge variant="secondary">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
            </Badge>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 flex flex-col p-0">
          
          {/* Messages Area with Scrollbar */}
          <ScrollArea className="flex-1 p-6 custom-scrollbar" style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: 'hsl(var(--border)) transparent',
            overflowY: 'auto'
          }}>
            <div className="space-y-6 pr-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="shrink-0 border-t p-4 bg-background/80 backdrop-blur-sm">
             <div className="flex gap-3">
               <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={aiConnected ? "Ask me anything..." : "AI is not connected."}
                  className="flex-1"
                  disabled={isLoading || !aiConnected}
                  autoFocus
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading || !aiConnected} size="icon" className="shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
             </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {[ "Help me draft an email", "Summarize my documents", "Schedule a meeting", "Create a task list" ].map((suggestion) => (
                <Button key={suggestion} variant="outline" size="sm" onClick={() => handleSuggestionClick(suggestion)} disabled={isLoading || !aiConnected} className="text-xs">
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}