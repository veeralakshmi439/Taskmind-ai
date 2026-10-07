import { PlusCircle, ListChecks, Mic, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ onNewProject, onNewTask, onScheduleMeeting, onUploadDocument }) => {
  const navigate = useNavigate();

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
        navigate('/tasks');
      })
    },
    { 
      icon: Mic, 
      label: 'AI Record Meeting', 
      color: 'blue',
      action: onScheduleMeeting || (() => {
        toast.success('Upload your meeting recording...');
        navigate('/meetings');
      })
    },
    { 
      icon: Upload, 
      label: 'Upload document', 
      color: 'yellow',
      action: onUploadDocument || (() => {
        toast.success('Opening file upload...');
        navigate('/documents');
      })
    },
  ];

  return (
    <div className="glass-card p-6 w-full">
      <h3 className="text-sm font-semibold text-text mb-4">Quick actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
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
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-${color}-500/10 hover:bg-${color}-500/20 text-${color}-400 border border-${color}-500/20 transition-all duration-200 cursor-pointer whitespace-nowrap w-full text-sm`}
            >
              <action.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;