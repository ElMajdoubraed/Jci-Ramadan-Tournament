'use client';

import { useState } from 'react';
import MatchList from "../matches/matchList";

function FinalStage() {
  const stages = [
    { id: '1/8', name: '1/8 Finals', emoji: '🏁' },
    { id: 'Quarterfinals', name: 'Quarter Finals', emoji: '🔥' },
    { id: 'Semifinals', name: 'Semi Finals', emoji: '⚡' },
    { id: 'Final', name: 'Final', emoji: '🏆' }
  ];
  
  const [activeFinalStage, setActiveFinalStage] = useState('1/8');
  
  // Function to determine if a stage is completed
  const isStageCompleted = (stageId: string) => {
    const stageOrder = stages.findIndex(s => s.id === stageId);
    const activeStageOrder = stages.findIndex(s => s.id === activeFinalStage);
    return stageOrder < activeStageOrder;
  };
  
  // Function to determine if a stage is next (for visual indication)
  const isStageNext = (stageId: string) => {
    const stageOrder = stages.findIndex(s => s.id === stageId);
    const activeStageOrder = stages.findIndex(s => s.id === activeFinalStage);
    return stageOrder === activeStageOrder + 1;
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto px-3">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-4 rounded-lg text-white shadow-md">
        <h2 className="text-lg sm:text-xl font-bold text-center mb-2">Tournament Knockout Stages</h2>
        <p className="text-emerald-100 text-xs sm:text-sm text-center mb-4">Follow the journey to the championship</p>
        
        <div className="relative px-2 pb-2 mt-5">
          {/* Progress bar */}
          <div className="absolute top-1/2 left-0 h-1 bg-emerald-300 bg-opacity-30 w-full -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-white w-1/4 -translate-y-1/2 rounded-full transition-all duration-500"
            style={{ 
              width: `${(stages.findIndex(s => s.id === activeFinalStage) / (stages.length - 1)) * 100}%` 
            }}
          ></div>
          
          {/* Stage buttons - mobile scrollable version */}
          <div className="flex justify-between relative z-10 sm:hidden overflow-x-auto pb-3 gap-2 hide-scrollbar">
            {stages.map((stage, index) => {
              const isActive = activeFinalStage === stage.id;
              const isCompleted = isStageCompleted(stage.id);
              const isNext = isStageNext(stage.id);
              
              return (
                <div key={stage.id} className="flex flex-col items-center min-w-16">
                  <button
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all duration-300
                      ${isActive 
                        ? 'bg-white text-emerald-700 shadow-lg scale-110' 
                        : isCompleted
                          ? 'bg-emerald-200 text-emerald-800'
                          : isNext
                            ? 'bg-emerald-500 text-white border-2 border-white border-opacity-50'
                            : 'bg-emerald-600 text-emerald-200'}`}
                    onClick={() => setActiveFinalStage(stage.id)}
                  >
                    {isCompleted ? '✓' : stage.emoji}
                  </button>
                  <span className={`text-2xs sm:text-xs font-medium text-center ${isActive ? 'text-white' : 'text-emerald-100'}`}>
                    {stage.name}
                  </span>
                  <span className="text-2xs text-emerald-200 mt-0.5 text-center">
                    {index === 0 ? '16 Teams' : 
                     index === 1 ? '8 Teams' : 
                     index === 2 ? '4 Teams' : '2 Teams'}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Stage buttons - tablet/desktop version */}
          <div className="hidden sm:flex justify-between relative z-10">
            {stages.map((stage, index) => {
              const isActive = activeFinalStage === stage.id;
              const isCompleted = isStageCompleted(stage.id);
              const isNext = isStageNext(stage.id);
              
              return (
                <div key={stage.id} className="flex flex-col items-center">
                  <button
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                      ${isActive 
                        ? 'bg-white text-emerald-700 shadow-lg scale-110' 
                        : isCompleted
                          ? 'bg-emerald-200 text-emerald-800'
                          : isNext
                            ? 'bg-emerald-500 text-white border-2 border-white border-opacity-50'
                            : 'bg-emerald-600 text-emerald-200 hover:bg-emerald-500'}`}
                    onClick={() => setActiveFinalStage(stage.id)}
                  >
                    {isCompleted ? '✓' : stage.emoji}
                  </button>
                  <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-emerald-100'}`}>
                    {stage.name}
                  </span>
                  <span className="text-xs text-emerald-200 mt-1">
                    {index === 0 ? '16 Teams' : 
                     index === 1 ? '8 Teams' : 
                     index === 2 ? '4 Teams' : '2 Teams'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <div className="w-1 h-8 bg-emerald-500 rounded-full mr-3"></div>
          <h3 className="text-lg sm:text-xl font-bold text-emerald-700">
            {stages.find(s => s.id === activeFinalStage)?.name} Matches
          </h3>
        </div>
        
        <MatchList date={new Date()} stage={activeFinalStage} />
      </div>
      
      <style jsx>{`
        .text-2xs {
          font-size: 0.65rem;
          line-height: 1rem;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default FinalStage;