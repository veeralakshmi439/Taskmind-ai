import { useState } from 'react';
import { Search, Plus, ListChecks } from 'lucide-react';

const Tasks = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Tasks</h1>
          <p className="text-text-secondary text-sm">Drag-ready board across every stage of delivery.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Task</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search tasks or labels..."
          className="w-full bg-background-card border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Empty State - Kanban Board with empty columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {['Backlog', 'Todo', 'In Progress', 'Review', 'Done'].map((column) => (
          <div key={column} className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text">{column}</h3>
              <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-full">0</span>
            </div>
            <div className="min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2">
                  <ListChecks className="w-6 h-6 text-text-muted" />
                </div>
                <p className="text-xs text-text-muted">No tasks</p>
                <button className="text-xs text-primary hover:text-primary-light transition-colors mt-2">
                  + Add task
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;