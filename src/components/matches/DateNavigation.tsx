import { ReactNode } from 'react';

interface DateNavigationProps {
  selectedDate: Date;
  startDate: Date;
  endDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  children: ReactNode;
}

export default function DateNavigation({ 
  selectedDate, 
  startDate, 
  endDate, 
  onPrevious, 
  onNext,
  children
}: DateNavigationProps) {
  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <button 
          onClick={onPrevious}
          disabled={selectedDate <= startDate}
          className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm 
            ${selectedDate <= startDate ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-emerald-600 hover:bg-emerald-50'}`}
          aria-label="Jour précédent"
        >
          ←
        </button>
      </div>
      
      {/* DateSelector is passed as children */}
      {children}
      
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <button 
          onClick={onNext}
          disabled={selectedDate >= endDate}
          className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm
            ${selectedDate >= endDate ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-emerald-600 hover:bg-emerald-50'}`}
          aria-label="Jour suivant"
        >
          →
        </button>
      </div>
    </div>
  );
}