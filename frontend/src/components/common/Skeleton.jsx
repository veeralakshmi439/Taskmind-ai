import React from 'react';

const Skeleton = ({ className = '', variant = 'text' }) => {
  const baseClasses = 'animate-pulse bg-white/5 rounded';
  
  const variants = {
    text: 'h-4 w-full',
    title: 'h-8 w-48',
    heading: 'h-6 w-32',
    card: 'h-32 w-full rounded-xl',
    metric: 'h-20 w-full rounded-xl',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded-lg',
    chart: 'h-48 w-full rounded-xl',
    project: 'h-40 w-full rounded-xl',
    task: 'h-16 w-full rounded-lg',
  };

  return (
    <div className={`${baseClasses} ${variants[variant] || variants.text} ${className}`}>
      <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] animate-shimmer" />
    </div>
  );
};

export const SkeletonCard = ({ children, className = '' }) => (
  <div className={`glass-card p-5 ${className}`}>
    {children}
  </div>
);

export const SkeletonMetric = () => (
  <SkeletonCard>
    <Skeleton variant="text" className="w-24 h-3 mb-2" />
    <Skeleton variant="title" className="w-16 h-8 mb-1" />
    <Skeleton variant="text" className="w-32 h-3" />
  </SkeletonCard>
);

export const SkeletonProject = () => (
  <SkeletonCard>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <Skeleton variant="title" className="w-3/4 h-6 mb-2" />
        <Skeleton variant="text" className="w-full h-4 mb-1" />
        <Skeleton variant="text" className="w-2/3 h-4" />
      </div>
      <Skeleton variant="button" className="w-20 h-6" />
    </div>
    <div className="mt-4">
      <Skeleton variant="text" className="w-full h-2" />
    </div>
  </SkeletonCard>
);

export const SkeletonTask = () => (
  <div className="bg-background-card/50 border border-white/5 rounded-lg p-3">
    <Skeleton variant="title" className="w-3/4 h-4 mb-2" />
    <Skeleton variant="text" className="w-full h-3 mb-1" />
    <Skeleton variant="text" className="w-2/3 h-3" />
  </div>
);

export const SkeletonMeeting = () => (
  <SkeletonCard>
    <Skeleton variant="title" className="w-1/2 h-5 mb-2" />
    <Skeleton variant="text" className="w-full h-4 mb-1" />
    <Skeleton variant="text" className="w-3/4 h-4 mb-3" />
    <div className="flex gap-4">
      <Skeleton variant="text" className="w-20 h-3" />
      <Skeleton variant="text" className="w-20 h-3" />
      <Skeleton variant="text" className="w-20 h-3" />
    </div>
  </SkeletonCard>
);

export const SkeletonTeam = () => (
  <SkeletonCard>
    <div className="flex items-center gap-4">
      <Skeleton variant="avatar" className="w-14 h-14" />
      <div className="flex-1">
        <Skeleton variant="title" className="w-32 h-5 mb-1" />
        <Skeleton variant="text" className="w-24 h-3 mb-1" />
        <Skeleton variant="text" className="w-40 h-3" />
      </div>
    </div>
    <div className="mt-4">
      <Skeleton variant="text" className="w-full h-2" />
    </div>
  </SkeletonCard>
);

export default Skeleton;