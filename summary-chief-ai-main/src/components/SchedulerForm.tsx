import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Plus, 
  X, 
  Send,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface SchedulerFormProps {
  onMeetingScheduled?: (event: any) => void;
  onClose?: () => void;
}

interface FormData {
  title: string;
  description: string;
  participants: string[];
  date: Date | undefined;
  startTime: string;
  endTime: string;
  duration: string;
  meetingType: string;
}

const SchedulerForm: React.FC<SchedulerFormProps> = ({ onMeetingScheduled, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    participants: [],
    date: undefined,
    startTime: '09:00',
    endTime: '10:00',
    duration: '60',
    meetingType: 'meeting'
  });

  const [newParticipant, setNewParticipant] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const API_BASE = 'http://localhost:5001/api';

  const meetingTypes = [
    { value: 'meeting', label: 'Team Meeting' },
    { value: 'interview', label: 'Interview' },
    { value: 'client', label: 'Client Call' },
    { value: 'review', label: 'Review Session' },
    { value: 'planning', label: 'Planning Session' },
    { value: 'other', label: 'Other' }
  ];

  const durationOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' }
  ];

  const handleAddParticipant = () => {
    if (newParticipant.trim() && !formData.participants.includes(newParticipant.trim())) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant.trim()]
      }));
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (participant: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p !== participant)
    }));
  };

  const handleDurationChange = (duration: string) => {
    const startTime = new Date(`2000-01-01T${formData.startTime}`);
    const endTime = new Date(startTime.getTime() + parseInt(duration) * 60000);
    
    setFormData(prev => ({
      ...prev,
      duration,
      endTime: endTime.toTimeString().slice(0, 5)
    }));
  };

  const handleStartTimeChange = (startTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(start.getTime() + parseInt(formData.duration) * 60000);
    
    setFormData(prev => ({
      ...prev,
      startTime,
      endTime: end.toTimeString().slice(0, 5)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Please enter a meeting title');
      return false;
    }
    if (!formData.date) {
      toast.error('Please select a date');
      return false;
    }
    if (formData.participants.length === 0) {
      toast.error('Please add at least one participant');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Create a natural language command for the AI scheduler
      const command = `Schedule a ${formData.meetingType} titled "${formData.title}" with ${formData.participants.join(', ')} on ${format(formData.date!, 'EEEE, MMMM d')} from ${formData.startTime} to ${formData.endTime}. ${formData.description}`;
      
      // Get user_id from localStorage or URL params
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('user_id') || localStorage.getItem('google_user_id');
      
      if (!userId) {
        toast.error('Please connect your Google account first');
        return;
      }

      const response = await axios.post(`${API_BASE}/calendar/schedule-meeting?user_id=${userId}`, {
        command
      }, {
        withCredentials: true
      });

      const event = response.data.data.event;
      
      toast.success('Meeting scheduled successfully!');
      
      if (onMeetingScheduled) {
        onMeetingScheduled(event);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        participants: [],
        date: undefined,
        startTime: '09:00',
        endTime: '10:00',
        duration: '60',
        meetingType: 'meeting'
      });
      
      if (onClose) {
        onClose();
      }
      
    } catch (error: any) {
      console.error('Error scheduling meeting:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSuggestedSlots = () => {
    if (!formData.date) return [];
    
    const slots = [];
    const baseDate = new Date(formData.date);
    
    // Generate suggested time slots
    for (let hour = 9; hour <= 16; hour += 2) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      slots.push({
        startTime,
        endTime,
        label: `${startTime} - ${endTime}`
      });
    }
    
    return slots;
  };

  return (
    <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          Schedule New Meeting
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meeting Type and Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meetingType" className="text-sm font-medium text-gray-700">
                Meeting Type
              </Label>
              <Select
                value={formData.meetingType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, meetingType: value }))}
              >
                <SelectTrigger className="border-gray-200 focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {meetingTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Meeting Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter meeting title"
                className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the purpose of this meeting"
              rows={3}
              className="border-gray-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Date *</Label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-200",
                      !formData.date && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => {
                      setFormData(prev => ({ ...prev, date }));
                      setShowCalendar(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                className="border-gray-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                Duration
              </Label>
              <Select
                value={formData.duration}
                onValueChange={handleDurationChange}
              >
                <SelectTrigger className="border-gray-200 focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* End Time Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>End Time: <span className="font-medium text-gray-900">{formData.endTime}</span></span>
            </div>
          </div>

          {/* Suggested Time Slots */}
          {formData.date && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Suggested Time Slots</Label>
              <div className="flex flex-wrap gap-2">
                {getSuggestedSlots().map((slot, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        startTime: slot.startTime,
                        endTime: slot.endTime
                      }));
                    }}
                    className="border-gray-200 hover:bg-gray-50 text-xs"
                  >
                    {slot.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Participants */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Participants *</Label>
            
            <div className="flex gap-2">
              <Input
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                placeholder="Enter email or name"
                className="flex-1 border-gray-200 focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddParticipant())}
              />
              <Button
                type="button"
                onClick={handleAddParticipant}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {formData.participants.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.participants.map((participant, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {participant}
                    <button
                      type="button"
                      onClick={() => handleRemoveParticipant(participant)}
                      className="ml-2 hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </>
              )}
            </Button>
            
            {onClose && (
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SchedulerForm;
