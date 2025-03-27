'use client';
import { useState } from 'react';
import GroupStage from './groupStage';
import FinalStage from './finaleStage';

function Standings() {
  const [activeStage, setActiveStage] = useState('Group Stage');
  
  const stages = [
    { id: 'Group Stage', name: 'Phase de Groupes', icon: '👥' },
    { id: 'Final Stage', name: 'Phase Finale', icon: '🏆' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-4">
          <h2 className="text-xl font-bold text-white text-center">Progression du Tournoi</h2>
          <p className="text-emerald-100 text-sm text-center mt-1">
            Suivez la compétition des phases de groupes jusqu'à la finale
          </p>
        </div>
        
        <div className="flex p-1 bg-emerald-50">
          {stages.map((stage) => (
            <button
              key={stage.id}
              className={`flex-1 flex items-center justify-center py-3 px-4 m-1 rounded-md transition-all duration-200 ${
                activeStage === stage.id 
                  ? 'bg-white text-emerald-700 shadow-md font-medium' 
                  : 'text-emerald-600 hover:bg-white/50'
              }`}
              onClick={() => setActiveStage(stage.id)}
            >
              <span className="mr-2 text-lg">{stage.icon}</span>
              <span>{stage.name}</span>
              {activeStage === stage.id && (
                <span className="ml-2 w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>
          ))}
        </div>
        
        <div className="p-1 bg-emerald-50 flex justify-center">
          <div className="h-1 bg-emerald-200 rounded-full w-32 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ 
                width: activeStage === 'Group Stage' ? '50%' : '100%'
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {/* Description de la phase */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 hidden sm:block rounded-full shadow-sm z-10">
          <span className="text-sm font-medium text-emerald-700">
            {activeStage === 'Group Stage' 
              ? 'Équipes en compétition dans les groupes' 
              : 'Matchs à élimination directe'}
          </span>
        </div>
        
        {/* Conteneur de contenu avec animation de fondu */}
        <div className="bg-white rounded-lg shadow-md p-0 sm:p-6 pt-8 transition-all duration-500 ease-in-out">
          {activeStage === 'Group Stage' ? (
            <div className="animate-fadeIn">
              <GroupStage />
            </div>
          ) : (
            <div className="animate-fadeIn">
              <FinalStage />
            </div>
          )}
        </div>
      </div>
      
      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Standings;