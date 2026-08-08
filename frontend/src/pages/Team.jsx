import { Users, UserPlus } from 'lucide-react';

const Team = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Team</h1>
          <p className="text-text-secondary text-sm">Who is working on what, and how much capacity is left.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors">
          <UserPlus className="w-4 h-4" />
          <span className="text-sm font-medium">Invite Member</span>
        </button>
      </div>

      {/* Empty State */}
      <div className="glass-card p-16 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-text">No team members yet</h3>
          <p className="text-text-secondary mt-2 text-sm">
            Invite your team members to collaborate on projects.
          </p>
          <button className="mt-6 flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors mx-auto">
            <UserPlus className="w-4 h-4" />
            <span>Invite Member</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Team;