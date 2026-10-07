import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const OnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '👋 Welcome to TaskMind AI!',
      description: 'Your AI-powered project execution assistant. Let\'s take a quick tour!',
    },
    {
      title: '📊 Dashboard Overview',
      description: 'See your project metrics, tasks, and meetings at a glance.',
    },
    {
      title: '➕ Create Your First Project',
      description: 'Click here to create a project and start tracking work.',
    },
    {
      title: '🎙️ AI Meeting Recorder',
      description: 'Upload meeting recordings and let AI transcribe & schedule them.',
    },
    {
      title: '⚡ Quick Actions',
      description: 'Quickly create projects, tasks, or record meetings from here.',
    },
    {
      title: '🚀 You\'re Ready!',
      description: 'Start by creating your first project or recording a meeting.',
      isLast: true,
    },
  ];

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem('onboardingSeen');
    if (!hasSeenTour) {
      // Show tour after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      handleClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('onboardingSeen', 'true');
  };

  const currentStepData = steps[currentStep];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />

      {/* Tour Card */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
        <div className="glass-card p-6 border-primary/30 shadow-2xl">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index <= currentStep ? 'bg-primary' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-text mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-text-secondary text-sm">
              {currentStepData.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleClose}
              className="text-sm text-text-muted hover:text-text transition-colors"
            >
              Skip tour
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-text-secondary" />
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Get Started</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="mt-4 text-center text-xs text-text-muted">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingTour;