'use client';
import { useRef, useEffect } from 'react';

interface DateSelectorProps {
  dates: Date[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function DateSelector({ dates, selectedDate, onDateSelect }: DateSelectorProps) {
  // Reference for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to the selected date whenever it changes
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
  }, [selectedDate, dates]);
  
  // Format the date for display
  const formatDate = (date: Date) => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()]
    };
  };

  // Check if the date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  return (
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
            onClick={() => onDateSelect(date)}
          >
            <span className="text-xs font-medium">{formattedDate.day}</span>
            <span className="text-lg sm:text-xl font-bold">{formattedDate.date}</span>
            <span className="text-xs">{formattedDate.month}</span>
          </button>
        );
      })}
    </div>
  );
}