import { Clock, User, MessageSquare, CheckCircle, FileText } from 'lucide-react';

const activities = [
  {
    user: 'Priya Raman',
    action: 'moved Transcript viewer to In Progress',
    time: '8m ago',
    icon: User,
    color: 'blue'
  },
  {
    user: 'System',
    action: 'Beta launch readiness starts in 2 days',
    time: '1h ago',
    icon: Clock,
    color: 'yellow'
  },
  {
    user: 'Diego Salas',
    action: 'commented on Dark mode token audit',
    time: 'yesterday',
    icon: MessageSquare,
    color: 'purple'
  }
];

const RecentActivity = () => {
  return (
    <div>
      <h4 className="text-sm font-semibold text-text mb-4">Recent Activity</h4>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full bg-${activity.color}-500/20 flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <activity.icon className={`w-4 h-4 text-${activity.color}-400`} />
            </div>
            <div>
              <p className="text-sm text-text">
                <span className="font-medium">{activity.user}</span>
                <span className="text-text-secondary"> {activity.action}</span>
              </p>
              <p className="text-xs text-text-muted mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="glass-card p-4">
          <p className="text-sm text-text-secondary">Today's tasks</p>
          <p className="text-xs text-text-muted">Nothing due today.</p>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;