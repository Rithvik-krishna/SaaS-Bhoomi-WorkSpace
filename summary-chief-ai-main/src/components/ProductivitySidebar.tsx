import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  Target, 
  Lightbulb,
  Zap,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Plus,
  FileText,
  MessageSquare,
  BarChart3
} from 'lucide-react';

interface ProductivitySidebarProps {
  onQuickAction?: (action: string) => void;
  onViewSuggestion?: (suggestion: any) => void;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: string;
}

interface AISuggestion {
  id: string;
  type: 'deadline' | 'focus' | 'meeting' | 'task';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  time?: string;
  icon: React.ReactNode;
}

const ProductivitySidebar: React.FC<ProductivitySidebarProps> = ({ 
  onQuickAction, 
  onViewSuggestion 
}) => {
  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Schedule Interview',
      description: 'Book interview slots quickly',
      icon: <Users className="w-4 h-4" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: 'schedule-interview'
    },
    {
      id: '2',
      title: 'Summarize Meeting',
      description: 'Generate AI meeting summaries',
      icon: <FileText className="w-4 h-4" />,
      color: 'bg-green-500 hover:bg-green-600',
      action: 'summarize-meeting'
    },
    {
      id: '3',
      title: 'View Free Slots',
      description: 'Check available time slots',
      icon: <Clock className="w-4 h-4" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: 'view-free-slots'
    },
    {
      id: '4',
      title: 'Team Meeting',
      description: 'Schedule team collaboration',
      icon: <Calendar className="w-4 h-4" />,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: 'team-meeting'
    }
  ];

  const aiSuggestions: AISuggestion[] = [
    {
      id: '1',
      type: 'deadline',
      title: 'Project Review Due',
      description: 'Q4 project review presentation is due in 2 days',
      priority: 'high',
      time: '2 days',
      icon: <AlertCircle className="w-4 h-4" />
    },
    {
      id: '2',
      type: 'focus',
      title: 'Deep Work Time',
      description: 'You have 3 hours of uninterrupted time this afternoon',
      priority: 'medium',
      time: 'This afternoon',
      icon: <Target className="w-4 h-4" />
    },
    {
      id: '3',
      type: 'meeting',
      title: 'Follow-up Required',
      description: 'Send follow-up email to client from yesterday\'s meeting',
      priority: 'medium',
      time: 'Today',
      icon: <MessageSquare className="w-4 h-4" />
    },
    {
      id: '4',
      type: 'task',
      title: 'Performance Review',
      description: 'Complete quarterly performance reviews for team members',
      priority: 'low',
      time: 'This week',
      icon: <BarChart3 className="w-4 h-4" />
    }
  ];

  const handleQuickAction = (action: string) => {
    if (onQuickAction) {
      onQuickAction(action);
    }
  };

  const handleViewSuggestion = (suggestion: AISuggestion) => {
    if (onViewSuggestion) {
      onViewSuggestion(suggestion);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'medium':
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <Zap className="w-5 h-5 text-yellow-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                onClick={() => handleQuickAction(action.action)}
                className={`w-full justify-start text-left h-auto p-3 ${action.color} text-white hover:scale-105 transition-transform`}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 mt-0.5">
                    {action.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs opacity-90 mt-1">{action.description}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {aiSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewSuggestion(suggestion)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {suggestion.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {suggestion.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPriorityColor(suggestion.priority)}`}
                      >
                        {getPriorityIcon(suggestion.priority)}
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {suggestion.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{suggestion.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Productivity Stats */}
      <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <TrendingUp className="w-5 h-5 text-green-600" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Meetings Scheduled</span>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                12
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Interviews Completed</span>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                8
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Summaries Generated</span>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                15
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Focus Time</span>
              <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                18h
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Pro Tip</h4>
              <p className="text-sm text-blue-800">
                Use natural language commands in the AI assistant to quickly schedule meetings. 
                Try saying "Schedule an interview with John next week" or "Book a team meeting this Friday".
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductivitySidebar;
