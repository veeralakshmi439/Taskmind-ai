import { ArrowRight } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const statusColors = {
    'Completed': 'completed',
    'Active': 'active',
    'Planning': 'planning'
  };

  const priorityColors = {
    'High': 'priority-high',
    'Medium': 'priority-medium',
    'Low': 'priority-low',
    'Urgent': 'priority-high'
  };

  return (
    <div className="glass-card-hover p-5 cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-text-secondary mt-1">{project.description}</p>
        </div>
        <span className={`status-badge ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              {project.tasks.done}/{project.tasks.total} tasks
            </span>
            <span className="text-text font-medium">{project.progress}%</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-text-muted">{project.date}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[project.priority]}`}>
            {project.priority}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
};

export default ProjectCard;