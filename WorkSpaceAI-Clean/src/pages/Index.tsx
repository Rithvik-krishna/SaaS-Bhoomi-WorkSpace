import { Hero } from "@/components/Hero";
import { IntegrationGrid } from "@/components/IntegrationGrid";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, User } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const { user, login, logout } = useAuth();

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    
    if (token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        login(userData, token);
        toast.success("Login successful");
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        toast.error("Failed to process login");
      }
    }
  }, [login]);

  // Show toast and scroll to top on login
  const handleAuthSuccess = (user: any, token: string) => {
    login(user, token);
    toast.success("login successful");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        {/* Intro Section */}
        <div className="w-full max-w-md mt-8 mb-8 text-center">
          <div className="flex flex-col items-center gap-4">
            {/* Animated SVG */}
            <svg className="animate-spin h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <h1 className="text-3xl font-bold tracking-tight">WorkSpaceAi</h1>
            <p className="text-primary font-medium">Your Unified Work Summary Agent</p>
            <p className="text-gray-500 text-sm max-w-xs">
              An AI-powered productivity dashboard that centralizes your work emails, documents, presentations, and chats — and auto-generates smart summaries and email drafts — all in one place.
            </p>
          </div>
        </div>
        <div className="w-full max-w-md">
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Logout Button - styled and with user icon */}
      <div className="w-full flex justify-end items-center p-4">
        <div className="flex items-center gap-2 mr-2 text-gray-700 font-medium">
          <User className="w-5 h-5" />
          <span>{user.name}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logout();
            toast.success("Logged out successfully");
          }}
          className="flex items-center gap-1"
        >
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </Button>
      </div>
      <Hero />
      <IntegrationGrid />
      <FeatureShowcase />
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-gray-600">Have questions? We'd love to hear from you.</p>
          </div>
          <ContactForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
