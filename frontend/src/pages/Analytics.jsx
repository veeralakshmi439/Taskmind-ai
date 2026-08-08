import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { BarChart3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Empty data arrays
const taskData = [];
const meetingData = [];
const productivityData = [];
const progressData = [];

const Analytics = () => {
  const navigate = useNavigate();

  const handleCreateProject = () => {
    toast.success('Create a project to see analytics!');
    navigate('/projects');
  };

  // Check if there's any data
  const hasData = taskData.length > 0 || meetingData.length > 0;

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Analytics</h1>
          <p className="text-text-secondary text-sm">How work flows through the workspace.</p>
        </div>

        {/* Empty State */}
        <div className="glass-card p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-text">No data to analyze yet</h3>
            <p className="text-text-secondary mt-2 text-sm">
              Start creating projects and completing tasks to see your analytics dashboard.
            </p>
            <div className="flex gap-3 justify-center mt-6 flex-wrap">
              <button 
                onClick={handleCreateProject}
                className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Project</span>
              </button>
              <button 
                onClick={() => {
                  toast.success('Schedule a meeting to track analytics!');
                  navigate('/meetings');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-background-card border border-white/10 rounded-lg hover:border-primary/30 transition-colors"
              >
                <span>Schedule Meeting</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards (showing 0) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5">
            <p className="text-text-secondary text-sm">Total Projects</p>
            <p className="text-2xl font-bold text-text mt-1">0</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-text-secondary text-sm">Tasks Created</p>
            <p className="text-2xl font-bold text-text mt-1">0</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-text-secondary text-sm">Tasks Completed</p>
            <p className="text-2xl font-bold text-text mt-1">0</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-text-secondary text-sm">Completion Rate</p>
            <p className="text-2xl font-bold text-text mt-1">0%</p>
          </div>
        </div>
      </div>
    );
  }

  // If there's data, show the charts (this part won't run with empty data)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Analytics</h1>
        <p className="text-text-secondary text-sm">How work flows through the workspace.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text mb-2">Task completion</h3>
          <p className="text-xs text-text-muted mb-4">Created vs completed per month</p>
          <div className="h-64 flex items-center justify-center text-text-muted">
            <p>No data available</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text mb-2">Meeting count</h3>
          <p className="text-xs text-text-muted mb-4">Meetings held per month</p>
          <div className="h-64 flex items-center justify-center text-text-muted">
            <p>No data available</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text mb-2">Team productivity</h3>
          <p className="text-xs text-text-muted mb-4">Delivery points per member</p>
          <div className="h-64 flex items-center justify-center text-text-muted">
            <p>No data available</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text mb-2">Project progress</h3>
          <p className="text-xs text-text-muted mb-4">Atlas Platform Revamp vs Meeting Intelligence Beta</p>
          <div className="h-64 flex items-center justify-center text-text-muted">
            <p>No data available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;