import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  X,
  Download,
  Share2,
  Star
} from 'lucide-react';

interface MeetingSummary {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  nextSteps: string[];
}

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: MeetingSummary | null;
  meetingTitle?: string;
  meetingDate?: string;
  onAttachToCalendar?: () => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  summary,
  meetingTitle = 'Meeting Summary',
  meetingDate,
  onAttachToCalendar
}) => {
  if (!isOpen || !summary) return null;

  const handleDownload = () => {
    const content = `
Meeting Summary: ${meetingTitle}
Date: ${meetingDate || new Date().toLocaleDateString()}

Summary:
${summary.summary}

Key Points:
${summary.keyPoints.map(point => `• ${point}`).join('\n')}

Action Items:
${summary.actionItems.map(item => `• ${item}`).join('\n')}

Next Steps:
${summary.nextSteps.map(step => `• ${step}`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${meetingTitle.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Meeting Summary: ${meetingTitle}`,
          text: summary.summary,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const textToCopy = `Meeting Summary: ${meetingTitle}\n\n${summary.summary}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        // You could add a toast notification here
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-gray-200 shadow-2xl rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                {meetingTitle}
              </CardTitle>
              {meetingDate && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{meetingDate}</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* Summary Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900 text-lg">Executive Summary</h3>
              </div>
              <p className="text-blue-800 leading-relaxed">{summary.summary}</p>
            </div>

            <Separator />

            {/* Key Points Section */}
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Key Points Discussed
              </h3>
              <div className="grid gap-3">
                {summary.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-green-800 text-sm leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Action Items Section */}
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-600" />
                Action Items
              </h3>
              <div className="grid gap-3">
                {summary.actionItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-orange-800 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Next Steps Section */}
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-600" />
                Next Steps
              </h3>
              <div className="grid gap-3">
                {summary.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-purple-800 text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                <span className="text-sm font-medium text-indigo-700">AI Insights</span>
              </div>
              <p className="text-indigo-800 text-sm">
                This summary was generated using advanced AI analysis to extract key information, 
                identify action items, and suggest next steps for optimal follow-up.
              </p>
            </div>
          </div>
        </CardContent>

        {/* Action Buttons */}
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex gap-2">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Summary
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            
            <div className="flex gap-3">
              {onAttachToCalendar && (
                <Button
                  onClick={onAttachToCalendar}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Attach to Calendar
                </Button>
              )}
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SummaryModal;
