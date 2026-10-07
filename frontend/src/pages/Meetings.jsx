import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Users, Plus, Trash2 } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';
import ScheduleMeetingModal from '../components/modals/ScheduleMeetingModal';
import { meetingsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Meetings = () => {
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await meetingsAPI.getAll();
      setMeetings(response.data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleScheduleMeeting = () => setIsModalOpen(true);

  const handleMeetingCreated = () => {
    setIsModalOpen(false);
    fetchMeetings();
    toast.success('Meeting scheduled! 🎉');
  };

  const handleDeleteMeeting = async (id) => {
    if (!window.confirm('Delete this meeting?')) return;
    try {
      await meetingsAPI.delete(id);
      setMeetings(meetings.filter(m => m.id !== id));
      toast.success('Meeting deleted');
    } catch (error) {
      toast.error('Failed to delete meeting');
    }
  };

  // Helper function to count participants safely
  const getParticipantCount = (participants) => {
    if (!participants) return 0;
    if (Array.isArray(participants)) return participants.length;
    if (typeof participants === 'string') {
      return participants.split(',').filter(p => p.trim()).length;
    }
    return 0;
  };

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton variant="title" className="w-32 h-8 mb-1" />
            <Skeleton variant="text" className="w-64 h-4" />
          </div>
          <Skeleton variant="button" className="w-32 h-10" />
        </div>
        <Skeleton variant="text" className="w-full max-w-md h-10" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} variant="card" className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Meetings</h1>
          <p className="text-text-secondary text-sm">Every conversation, summarised and searchable.</p>
        </div>
        <button
          onClick={handleScheduleMeeting}
          className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Schedule Meeting</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search meetings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-background-card border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {filteredMeetings.length > 0 ? (
        <div className="space-y-4">
          {filteredMeetings.map((meeting) => {
            const participantCount = getParticipantCount(meeting.participants);
            return (
              <div key={meeting.id} className="glass-card-hover p-5 group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text">{meeting.title}</h3>
                    {meeting.agenda && (
                      <p className="text-sm text-text-secondary mt-1">{meeting.agenda}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-text-muted flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {meeting.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {meeting.time} · {meeting.duration}
                      </span>
                      {participantCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {participantCount} participants
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMeeting(meeting.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-16 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-text">No meetings scheduled</h3>
            <p className="text-text-secondary mt-2 text-sm">
              Schedule your first meeting and it will appear here.
            </p>
            <button
              onClick={handleScheduleMeeting}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Meeting</span>
            </button>
          </div>
        </div>
      )}

      <ScheduleMeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMeetingCreated={handleMeetingCreated}
      />
    </div>
  );
};

export default Meetings;