import { useState, useEffect } from 'react';
import { Search, Plus, ListChecks, Trash2 } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';
import CreateTaskModal from '../components/modals/CreateTaskModal';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';

const COLUMNS = ['Backlog', 'Todo', 'In Progress', 'Review', 'Done'];

const Tasks = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = () => setIsModalOpen(true);

  const handleTaskCreated = () => {
    setIsModalOpen(false);
    fetchTasks();
    toast.success('Task created! 🎉');
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksAPI.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Skeleton Loading
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton variant="title" className="w-32 h-8 mb-1" />
            <Skeleton variant="text" className="w-64 h-4" />
          </div>
          <Skeleton variant="button" className="w-32 h-10" />
        </div>
        <Skeleton variant="text" className="w-full max-w-md h-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {COLUMNS.map((column) => (
            <div key={column} className="glass-card p-4">
              <Skeleton variant="text" className="w-24 h-5 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} variant="card" className="h-20" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Tasks</h1>
          <p className="text-text-secondary text-sm">Drag-ready board across every stage of delivery.</p>
        </div>
        <button
          onClick={handleCreateTask}
          className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Task</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search tasks or labels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-background-card border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {COLUMNS.map((column) => {
          const columnTasks = filteredTasks.filter(t => t.status === column);
          return (
            <div key={column} className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text">{column}</h3>
                <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-background-card/50 border border-white/5 rounded-lg p-3 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-text flex-1">{task.title}</h4>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      {task.description && (
                        <p className="text-xs text-text-muted mt-1 line-clamp-2">{task.description}</p>
                      )}
                      {task.labels && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.labels.split(',').map((label, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {label.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full ${
                        task.priority === 'High' ? 'priority-high' :
                        task.priority === 'Medium' ? 'priority-medium' : 'priority-low'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="min-h-[150px] flex items-center justify-center">
                    <div className="text-center">
                      <ListChecks className="w-6 h-6 text-text-muted mx-auto mb-1" />
                      <p className="text-xs text-text-muted">No tasks</p>
                      <button
                        onClick={handleCreateTask}
                        className="text-xs text-primary hover:text-primary-light transition-colors mt-1"
                      >
                        + Add task
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default Tasks;