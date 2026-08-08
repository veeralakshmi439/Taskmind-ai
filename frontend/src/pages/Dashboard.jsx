import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, ListChecks, CheckCircle2, Calendar, Plus, Mic, FileAudio } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import QuickActions from '../components/dashboard/QuickActions';
import CreateProjectModal from '../components/modals/CreateProjectModal';
import AudioUploader from '../components/meetings/AudioUploader';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [showAudioUpload, setShowAudioUpload] = useState(false);
  const [recentMeetings, setRecentMeetings] = useState([]);

  const metrics = {
    activeProjects: 0,
    shippingThisMonth: 0,
    openTasks: 0,
    projectStreams: 0,
    completedTasks: 0,
    taskGrowth: '0%',
    upcomingMeetings: 0,
    nextMeeting: 'No meetings scheduled',
  };

  // Quick Actions Handlers
  const handleNewProject = () => {
    setIsProjectModalOpen(true);
  };

  const handleNewTask = () => {
    toast.success('Opening task creator...');
    navigate('/tasks');
  };

  const handleScheduleMeeting = () => {
    setShowAudioUpload(true);
    toast.success('Upload your meeting recording for AI transcription');
  };

  const handleUploadDocument = () => {
    toast.success('Opening file upload...');
    navigate('/documents');
  };

  const handleMeetingScheduled = (data) => {
    const newMeeting = {
      id: Date.now(),
      title: data.title || 'Untitled Meeting',
      date: data.date || new Date().toLocaleDateString(),
      time: data.time || '09:00',
    };
    setRecentMeetings([newMeeting, ...recentMeetings].slice(0, 3));
    toast.success(`Meeting "${newMeeting.title}" scheduled! 🎉`);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card p-8 bg-gradient-to-r from-primary/20 to-primary-light/10 border-primary/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text">Welcome to TaskMind AI 👋</h1>
            <p className="text-text-secondary mt-1">Get started by creating your first project or scheduling a meeting.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button 
              onClick={handleNewProject}
              className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
            <button 
              onClick={handleScheduleMeeting}
              className="flex items-center gap-2 px-4 py-2 bg-accent-blue/20 text-accent-blue border border-accent-blue/30 rounded-lg hover:bg-accent-blue/30 transition-colors"
            >
              <Mic className="w-4 h-4" />
              <span>AI Record Meeting</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Meeting Uploader - Prominent on Dashboard */}
      {showAudioUpload ? (
        <div className="glass-card p-6 border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-text flex items-center gap-2">
                <Mic className="w-5 h-5 text-primary" />
                🎙️ AI Meeting Recorder
              </h3>
              <p className="text-text-secondary text-sm">
                Upload a meeting recording and AI will transcribe & schedule it automatically
              </p>
            </div>
            <button
              onClick={() => setShowAudioUpload(false)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-text-muted"
            >
              ✕
            </button>
          </div>
          <AudioUploader onMeetingScheduled={handleMeetingScheduled} />
        </div>
      ) : (
        <div className="glass-card p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer" onClick={handleScheduleMeeting}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileAudio className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text">🎙️ Upload Meeting Recording</h3>
              <p className="text-text-secondary text-sm">
                Let AI transcribe your meeting and automatically schedule it with all details
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors">
              <Mic className="w-4 h-4" />
              <span>Record Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={FolderKanban}
          label="Active projects"
          value={metrics.activeProjects}
          subtitle="0 shipping this month"
          color="primary"
        />
        <MetricCard
          icon={ListChecks}
          label="Open tasks"
          value={metrics.openTasks}
          subtitle="Across 0 project streams"
          color="blue"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Completed tasks"
          value={metrics.completedTasks}
          subtitle="0% vs last week"
          color="green"
        />
        <MetricCard
          icon={Calendar}
          label="Upcoming meetings"
          value={metrics.upcomingMeetings}
          subtitle="No meetings scheduled"
          color="yellow"
        />
      </div>

      {/* Quick Actions with AI Meeting option */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickActions 
          onNewProject={handleNewProject}
          onNewTask={handleNewTask}
          onScheduleMeeting={handleScheduleMeeting}
          onUploadDocument={handleUploadDocument}
        />
        
        {/* Recent AI Meetings */}
        {recentMeetings.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-text mb-4">Recent AI Scheduled Meetings</h3>
            <div className="space-y-3">
              {recentMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="text-sm text-text font-medium">{meeting.title}</p>
                    <p className="text-xs text-text-muted">{meeting.date} at {meeting.time}</p>
                  </div>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">AI Scheduled</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty State - Get Started */}
      <div className="glass-card p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FolderKanban className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-text">Your workspace is ready</h3>
          <p className="text-text-secondary mt-2 text-sm">
            Start by creating your first project, adding tasks, or uploading a meeting recording.
          </p>
          <div className="flex gap-3 justify-center mt-6 flex-wrap">
            <button 
              onClick={handleNewProject}
              className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
            <button 
              onClick={handleScheduleMeeting}
              className="flex items-center gap-2 px-4 py-2 bg-accent-blue/20 text-accent-blue border border-accent-blue/30 rounded-lg hover:bg-accent-blue/30 transition-colors"
            >
              <Mic className="w-4 h-4" />
              <span>AI Record Meeting</span>
            </button>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <CreateProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;