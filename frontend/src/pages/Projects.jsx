import { useState, useEffect } from 'react';
import { Search, Plus, FolderKanban, Trash2 } from 'lucide-react';
import Skeleton, { SkeletonProject } from '../components/common/Skeleton';
import CreateProjectModal from '../components/modals/CreateProjectModal';
import { projectsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Projects = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = () => setIsModalOpen(true);

  const handleProjectCreated = () => {
    setIsModalOpen(false);
    fetchProjects();
    toast.success('Project created! 🎉');
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Skeleton variant="title" className="w-32 h-8 mb-1" />
            <Skeleton variant="text" className="w-64 h-4" />
          </div>
          <Skeleton variant="button" className="w-32 h-10" />
        </div>
        <Skeleton variant="text" className="w-full max-w-md h-10" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonProject key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Projects</h1>
          <p className="text-text-secondary text-sm">Every workstream, with live progress and ownership.</p>
        </div>
        <button
          onClick={handleCreateProject}
          className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Project</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-background-card border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="glass-card-hover p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                    {project.description || 'No description'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`status-badge ${
                    project.status === 'Completed' ? 'completed' :
                    project.status === 'Active' ? 'active' : 'planning'
                  }`}>
                    {project.status}
                  </span>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-1 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      {project.tasks_done || 0}/{project.tasks_total || 0} tasks
                    </span>
                    <span className="text-text font-medium">{project.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-text-muted">{project.due_date || 'No due date'}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.priority === 'High' ? 'priority-high' :
                    project.priority === 'Medium' ? 'priority-medium' : 'priority-low'
                  }`}>
                    {project.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FolderKanban className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-text">No projects yet</h3>
            <p className="text-text-secondary mt-2 text-sm">
              Create your first project to start tracking work.
            </p>
            <button
              onClick={handleCreateProject}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Projects;