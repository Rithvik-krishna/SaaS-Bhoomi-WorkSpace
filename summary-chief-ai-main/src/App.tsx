import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GmailIntegration from "./pages/GmailIntegration";
import AIChatbot from "./pages/AIChatbot";
import WorkspaceAI from "./pages/WorkspaceAI";
import Dashboard from "./pages/Dashboard";
import GoogleDriveIntegration from "./pages/GoogleDriveIntegration";
import GitHubIntegration from "./pages/GitHubIntegration";
import GitHubCallback from "./pages/GitHubCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gmail" element={<GmailIntegration />} />
          <Route path="/chat" element={<AIChatbot />} />
          <Route path="/workspace-ai" element={<WorkspaceAI />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/google-drive" element={<GoogleDriveIntegration />} />
          <Route path="/github" element={<GitHubIntegration />} />
          <Route path="/github-callback" element={<GitHubCallback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
