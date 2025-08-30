import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  Heart,
  Zap,
  Calendar,
  Trophy
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-16 px-4 border-t border-border/50">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-glow opacity-10" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* CTA Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Trophy className="w-4 h-4 mr-2" />
            SaasBoomi Hackathon 2025
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Transform
            </span>{" "}
            Your Workflow?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the future of AI-powered productivity. Get started with WorkSpaceAi today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-primary text-white font-semibold px-8 py-6 rounded-xl ai-glow">
              <Zap className="w-5 h-5 mr-2" />
              Launch Dashboard
            </Button>
            
            <Button variant="outline" size="lg" className="px-8 py-6 rounded-xl border-border/50">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>
        
        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">WorkSpaceAi</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Unified AI productivity platform for the modern workplace. 
              Built for teams who want to work smarter, not harder.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>AI Summarization</li>
              <li>Email Drafting</li>
              <li>Voice Digests</li>
              <li>Chat Assistant</li>
              <li>Multi-Tool Integration</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Integrations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Gmail & Outlook</li>
              <li>Google Drive</li>
              <li>Slack & Teams</li>
              <li>Notion & Jira</li>
              <li>GitHub & More</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Connect</h4>
            <div className="flex flex-col gap-3">
              <Button variant="ghost" size="sm" className="justify-start p-0 h-auto text-muted-foreground hover:text-primary">
                <Github className="w-4 h-4 mr-2" />
                GitHub Repository
              </Button>
              <Button variant="ghost" size="sm" className="justify-start p-0 h-auto text-muted-foreground hover:text-primary">
                <Mail className="w-4 h-4 mr-2" />
                Contact Team
              </Button>
              <Button variant="ghost" size="sm" className="justify-start p-0 h-auto text-muted-foreground hover:text-primary">
                <Twitter className="w-4 h-4 mr-2" />
                Follow Updates
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 md:mb-0">
            <span>for the SaaSBoomi Hackathon 2025</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">Team WorkSpaceAi</span>
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tech Stack */}
        <div className="mt-8 pt-8 border-t border-border/20">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">Powered by</p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <span>React + Vite + Tailwind</span>
              <span>•</span>
              <span>OpenAI GPT-4</span>
              <span>•</span>
              <span>ShadCN UI</span>
              <span>•</span>
              <span>OAuth 2.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}