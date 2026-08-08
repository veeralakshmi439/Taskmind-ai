import { Mail } from 'lucide-react';

const MemberCard = ({ member }) => {
  const colorMap = {
    primary: 'from-primary to-primary-light',
    blue: 'from-blue-500 to-blue-400',
    purple: 'from-purple-500 to-purple-400',
    green: 'from-green-500 to-green-400',
    yellow: 'from-yellow-500 to-yellow-400',
    red: 'from-red-500 to-red-400',
  };

  return (
    <div className="glass-card-hover p-5">
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[member.color]} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
          {member.initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-text">{member.name}</h3>
          <p className="text-sm text-text-secondary">{member.role}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
            <Mail className="w-3 h-3" />
            <span>{member.email}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Assigned tasks</span>
          <span className="text-text font-medium">{member.tasks}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-text-secondary">Contribution</span>
          <span className="text-text font-medium">{member.contribution}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full mt-2 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${colorMap[member.color]} rounded-full transition-all duration-500`}
            style={{ width: `${member.contribution}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MemberCard;