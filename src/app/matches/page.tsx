'use client';
import { useState } from 'react';
import { DateSelector, DateNavigation } from '@/components/matches';
import MatchList from '@/components/matches/MatchList';

export default function Matches() {
  const startDate = new Date('2025-03-21');
  const endDate = new Date('2025-03-30');

  // Generate date array
  const dates: Date[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  
  // Initialize with today's date if in range, otherwise use startDate
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto px-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h2 className="text-xl font-semibold text-emerald-700">Calendrier des Matchs</h2>
        <div className="text-sm text-gray-500">
          {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      <DateNavigation 
        selectedDate={selectedDate}
        startDate={startDate}
        endDate={endDate}
        onPrevious={goToPrevious}
        onNext={goToNext}
      >
        <DateSelector 
          dates={dates}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </DateNavigation>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
        <MatchList date={selectedDate} showDate={true} />
      </div>
    </div>
  );
}