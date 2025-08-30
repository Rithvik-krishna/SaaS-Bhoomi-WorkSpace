// src/pages/AIChatbot.tsx

import { AIChatAssistant } from "@/components/AIChatAssistant";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AIChatbot = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Render nothing while redirecting
  }

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/');
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {/* Header (will not grow) */}
      <header className="shrink-0 sticky top-0 z-10 w-full flex justify-between items-center p-4 border-b bg-background/80 backdrop-blur-sm">
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
          <div className="hidden sm:block text-xl font-semibold text-primary">
            WorkSpaceAI Chat
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-medium text-sm">
            <User className="w-5 h-5" />
            <span>{user.name}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1"
          >
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      {/* Main content area (will grow to fill remaining space) */}
      <main className="flex-1 overflow-y-auto">
        <div className="py-6 h-full">
            <AIChatAssistant />
        </div>
      </main>
    </div>
  );
};

export default AIChatbot;