import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Edit2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ScheduleMeetingModal = ({ isOpen, onClose, selectedDate }) => {
  const [isCustomTime, setIsCustomTime] = useState(false);
  
  // Generate time slots
  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const hour = i.toString().padStart(2, '0');
      const min = j.toString().padStart(2, '0');
      timeSlots.push(`${hour}:${min}`);
    }
  }

  // Get default time (current time rounded to nearest 30 min)
  const getDefaultTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(Math.ceil(now.getMinutes() / 30) * 30).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [meetingData, setMeetingData] = useState({
    title: '',
    description: '',
    date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    time: getDefaultTime(),
    customTime: getDefaultTime(),
  });

  // Reset custom time when toggling modes
  useEffect(() => {
    if (isCustomTime) {
      setMeetingData(prev => ({
        ...prev,
        customTime: prev.time
      }));
    }
  }, [isCustomTime]);

  // Update date when selectedDate changes
  useEffect(() => {
    if (selectedDate && isOpen) {
      setMeetingData(prev => ({
        ...prev,
        date: format(selectedDate, 'yyyy-MM-dd')
      }));
    }
  }, [selectedDate, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!meetingData.title.trim()) {
      toast.error('Please enter a meeting title');
      return;
    }

    // Get the final time value
    let finalTime = meetingData.time;
    if (isCustomTime && meetingData.customTime) {
      finalTime = meetingData.customTime;
    }

    // Validate time format
    if (!finalTime || finalTime.length < 4) {
      toast.error('Please enter a valid time (HH:MM)');
      return;
    }

    const dateObj = new Date(meetingData.date);
    toast.success(`Meeting "${meetingData.title}" scheduled for ${format(dateObj, 'MMMM d, yyyy')} at ${finalTime}! 🎉`);
    console.log('Meeting Scheduled:', { ...meetingData, time: finalTime });
    
    // Close and reset
    onClose();
    setTimeout(() => {
      setMeetingData({
        title: '',
        description: '',
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        time: getDefaultTime(),
        customTime: getDefaultTime(),
      });
      setIsCustomTime(false);
    }, 100);
  };

  const handleModalClose = () => {
    onClose();
  };

  const toggleTimeMode = () => {
    setIsCustomTime(!isCustomTime);
  };

  const handleCustomTimeChange = (e) => {
    setMeetingData({
      ...meetingData,
      customTime: e.target.value
    });
  };

  if (!isOpen) return null;

  const displayDate = selectedDate 
    ? format(selectedDate, 'EEEE, MMMM d, yyyy')
    : format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-background-card border border-white/10 rounded-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-text">Schedule Meeting</h2>
            <p className="text-text-secondary text-sm mt-0.5">
              {displayDate}
            </p>
          </div>
          <button 
            onClick={handleModalClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Meeting Title */}
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">
              Meeting Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={meetingData.title}
              onChange={(e) => setMeetingData({...meetingData, title: e.target.value})}
              placeholder="e.g., Weekly sync, Design review, Sprint planning"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
              autoFocus
              required
            />
          </div>

          {/* Description / Notes */}
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">
              Notes / Agenda
            </label>
            <textarea
              value={meetingData.description}
              onChange={(e) => setMeetingData({...meetingData, description: e.target.value})}
              placeholder="What's this meeting about? Add key points..."
              rows="3"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={meetingData.date}
              onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
          </div>

          {/* Time - With toggle for custom input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-text">
                <Clock className="w-4 h-4 inline mr-1" />
                Time <span className="text-red-400">*</span>
              </label>
              <button
                type="button"
                onClick={toggleTimeMode}
                className="text-xs text-primary hover:text-primary-light transition-colors flex items-center gap-1"
              >
                {isCustomTime ? (
                  <>Use preset <ChevronDown className="w-3 h-3" /></>
                ) : (
                  <>Enter custom <Edit2 className="w-3 h-3" /></>
                )}
              </button>
            </div>

            {!isCustomTime ? (
              // Preset time dropdown
              <select
                value={meetingData.time}
                onChange={(e) => setMeetingData({...meetingData, time: e.target.value})}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                required
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            ) : (
              // Custom time input - type="time" for native time picker
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={meetingData.customTime}
                  onChange={handleCustomTimeChange}
                  className="flex-1 bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50 transition-colors"
                  required
                  step="60"
                />
                <span className="text-xs text-text-muted whitespace-nowrap">(HH:MM)</span>
              </div>
            )}
          </div>

          {/* AI Assistant Note */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-xs text-text-secondary">
              <span className="text-primary">🤖 AI will</span> transcribe, summarize, and extract action items from this meeting.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleModalClose}
              className="flex-1 px-4 py-2.5 bg-background-card border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMeetingModal;