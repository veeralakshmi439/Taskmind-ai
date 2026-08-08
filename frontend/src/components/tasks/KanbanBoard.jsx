import { useState } from 'react';
import TaskCard from './TaskCard';

const columns = [
  { id: 'backlog', title: 'Backlog', color: 'gray' },
  { id: 'todo', title: 'Todo', color: 'blue' },
  { id: 'in-progress', title: 'In Progress', color: 'yellow' },
  { id: 'review', title: 'Review', color: 'purple' },
  { id: 'done', title: 'Done', color: 'green' },
];

const initialTasks = {
  backlog: [
    { id: 1, title: 'Onboarding checklist', description: 'Write the six first-run steps and empty-state messaging.', labels: ['copy'] },
    { id: 2, title: 'Action item extraction schema', description: 'Draft the JSON contract that Phase 2 extraction will populate.', labels: ['schema'] },
  ],
  todo: [
    { id: 3, title: 'Regression suite', description: 'Classify flaky specs and quarantine the worst offenders.', labels: ['low'] },
    { id: 4, title: 'Kanban drag', description: 'Haven, focus and drop-target styling for the task board.', labels: ['low'] },
  ],
  'in-progress': [
    { id: 5, title: 'Sidebar collapse behaviour', description: 'Icon-rail state with keyboard shortcut and persisted...', labels: ['ui', 'navigation'] },
    { id: 6, title: 'Transcript Viewer skeleton', description: 'Speaker-grouped transcript with timestamps and jump-to...', labels: ['low'] },
  ],
  review: [
    { id: 7, title: 'Dark mode token audit', description: 'Check contract ratios for every semantic token pair.', labels: ['a11y', 'design'] },
    { id: 8, title: 'Meeting summary card layout', description: 'Summary, key points and action items in one scannable block.', labels: ['meetings', 'ui'] },
  ],
  done: [
    { id: 9, title: 'Define workspace routing contract', description: 'Document nested layout rules and route naming for the new...', labels: ['architecture'] },
    { id: 10, title: 'Analytics chart', description: 'Align chart colours with the shared token palette.', labels: ['analytics'] },
  ],
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {columns.map((column) => (
        <div key={column.id} className="glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text">{column.title}</h3>
            <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-full">
              {tasks[column.id].length}
            </span>
          </div>
          <div className="space-y-3">
            {tasks[column.id].map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;