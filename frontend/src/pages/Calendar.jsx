import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import ScheduleMeetingModal from '../components/modals/ScheduleMeetingModal';
import toast from 'react-hot-toast';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Calendar</h1>
          <p className="text-text-secondary text-sm">Plan your meetings and track deadlines.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedDate(new Date());
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Schedule Meeting</span>
        </button>
      </div>

      <div className="glass-card p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-text-secondary" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 rounded-lg text-sm text-text-secondary hover:bg-white/5 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Weekday Headers */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-sm text-text-muted py-2 font-medium">
              {day}
            </div>
          ))}
          
          {/* Days */}
          {days.map((day) => {
            const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);
            
            return (
              <button
                key={day.toString()}
                onClick={() => handleDateClick(day)}
                className={`p-2 rounded-lg text-center transition-all duration-200 min-h-[50px] ${
                  !isCurrentMonth ? 'text-text-muted opacity-50' : ''
                } ${
                  isSelected ? 'bg-primary text-white' : ''
                } ${
                  isTodayDate && !isSelected ? 'bg-primary/20 text-primary border border-primary/30' : ''
                } ${
                  isCurrentMonth && !isSelected ? 'hover:bg-white/5' : ''
                }`}
              >
                <span className="text-sm">{format(day, 'd')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-text">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              <p className="text-sm text-text-muted">Click below to schedule a meeting</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Schedule Meeting</span>
            </button>
          </div>
        </div>
      )}

      {/* No date selected state */}
      {!selectedDate && (
        <div className="glass-card p-8 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text">Select a day</h3>
            <p className="text-text-secondary text-sm mt-1">Pick a date to schedule a meeting.</p>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          // Don't clear selectedDate so user sees the date they picked
        }}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Calendar;