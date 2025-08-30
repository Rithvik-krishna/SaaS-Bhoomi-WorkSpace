import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Mail, 
  Volume2, 
  MessageSquare,
  Zap,
  ArrowRight,
  Sparkles,
  FileText,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Work Summarization",
    description: "One-click AI summary of emails, docs, presentations, Slack messages, and more.",
    details: [
      "Smart content extraction from multiple sources",
      "Context-aware summarization",
      "Key insights and action items",
      "Multi-format support (text, docs, presentations)"
    ],
    gradient: "from-primary to-primary-glow"
  },
  {
    icon: Mail,
    title: "AI Email Draft Assistant",
    description: "Auto-generates email replies and drafts based on context and tone preferences.",
    details: [
      "Context-aware reply generation",
      "Tone adjustment (formal/casual/urgent)",
      "Smart 'reply all' suggestions",
      "Meeting follow-up automation"
    ],
    gradient: "from-secondary to-accent"
  },
  {
    icon: Volume2,
    title: "Daily & Weekly Digest Generator",
    description: "Automatically creates digests with optional 60-second voice summaries.",
    details: [
      "Automated daily/weekly summaries",
      "Voice digest generation",
      "Meeting & decision tracking",
      "Custom digest scheduling"
    ],
    gradient: "from-accent to-secondary"
  },
  {
    icon: MessageSquare,
    title: "Built-in Chat Assistant",
    description: "Ask questions about your work data and get intelligent responses.",
    details: [
      "Natural language queries",
      "Cross-platform data search",
      "Contextual recommendations",
      "Smart task automation"
    ],
    gradient: "from-primary to-accent"
  }
];

const demoMessages = [
  {
    type: "user",
    content: "Summarize all updates from the design team this week"
  },
  {
    type: "ai",
    content: "📊 **Design Team Weekly Summary**\n\n• 3 new mockups completed for mobile app\n• Brand guidelines updated with new color palette\n• User testing session scheduled for Friday\n• 2 pending reviews on Figma prototypes",
    typing: true
  }
];

export function FeatureShowcase() {
  return (
    <div className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            🎯 Core{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Beyond just summarization — WorkSpaceAi acts as your personal AI chief of staff, 
            drafting responses, creating recaps, and generating insights.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <Card 
                key={feature.title}
                className="bg-surface-elevated border-border/50 hover:border-primary/30 transition-smooth group"
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      v1.0
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-smooth">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-foreground/80">
                        <Sparkles className="w-3 h-3 text-primary mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  
                  <Button variant="outline" size="sm" className="group">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demo Section */}
        <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-semibold">AI Assistant Demo</h3>
            <Badge variant="secondary" className="ml-auto">
              <Clock className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
          
          <div className="space-y-4">
            {demoMessages.map((message, index) => (
              <div 
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-4 rounded-xl ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-surface border border-border/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.type === 'ai' && (
                      <div className="w-5 h-5 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Brain className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="text-xs opacity-75">
                      {message.type === 'user' ? 'You' : 'WorkSpaceAi'}
                    </span>
                    {message.typing && (
                      <span className="typing-cursor text-primary text-xs" />
                    )}
                  </div>
                  
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex items-center justify-center">
            <Button variant="outline" className="w-full max-w-md">
              <MessageSquare className="w-4 h-4 mr-2" />
              Try the AI Assistant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}