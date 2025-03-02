'use client';
import { useState } from 'react';
import GroupStage from './groupStage';
import FinalStage from './finaleStage';

function Standings() {
    const [activeStage, setActiveStage] = useState('Group Stage');
    const stages = ['Group Stage', 'Final Stage'];
  
    return (
      <div>
        <div className="flex justify-around p-2 bg-amber-100 rounded">
          {stages.map((stage) => (
            <button
              key={stage}
              className={`px-4 py-2 cursor-pointer ${activeStage === stage ? 'border-b-2 border-sky-500 text-sky-500' : 'text-teal-600 hover:text-amber-600'}`}
              onClick={() => setActiveStage(stage)}
            >
              {stage}
            </button>
          ))}
        </div>
        {activeStage === 'Group Stage' ? <GroupStage /> : <FinalStage />}
      </div>
    );
  }

  export default Standings;