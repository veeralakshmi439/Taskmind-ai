import { useState } from 'react';
import { Search, Calendar, Plus, Mic } from 'lucide-react';
import toast from 'react-hot-toast';
import AudioUploader from '../components/meetings/AudioUploader';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [showAudioUpload, setShowAudioUpload] = useState(false);

  const handleMeetingScheduled = (data) => {
    // Add the new meeting to the list
    const newMeeting = {
      id: meetings.length + 1,
      title: data.title || 'Untitled Meeting',
      agenda: data.agenda || '',
      date: data.date || new Date().toLocaleDateString(),
      time: data.time || '09:00',
      duration: data.duration || '1h',
      participants: data.participants?.length || 0,
      transcript: data.transcript || '',
      action_items: data.action_items || [],
    };
    setMeetings([newMeeting, ...meetings]);
    setShowAudioUpload(false);
  };

  const handleScheduleMeeting = () => {
    setShowAudioUpload(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Meetings</h1>
          <p className="text-text-secondary text-sm">Every conversation, summarised and searchable.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={handleScheduleMeeting}
            className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Mic className="w-4 h-4" />
            <span className="text-sm font-medium">AI Record Meeting</span>
          </button>
          <button 
            onClick={() => toast.success('Opening meeting scheduler...')}
            className="flex items-center gap-2 px-4 py-2 bg-background-card border border-white/10 rounded-lg hover:border-primary/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Schedule Meeting</span>
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search meetings..."
          className="w-full bg-background-card border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* AI Audio Uploader */}
      {showAudioUpload && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-text">🎙️ AI Meeting Recorder</h3>
              <p className="text-text-secondary text-sm">Upload a meeting recording and AI will transcribe & schedule it automatically</p>
            </div>
            <button
              onClick={() => setShowAudioUpload(false)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="text-text-muted">✕</span>
            </button>
          </div>
          <AudioUploader onMeetingScheduled={handleMeetingScheduled} />
        </div>
      )}

      {/* Meetings List */}
      {meetings.length === 0 && !showAudioUpload ? (
        <div className="glass-card p-16 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-text">No meetings scheduled</h3>
            <p className="text-text-secondary mt-2 text-sm">
              Upload a meeting recording or schedule your first meeting.
            </p>
            <div className="flex gap-3 justify-center mt-6 flex-wrap">
              <button 
                onClick={handleScheduleMeeting}
                className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Mic className="w-4 h-4" />
                <span>AI Record Meeting</span>
              </button>
              <button 
                onClick={() => toast.success('Opening meeting scheduler...')}
                className="flex items-center gap-2 px-4 py-2 bg-background-card border border-white/10 rounded-lg hover:border-primary/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Meeting</span>
              </button>
            </div>
          </div>
        </div>
      ) : meetings.length > 0 ? (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="glass-card-hover p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text">{meeting.title}</h3>
                  <p className="text-sm text-text-secondary mt-1">{meeting.agenda}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-text-muted">
                    <span>📅 {meeting.date} · {meeting.time}</span>
                    <span>⏱️ {meeting.duration}</span>
                    <span>👥 {meeting.participants} participants</span>
                    {meeting.transcript && (
                      <span className="text-primary text-xs">🤖 AI Transcribed</span>
                    )}
                  </div>
                  {meeting.action_items && meeting.action_items.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-text-muted">Action Items:</p>
                      <ul className="text-xs text-text-secondary list-disc list-inside">
                        {meeting.action_items.slice(0, 2).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Meetings;