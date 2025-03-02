'use client';

import { useState } from 'react';
import MatchList from "../matches/matchList";

function FinalStage() {
    const stages = ['1/8', 'Quarterfinals', 'Semifinals', 'Final'];
    const [activeFinalStage, setActiveFinalStage] = useState('1/8');
  
    return (
      <div>
        <div className="flex overflow-x-auto space-x-4 p-2 bg-amber-100 rounded scrollbar-hide justify-center justify-items-center">
          {stages.map((stage) => (
            <button
              key={stage}
              className={`px-4 py-2 whitespace-nowrap text-base cursor-pointer ${activeFinalStage === stage ? 'border-b-2 border-sky-500 text-sky-500' : 'text-teal-600 hover:text-amber-600'}`}
              onClick={() => setActiveFinalStage(stage)}
            >
              {stage}
            </button>
          ))}
        </div>
        <MatchList date={new Date()} />
      </div>
    );
  }

export default FinalStage;