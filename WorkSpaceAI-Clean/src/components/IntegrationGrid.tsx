import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  FileText, 
  MessageSquare, 
  Calendar,
  Github,
  Trello,
  Slack,
  Chrome,
  Database,
  Briefcase
} from "lucide-react";

const integrations = [
  {
    name: "Gmail",
    icon: Mail,
    description: "Email summaries & draft generation",
    status: "Connected",
    color: "bg-red-500/20 text-red-400 border-red-500/30"
  },
  {
    name: "Google Drive",
    icon: FileText,
    description: "Document processing & analysis",
    status: "Connected",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  },
  {
    name: "Slack",
    icon: Slack,
    description: "Team chat summarization",
    status: "Available",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  },
  {
    name: "Google Calendar",
    icon: Calendar,
    description: "Meeting recaps & scheduling",
    status: "Connected",
    color: "bg-green-500/20 text-green-400 border-green-500/30"
  },
  {
    name: "GitHub",
    icon: Github,
    description: "PR summaries & code reviews",
    status: "Available",
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30"
  },
  {
    name: "Notion",
    icon: Database,
    description: "Knowledge base integration",
    status: "Available",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  },
  {
    name: "Jira",
    icon: Trello,
    description: "Project updates & tickets",
    status: "Available",
    color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
  },
  {
    name: "Microsoft Teams",
    icon: MessageSquare,
    description: "Corporate chat integration",
    status: "Available",
    color: "bg-blue-600/20 text-blue-400 border-blue-600/30"
  },
  {
    name: "Office 365",
    icon: Briefcase,
    description: "Word, Excel, PowerPoint files",
    status: "Available",
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30"
  }
];

export function IntegrationGrid() {
  const navigate = useNavigate();

  const handleIntegrationClick = (integrationName: string) => {
    if (integrationName === "Gmail") {
      navigate('/gmail');
    }
    // Add other integrations as they become available
  };

  return (
    <div className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            🔗 Multi-Tool{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Integration
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect all your work tools in one unified dashboard. Our AI processes content 
            from multiple sources to give you comprehensive summaries and insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            const isConnected = integration.status === "Connected";
            const isClickable = integration.name === "Gmail";
            
            return (
              <Card 
                key={integration.name} 
                className={`integration-card bg-surface-elevated border-border/50 hover:border-primary/30 group ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
                onClick={() => isClickable && handleIntegrationClick(integration.name)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${integration.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <Badge 
                      variant={isConnected ? "default" : "secondary"}
                      className={isConnected ? "bg-success/20 text-success border-success/30" : ""}
                    >
                      {integration.status}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-smooth">
                    {integration.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {integration.description}
                  </p>
                  
                  {isConnected && (
                    <div className="mt-4 flex items-center text-xs text-success">
                      <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                      Syncing data
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-lg">
            + More integrations coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}