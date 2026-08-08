import { PlusCircle, ListChecks, Calendar, Upload, Mic } from 'lucide-react';
import toast from 'react-hot-toast';

const QuickActions = ({ onNewProject, onNewTask, onScheduleMeeting, onUploadDocument }) => {
  const actions = [
    { 
      icon: PlusCircle, 
      label: 'New project', 
      color: 'primary',
      action: onNewProject || (() => {
        toast.success('Opening project creator...');
      })
    },
    { 
      icon: ListChecks, 
      label: 'New task', 
      color: 'green',
      action: onNewTask || (() => {
        toast.success('Creating new task...');
      })
    },
    { 
      icon: Mic, 
      label: 'AI Record Meeting', 
      color: 'blue',
      action: onScheduleMeeting || (() => {
        toast.success('Upload your meeting recording...');
      })
    },
    { 
      icon: Upload, 
      label: 'Upload document', 
      color: 'yellow',
      action: onUploadDocument || (() => {
        toast.success('Opening file upload...');
      })
    },
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-text mb-4">Quick actions</h3>
      <div className="flex flex-wrap gap-3">
        {actions.map((action, index) => {
          const colorMap = {
            primary: 'primary',
            green: 'green',
            blue: 'blue',
            yellow: 'yellow',
          };
          const color = colorMap[action.color] || 'primary';
          
          return (
            <button
              key={index}
              onClick={action.action}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-${color}-500/10 hover:bg-${color}-500/20 text-${color}-400 border border-${color}-500/20 transition-all duration-200 cursor-pointer`}
            >
              <action.icon className="w-4 h-4" />
              <span className="text-sm">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;