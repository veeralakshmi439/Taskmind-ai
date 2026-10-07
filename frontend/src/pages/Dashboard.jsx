import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, ListChecks, CheckCircle2, Calendar, Plus, Mic, FileAudio } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import QuickActions from '../components/dashboard/QuickActions';
import CreateProjectModal from '../components/modals/CreateProjectModal';
import AudioUploader from '../components/meetings/AudioUploader';
import Skeleton, { SkeletonMetric } from '../components/common/Skeleton';
import { projectsAPI, tasksAPI, meetingsAPI } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { setProjects, setTasks, setMeetings } from '../store/projectSlice';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [showAudioUpload, setShowAudioUpload] = useState(false);
  const [metrics, setMetrics] = useState({
    activeProjects: 0,
    totalProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalMeetings: 0,
    upcomingMeetings: 0,
  });

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects, tasks, and meetings in parallel
      const [projectsRes, tasksRes, meetingsRes] = await Promise.allSettled([
        projectsAPI.getAll(),
        tasksAPI.getAll(),
        meetingsAPI.getAll(),
      ]);

      const projects = projectsRes.status === 'fulfilled' ? projectsRes.value.data : [];
      const tasks = tasksRes.status === 'fulfilled' ? tasksRes.value.data : [];
      const meetings = meetingsRes.status === 'fulfilled' ? meetingsRes.value.data : [];

      // Store in Redux
      dispatch(setProjects(projects));
      dispatch(setTasks(tasks));
      dispatch(setMeetings(meetings));

      // Calculate metrics
      const now = new Date();
      const upcoming = meetings.filter(m => {
        if (!m.date) return false;
        const meetingDate = new Date(m.date);
        return meetingDate >= now;
      });

      setMetrics({
        activeProjects: projects.filter(p => p.status === 'Active').length,
        totalProjects: projects.length,
        completedProjects: projects.filter(p => p.status === 'Completed').length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'Done').length,
        totalMeetings: meetings.length,
        upcomingMeetings: upcoming.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNewProject = () => setIsProjectModalOpen(true);

  const handleProjectCreated = () => {
    setIsProjectModalOpen(false);
    fetchData();
    toast.success('Project created! 🎉');
  };

  const handleNewTask = () => {
    navigate('/tasks');
  };

  const handleScheduleMeeting = () => {
    setShowAudioUpload(true);
  };

  const handleUploadDocument = () => {
    navigate('/documents');
  };

  const handleMeetingScheduled = () => {
    fetchData();
    toast.success('Meeting scheduled! 🎉');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-8">
          <Skeleton variant="title" className="w-64 h-8 mb-2" />
          <Skeleton variant="text" className="w-96 h-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <SkeletonMetric key={i} />)}
        </div>
      </div>
    );
  }

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

      {/* AI Meeting Uploader */}
      {showAudioUpload ? (
        <div className="glass-card p-6 border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-text flex items-center gap-2">
                <Mic className="w-5 h-5 text-primary" />
                🎙️ AI Meeting Recorder
              </h3>
              <p className="text-text-secondary text-sm">Upload a meeting recording and AI will transcribe & schedule it</p>
            </div>
            <button onClick={() => setShowAudioUpload(false)} className="p-2 rounded-lg hover:bg-white/5 text-text-muted">✕</button>
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
              <p className="text-text-secondary text-sm">Let AI transcribe your meeting and automatically schedule it</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors">
              <Mic className="w-4 h-4" />
              <span>Record Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Metrics Grid — Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={FolderKanban}
          label="Active projects"
          value={metrics.activeProjects}
          subtitle={`${metrics.totalProjects} total projects`}
          color="primary"
        />
        <MetricCard
          icon={ListChecks}
          label="Open tasks"
          value={metrics.totalTasks - metrics.completedTasks}
          subtitle={`${metrics.totalTasks} total tasks`}
          color="blue"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Completed tasks"
          value={metrics.completedTasks}
          subtitle={`${metrics.completedProjects} projects done`}
          color="green"
        />
        <MetricCard
          icon={Calendar}
          label="Upcoming meetings"
          value={metrics.upcomingMeetings}
          subtitle={`${metrics.totalMeetings} total meetings`}
          color="yellow"
        />
      </div>

      <QuickActions
        onNewProject={handleNewProject}
        onNewTask={handleNewTask}
        onScheduleMeeting={handleScheduleMeeting}
        onUploadDocument={handleUploadDocument}
      />

      {metrics.totalProjects === 0 && metrics.totalTasks === 0 && metrics.totalMeetings === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-text">Your workspace is ready</h3>
            <p className="text-text-secondary mt-2 text-sm">Start by creating your first project, adding tasks, or scheduling a meeting.</p>
            <div className="flex gap-3 justify-center mt-6 flex-wrap">
              <button onClick={handleNewProject} className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors">
                <Plus className="w-4 h-4" />
                <span>Create Project</span>
              </button>
              <button onClick={handleScheduleMeeting} className="flex items-center gap-2 px-4 py-2 bg-accent-blue/20 text-accent-blue border border-accent-blue/30 rounded-lg hover:bg-accent-blue/30 transition-colors">
                <Mic className="w-4 h-4" />
                <span>Schedule Meeting</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Dashboard;