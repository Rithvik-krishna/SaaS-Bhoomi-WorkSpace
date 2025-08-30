import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Mail, 
  FileText, 
  MessageSquare, 
  Calendar,
  Zap,
  ArrowRight,
  Sparkles
} from "lucide-react";

export function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-glow opacity-30" />
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 text-center max-w-6xl mx-auto">
        {/* Status Badge */}
        <Badge variant="secondary" className="mb-8 text-sm font-medium px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          Built for SaaSBoomi Hackathon 2025
        </Badge>
        
        {/* Main Heading */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          WorkSpace
          <span className="text-primary">Ai</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
          📊 Unified Work Summary Agent
        </p>
        
        {/* Description */}
        <p className="text-lg md:text-xl text-foreground/80 mb-12 max-w-4xl mx-auto leading-relaxed">
          An AI-powered productivity dashboard that centralizes work emails, documents, 
          presentations, and chats — and auto-generates smart summaries and email drafts — all in one place.
        </p>
        
        {/* Feature Icons */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {[
            { icon: Mail, label: "Email Summaries" },
            { icon: FileText, label: "Document AI" },
            { icon: MessageSquare, label: "Chat Integration" },
            { icon: Calendar, label: "Meeting Digests" },
            { icon: Brain, label: "AI Assistant" },
            { icon: Zap, label: "Smart Automation" }
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border/50 flex items-center justify-center mb-3 transition-smooth group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/30">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="gradient-primary text-white font-semibold px-8 py-6 rounded-xl ai-glow">
            Launch Dashboard
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <Button variant="outline" size="lg" className="px-8 py-6 rounded-xl border-border/50 hover:border-primary/50">
            View Demo
          </Button>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { value: "10+", label: "Integrations" },
            { value: "60s", label: "Voice Digests" },
            { value: "AI-First", label: "Productivity" }
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{value}</div>
              <div className="text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}