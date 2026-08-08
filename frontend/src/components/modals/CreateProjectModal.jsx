import { useState } from 'react';
import { X, Tag, AlertCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateTaskModal = ({ isOpen, onClose }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Todo',
    assignee: '',
    labels: [],
  });

  const [newLabel, setNewLabel] = useState('');

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const statuses = ['Backlog', 'Todo', 'In Progress', 'Review', 'Done'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    toast.success(`Task "${taskData.title}" created successfully! 🎉`);
    console.log('Task Data:', taskData);
    onClose();
  };

  const addLabel = () => {
    if (newLabel.trim() && !taskData.labels.includes(newLabel.trim())) {
      setTaskData({
        ...taskData,
        labels: [...taskData.labels, newLabel.trim()]
      });
      setNewLabel('');
    }
  };

  const removeLabel = (labelToRemove) => {
    setTaskData({
      ...taskData,
      labels: taskData.labels.filter(label => label !== labelToRemove)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-background-card border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text">Create New Task 📋</h2>
            <p className="text-text-secondary text-sm mt-1">Add a task to your project workflow.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Task Title */}
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">
              Task Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) => setTaskData({...taskData, title: e.target.value})}
              placeholder="e.g., Design login page"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">Description</label>
            <textarea
              value={taskData.description}
              onChange={(e) => setTaskData({...taskData, description: e.target.value})}
              placeholder="Describe what needs to be done..."
              rows="3"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text block mb-1.5">Status</label>
              <select
                value={taskData.status}
                onChange={(e) => setTaskData({...taskData, status: e.target.value})}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50 transition-colors"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text block mb-1.5">Priority</label>
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50 transition-colors"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">
              <Users className="w-4 h-4 inline mr-1" />
              Assignee
            </label>
            <input
              type="text"
              value={taskData.assignee}
              onChange={(e) => setTaskData({...taskData, assignee: e.target.value})}
              placeholder="Enter team member name or email"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Labels */}
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">
              <Tag className="w-4 h-4 inline mr-1" />
              Labels
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLabel()}
                placeholder="Add labels (e.g., bug, feature, design)"
                className="flex-1 bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button
                type="button"
                onClick={addLabel}
                className="px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
              >
                Add
              </button>
            </div>
            {taskData.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {taskData.labels.map((label) => (
                  <span
                    key={label}
                    className="flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-text-secondary"
                  >
                    #{label}
                    <button
                      type="button"
                      onClick={() => removeLabel(label)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-background-card border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;