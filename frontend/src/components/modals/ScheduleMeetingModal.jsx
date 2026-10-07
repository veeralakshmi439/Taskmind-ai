import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { meetingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ScheduleMeetingModal = ({ isOpen, onClose, onMeetingCreated }) => {
  const [meetingData, setMeetingData] = useState({
    title: '',
    agenda: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: '30m',
    participants: '',
  });

  const [loading, setLoading] = useState(false);

  const durations = ['15m', '30m', '45m', '1h', '1h 30m', '2h'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!meetingData.title.trim()) {
      toast.error('Meeting title is required');
      return;
    }

    setLoading(true);

    try {
      const response = await meetingsAPI.create({
        title: meetingData.title,
        agenda: meetingData.agenda,
        date: meetingData.date,
        time: meetingData.time,
        duration: meetingData.duration,
        participants: meetingData.participants || null,
      });

      if (onMeetingCreated) onMeetingCreated(response.data);

      setMeetingData({
        title: '',
        agenda: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: '30m',
        participants: '',
      });
      onClose();
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-background-card border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text">Schedule Meeting 📅</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5">
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">
              Meeting Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={meetingData.title}
              onChange={(e) => setMeetingData({ ...meetingData, title: e.target.value })}
              placeholder="e.g., Weekly sync"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text block mb-1.5">Agenda</label>
            <textarea
              value={meetingData.agenda}
              onChange={(e) => setMeetingData({ ...meetingData, agenda: e.target.value })}
              placeholder="What's this meeting about?"
              rows="3"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text block mb-1.5">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={meetingData.date}
                onChange={(e) => setMeetingData({ ...meetingData, date: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50"
                style={{ colorScheme: 'dark' }}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text block mb-1.5">
                <Clock className="w-4 h-4 inline mr-1" />
                Time
              </label>
              <input
                type="time"
                value={meetingData.time}
                onChange={(e) => setMeetingData({ ...meetingData, time: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50"
                style={{ colorScheme: 'dark' }}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-text block mb-1.5">Duration</label>
            <select
              value={meetingData.duration}
              onChange={(e) => setMeetingData({ ...meetingData, duration: e.target.value })}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50"
            >
              {durations.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-text block mb-1.5">Participants</label>
            <input
              type="text"
              value={meetingData.participants}
              onChange={(e) => setMeetingData({ ...meetingData, participants: e.target.value })}
              placeholder="emails (comma-separated)"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-background-card border border-white/10 rounded-lg hover:bg-white/5 text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-primary rounded-lg hover:bg-primary-dark font-medium disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMeetingModal;