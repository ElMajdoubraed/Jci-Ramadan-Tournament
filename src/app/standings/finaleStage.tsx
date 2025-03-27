'use client';

import { useState } from 'react';
import MatchList from "../matches/matchList";

function FinalStage() {
  const stages = [
    { id: 'Quarterfinals', name: 'Quarts de Finale', emoji: '🔥' },
    { id: 'Semifinals', name: 'Demi-finales', emoji: '⚡' },
    { id: 'Final', name: 'Finale', emoji: '🏆' }
  ];
  
  const [activeFinalStage, setActiveFinalStage] = useState('Quarterfinals');
  
  // Fonction pour déterminer si une phase est terminée
  const isStageCompleted = (stageId: string) => {
    const stageOrder = stages.findIndex(s => s.id === stageId);
    const activeStageOrder = stages.findIndex(s => s.id === activeFinalStage);
    return stageOrder < activeStageOrder;
  };
  
  // Fonction pour déterminer si une phase est la suivante (pour indication visuelle)
  const isStageNext = (stageId: string) => {
    const stageOrder = stages.findIndex(s => s.id === stageId);
    const activeStageOrder = stages.findIndex(s => s.id === activeFinalStage);
    return stageOrder === activeStageOrder + 1;
  };

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-4xl mx-auto px-2 sm:px-3">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-3 sm:p-4 rounded-lg text-white shadow-md">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-center mb-1 sm:mb-2">Phases Finales du Tournoi</h2>
        <p className="text-emerald-100 text-2xs sm:text-xs md:text-sm text-center mb-3 sm:mb-4">Suivez le parcours vers le championnat</p>
        
        <div className="relative px-1 sm:px-2 pb-2 mt-4 sm:mt-5">
          {/* Barre de progression */}
          <div className="absolute top-full sm:top-1/2 left-0 h-0.5 sm:h-1 bg-emerald-300 bg-opacity-30 w-full -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute top-full sm:top-1/2 left-0 h-0.5 sm:h-1 bg-white -translate-y-1/2 rounded-full transition-all duration-500"
            style={{ 
              width: `${(stages.findIndex(s => s.id === activeFinalStage) / (stages.length - 1)) * 100}%` 
            }}
          ></div>
          
          {/* Boutons des phases - version mobile défilable */}
          <div className="flex justify-between relative z-10 sm:hidden overflow-x-auto pb-2 sm:pb-3 gap-1 sm:gap-2 hide-scrollbar">
            {stages.map((stage, index) => {
              const isActive = activeFinalStage === stage.id;
              const isCompleted = isStageCompleted(stage.id);
              const isNext = isStageNext(stage.id);
              
              return (
                <div key={stage.id} className="flex flex-col items-center min-w-14 sm:min-w-16">
                  <button
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 transition-all duration-300
                      ${isActive 
                        ? 'bg-white text-emerald-700 shadow-lg scale-110' 
                        : isCompleted
                          ? 'bg-emerald-200 text-emerald-800'
                          : isNext
                            ? 'bg-emerald-500 text-white border border-white border-opacity-50'
                            : 'bg-emerald-600 text-emerald-200'}`}
                    onClick={() => setActiveFinalStage(stage.id)}
                  >
                    {isCompleted ? '✓' : stage.emoji}
                  </button>
                  <span className={`text-2xs font-medium text-center ${isActive ? 'text-white' : 'text-emerald-100'}`}>
                    {stage.name}
                  </span>
                  <span className="text-2xs text-emerald-200 mt-0.5 text-center">
                    {index === 0 ? '8 Équipes' : 
                     index === 1 ? '4 Équipes' : 
                     index === 2 ? '2 Équipes' : '1 Équipe'}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Boutons des phases - version tablette/bureau */}
          <div className="hidden sm:flex justify-between relative z-10">
            {stages.map((stage, index) => {
              const isActive = activeFinalStage === stage.id;
              const isCompleted = isStageCompleted(stage.id);
              const isNext = isStageNext(stage.id);
              
              return (
                <div key={stage.id} className="flex flex-col items-center">
                  <button
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1 md:mb-2 transition-all duration-300
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
                  <span className={`text-2xs sm:text-xs font-medium ${isActive ? 'text-white' : 'text-emerald-100'}`}>
                    {stage.name}
                  </span>
                  <span className="text-2xs sm:text-xs text-emerald-200 mt-0.5 md:mt-1">
                    {index === 0 ? '8 Équipes' : 
                     index === 1 ? '4 Équipes' : 
                     index === 2 ? '2 Équipes' : '1 Équipe'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
        <div className="flex items-center mb-3 sm:mb-4">
          <div className="w-1 h-6 sm:h-8 bg-emerald-500 rounded-full mr-2 sm:mr-3"></div>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-emerald-700">
            Matchs {stages.find(s => s.id === activeFinalStage)?.name}
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