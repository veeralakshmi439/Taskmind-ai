import { useState } from 'react';
import { Search, Plus, FolderKanban } from 'lucide-react';
import CreateProjectModal from '../components/modals/CreateProjectModal';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = () => {
    setIsModalOpen(true);
  };

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

      {/* Empty State */}
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

      {/* Project Modal */}
      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Projects;