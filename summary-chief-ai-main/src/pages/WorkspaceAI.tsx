import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Calendar
} from 'lucide-react';

// Import the simplified calendar component
import CalendarMonthView from '@/components/CalendarMonthView';

const WorkspaceAI: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Simple Header */}
      <div className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-md shadow-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-50">Workspace Calendar</h1>
                  <p className="text-sm text-gray-400">AI-powered calendar with Gmail integration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="container mx-auto px-4 py-8">
        <CalendarMonthView />
      </div>
    </div>
  );
};

export default WorkspaceAI;
