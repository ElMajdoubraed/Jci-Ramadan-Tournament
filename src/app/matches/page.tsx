'use client';
import { useState, useEffect, useRef } from 'react';
import MatchList from './matchList';

function Matches() {
  const startDate = new Date('2025-03-20');
  const endDate = new Date('2025-03-30');

   // Generate dates array
   const dates: Date[] = [];
   for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
     dates.push(new Date(d));
   }
  
  // Initialize with today's date if within range, otherwise use startDate
  const [selectedDate, setSelectedDate] = useState<Date>(startDate);

  // Reference for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Set today's date on mount if within range and scroll to selected date
  useEffect(() => {
    const today = new Date();
    const todayTime = today.setHours(0, 0, 0, 0);
    const startTime = new Date(startDate).setHours(0, 0, 0, 0);
    const endTime = new Date(endDate).setHours(0, 0, 0, 0);
    
    if (todayTime >= startTime && todayTime <= endTime) {
      setSelectedDate(today);
    }
  }, []);
  
  // Scroll to selected date whenever it changes
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    
    // Find the index of the selected date in our array
    const selectedIndex = dates.findIndex(
      date => date.toDateString() === selectedDate.toDateString()
    );
    
    if (selectedIndex === -1) return;
    
    const scrollContainer = scrollContainerRef.current;
    const buttons = Array.from(scrollContainer.querySelectorAll('button'));
    const selectedButton = buttons[selectedIndex];
    
    if (!selectedButton) return;
    
    // Calculate position to center the selected button
    const containerWidth = scrollContainer.clientWidth;
    const buttonWidth = selectedButton.offsetWidth;
    const scrollLeft = selectedButton.offsetLeft - (containerWidth / 2) + (buttonWidth / 2);
    
    // Smooth scroll to the selected date
    scrollContainer.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: 'smooth'
    });
  }, [selectedDate]);
  
  // Format date for display
  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()]
    };
  };

  // Navigation functions
  const goToPrevious = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    if (prevDate >= startDate) setSelectedDate(prevDate);
  };

  const goToNext = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    if (nextDate <= endDate) setSelectedDate(nextDate);
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto px-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h2 className="text-xl font-semibold text-emerald-700">Match Schedule</h2>
        <div className="text-sm text-gray-500">
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <button 
            onClick={goToPrevious}
            disabled={selectedDate <= startDate}
            className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm 
              ${selectedDate <= startDate ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-emerald-600 hover:bg-emerald-50'}`}
            aria-label="Previous day"
          >
            ←
          </button>
        </div>
        
        <div ref={scrollContainerRef} className="flex overflow-x-auto py-3 px-10 bg-gradient-to-r from-emerald-50 to-sky-50 rounded-lg shadow-sm">
          {dates.map((date) => {
            const formattedDate = formatDate(date);
            const isSelected = selectedDate.toDateString() === date.toDateString();
            const todayDate = isToday(date);
            
            return (
              <button
                key={date.toISOString()}
                className={`flex flex-col items-center justify-center min-w-16 h-16 mx-2 p-2 rounded-lg transition-all
                  ${isSelected 
                    ? 'bg-emerald-600 text-white shadow-md transform scale-105' 
                    : todayDate 
                      ? 'bg-amber-100 text-emerald-700 border border-amber-300' 
                      : 'bg-white text-gray-700 hover:bg-emerald-50'}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="text-xs font-medium">{formattedDate.day}</span>
                <span className="text-lg sm:text-xl font-bold">{formattedDate.date}</span>
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
              ${selectedDate >= endDate ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-emerald-600 hover:bg-emerald-50'}`}
            aria-label="Next day"
          >
            →
          </button>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
        <MatchList date={selectedDate} showDate={true} />
      </div>
    </div>
  );
}

export default Matches;