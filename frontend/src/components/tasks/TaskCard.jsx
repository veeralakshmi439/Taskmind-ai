const TaskCard = ({ task }) => {
  return (
    <div className="bg-background-card/50 border border-white/5 rounded-lg p-3 hover:border-primary/30 transition-all duration-200 cursor-pointer">
      <h4 className="text-sm font-medium text-text">{task.title}</h4>
      <p className="text-xs text-text-muted mt-1 line-clamp-2">{task.description}</p>
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.labels.map((label, index) => (
            <span key={index} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;