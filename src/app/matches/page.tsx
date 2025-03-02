'use client';
import { useState } from 'react';
import MatchList from './matchList';

function Matches() {
  const startDate = new Date('2024-03-01');
  const endDate = new Date('2024-03-10');
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(startDate);

  const dates = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  
  // Format the date for display
  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()]
    };
  };

  // Navigate to previous date
  const goToPrevious = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    if (prevDate >= startDate) {
      setSelectedDate(prevDate);
    }
  };

  // Navigate to next date
  const goToNext = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    if (nextDate <= endDate) {
      setSelectedDate(nextDate);
    }
  };

  // Check if today's date is within range
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-emerald-700">Match Schedule</h2>
        <div className="text-sm text-gray-500">
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <button 
            onClick={goToPrevious}
            disabled={selectedDate <= startDate}
            className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm 
              ${selectedDate <= startDate 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-emerald-600 hover:bg-emerald-50'}`}
          >
            ←
          </button>
        </div>
        
        <div className="flex overflow-x-auto hide-scrollbar py-2 px-10 bg-gradient-to-r from-emerald-50 to-sky-50 rounded-lg shadow-sm">
          {dates.map((date) => {
            const formattedDate = formatDate(date);
            const isSelected = selectedDate.toDateString() === date.toDateString();
            const today = isToday(date);
            
            return (
              <button
                key={date.toISOString()}
                className={`flex flex-col items-center justify-center min-w-16 h-16 mx-1 rounded-lg transition-all
                  ${isSelected 
                    ? 'bg-emerald-600 text-white shadow-md transform scale-105' 
                    : today 
                      ? 'bg-amber-100 text-emerald-700 border border-amber-300' 
                      : 'bg-white text-gray-700 hover:bg-emerald-50'}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="text-xs font-medium">{formattedDate.day}</span>
                <span className="text-xl font-bold">{formattedDate.date}</span>
                <span className="text-xs">{formattedDate.month}</span>
              </button>
            );
          })}
        </div>
        
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <button 
            onClick={goToNext}
            disabled={selectedDate >= endDate}
            className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm
              ${selectedDate >= endDate 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-emerald-600 hover:bg-emerald-50'}`}
          >
            →
          </button>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
        <MatchList date={selectedDate} />
      </div>
    </div>
  );
}

export default Matches;