import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If on dashboard, don't show breadcrumbs
  if (pathnames.length === 0) {
    return null;
  }

  // Map routes to display names
  const routeNames = {
    projects: 'Projects',
    tasks: 'Tasks',
    meetings: 'Meetings',
    calendar: 'Calendar',
    team: 'Team',
    'ai-assistant': 'AI Assistant',
    documents: 'Documents',
    analytics: 'Analytics',
    settings: 'Settings',
  };

  return (
    <nav className="flex items-center gap-1 text-sm text-text-muted mb-4">
      <Link 
        to="/" 
        className="flex items-center gap-1 hover:text-text transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNames[name] || name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-4 h-4" />
            {isLast ? (
              <span className="text-text font-medium">{displayName}</span>
            ) : (
              <Link 
                to={routeTo} 
                className="hover:text-text transition-colors"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;