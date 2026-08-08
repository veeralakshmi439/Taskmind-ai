const MetricCard = ({ icon: Icon, label, value, subtitle, color }) => {
  const colorMap = {
    primary: 'from-primary to-primary-light',
    blue: 'from-blue-500 to-blue-400',
    green: 'from-green-500 to-green-400',
    yellow: 'from-yellow-500 to-yellow-400',
    red: 'from-red-500 to-red-400',
  };

  return (
    <div className="glass-card-hover p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm">{label}</p>
          <p className={`text-3xl font-bold bg-gradient-to-r ${colorMap[color]} bg-clip-text text-transparent mt-1`}>
            {value}
          </p>
          <p className="text-xs text-text-muted mt-2">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl bg-${color}-500/10`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;