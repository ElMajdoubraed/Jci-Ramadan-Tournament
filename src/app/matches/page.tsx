'use client';
import { useState } from 'react';
import MatchList from './matchList';

function Matches() {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');
    const [selectedDate, setSelectedDate] = useState(startDate);
  
    const dates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
  
    return (
      <div>
        <div className="flex overflow-x-auto space-x-4 p-2 bg-amber-100 rounded">
          {dates.map((date) => (
            <button
              key={date.toISOString()}
              className={`px-4 w-full py-2 whitespace-nowrap cursor-pointer ${selectedDate.toDateString() === date.toDateString() ? 'border-b-2 border-sky-500 text-sky-500' : 'text-teal-600 hover:text-amber-600'}`}
              onClick={() => setSelectedDate(date)}
            >
              {date.toDateString()}
            </button>
          ))}
        </div>
        <MatchList date={selectedDate} />
      </div>
    );
  }

  export default Matches;