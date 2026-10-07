import { useState } from 'react';
import { X } from 'lucide-react';
import { tasksAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    labels: '',
    due_date: '',
  });

  const [loading, setLoading] = useState(false);

  const statuses = ['Backlog', 'Todo', 'In Progress', 'Review', 'Done'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setLoading(true);

    try {
      const response = await tasksAPI.create({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        labels: taskData.labels || null,
        due_date: taskData.due_date || null,
      });

      if (onTaskCreated) onTaskCreated(response.data);

      setTaskData({
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        labels: '',
        due_date: '',
      });
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-background-card border border-white/10 rounded-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text">Create New Task 📋</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5">
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">
              Task Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              placeholder="e.g., Design login page"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text block mb-1.5">Description</label>
            <textarea
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              placeholder="What needs to be done?"
              rows="3"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text block mb-1.5">Status</label>
              <select
                value={taskData.status}
                onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text block mb-1.5">Priority</label>
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50"
              >
                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-text block mb-1.5">Labels</label>
            <input
              type="text"
              value={taskData.labels}
              onChange={(e) => setTaskData({ ...taskData, labels: e.target.value })}
              placeholder="e.g., bug, feature, design (comma-separated)"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text block mb-1.5">Due Date</label>
            <input
              type="date"
              value={taskData.due_date}
              onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-background-card border border-white/10 rounded-lg hover:bg-white/5 text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-primary rounded-lg hover:bg-primary-dark font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;