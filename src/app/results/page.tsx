'use client';
import { useState, useEffect } from 'react';
import { MatchPhase } from '@/models/Match';

// Définir les interfaces TypeScript
interface MatchGoal {
  player: string;
  team: string;
  minute: number;
  isOwnGoal?: boolean;
  isPenalty?: boolean;
}

interface MatchResult {
  id: string;
  date: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  stage: string;
  group?: string;
  location: string;
  isCompleted: boolean;
  goals: MatchGoal[];
  stats?: {
    possession: [number, number];
    shots: [number, number];
    shotsOnTarget: [number, number];
    corners: [number, number];
    fouls: [number, number];
  };
}

function Results() {
  // État
  const [resultsData, setResultsData] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string>('Toutes les Phases');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  // Obtenir les phases disponibles depuis le modèle Match
  const stages = ['Toutes les Phases', 'Phase de Groupes', 'Quarts de Finale', 'Demi-finales', 'Finale'];

  // Récupérer les données des résultats
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const stageParam = selectedStage !== 'Toutes les Phases' ? 
          `?stage=${encodeURIComponent(selectedStage)}` : '';
        
        const response = await fetch(`/api/results${stageParam}`);
        
        if (!response.ok) {
          throw new Error('Échec de récupération des résultats');
        }
        
        const data = await response.json();
        setResultsData(data);
        setError(null);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des résultats:', err);
        setError(err.message || 'Impossible de charger les résultats');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedStage]);

  // Filtrer les résultats en fonction de la phase sélectionnée
  const filteredResults = resultsData;

  // Formater la date pour l'affichage
  const formatMatchDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Formater l'heure pour l'affichage
  const formatMatchTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Déterminer le résultat du match pour une équipe
  const getMatchOutcome = (match: MatchResult, team: string): string => {
    const isTeamA = match.teamA === team;
    const teamScore = isTeamA ? match.scoreA : match.scoreB;
    const opponentScore = isTeamA ? match.scoreB : match.scoreA;
    
    if (teamScore > opponentScore) return 'V';
    if (teamScore < opponentScore) return 'D';
    return 'N';
  };

  // Obtenir la classe de couleur appropriée pour le résultat du match
  const getOutcomeColorClass = (outcome: string): string => {
    switch (outcome) {
      case 'V': return 'bg-emerald-100 text-emerald-800';
      case 'D': return 'bg-red-100 text-red-800';
      case 'N': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Trouver le match sélectionné
  const selectedMatch = selectedMatchId 
    ? resultsData.find(match => match.id === selectedMatchId) 
    : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-4 rounded-lg shadow-md text-white">
        <h2 className="text-xl font-bold text-center">Résultats du Tournoi</h2>
        <p className="text-emerald-100 text-sm text-center mt-1">
          {resultsData.length} matchs terminés
        </p>
      </div>

      {/* Contrôles de filtrage */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-wrap justify-between items-center">
          <h3 className="text-lg font-medium text-emerald-700 mb-2 md:mb-0">Filtrer les Résultats</h3>
          <div className="flex flex-wrap gap-2">
            {stages.map(stage => (
              <button
                key={stage}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedStage === stage 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedStage(stage)}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedMatch ? (
        // Vue détaillée du match
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
            <button 
              onClick={() => setSelectedMatchId(null)}
              className="bg-opacity-20 rounded-full p-2 hover:bg-opacity-30 transition-all"
              aria-label="Retour"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <h3 className="text-lg font-bold">Détails du Match</h3>
            <div className="bg-white text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
              {selectedMatch.stage} {selectedMatch.group ? `• Groupe ${selectedMatch.group}` : ''}
            </div>
          </div>
          
          {/* Aperçu du match */}
          <div className="p-4 bg-gradient-to-b from-gray-50 to-white">
            <div className="text-center text-sm text-gray-500 mb-3">
              {formatMatchDate(selectedMatch.date)} • {formatMatchTime(selectedMatch.date)} • {selectedMatch.location}
            </div>
            
            <div className="flex items-center justify-center my-6">
              <div className="text-right flex-1">
                <div className="text-lg font-bold">{selectedMatch.teamA}</div>
                <div className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                  getOutcomeColorClass(getMatchOutcome(selectedMatch, selectedMatch.teamA))
                }`}>
                  {getMatchOutcome(selectedMatch, selectedMatch.teamA)}
                </div>
              </div>
              
              <div className="mx-6 flex items-center">
                <div className="text-4xl font-bold text-center">
                  <span>{selectedMatch.scoreA}</span>
                  <span className="mx-2 text-gray-300">-</span>
                  <span>{selectedMatch.scoreB}</span>
                </div>
              </div>
              
              <div className="text-left flex-1">
                <div className="text-lg font-bold">{selectedMatch.teamB}</div>
                <div className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                  getOutcomeColorClass(getMatchOutcome(selectedMatch, selectedMatch.teamB))
                }`}>
                  {getMatchOutcome(selectedMatch, selectedMatch.teamB)}
                </div>
              </div>
            </div>
            
            {/* Statistiques du match */}
            {/* {selectedMatch.stats && (
              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-700 mb-3 border-b pb-2">Statistiques du Match</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-16 text-right text-sm font-medium">{selectedMatch.stats.possession[0]}%</div>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedMatch.stats.possession[0]}%` }}></div>
                    </div>
                    <div className="w-20 text-sm">Possession</div>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedMatch.stats.possession[1]}%` }}></div>
                    </div>
                    <div className="w-16 text-left text-sm font-medium">{selectedMatch.stats.possession[1]}%</div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-16 text-right text-sm font-medium">{selectedMatch.stats.shots[0]}</div>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(selectedMatch.stats.shots[0] / (selectedMatch.stats.shots[0] + selectedMatch.stats.shots[1])) * 100}%` }}></div>
                    </div>
                    <div className="w-20 text-sm">Tirs</div>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(selectedMatch.stats.shots[1] / (selectedMatch.stats.shots[0] + selectedMatch.stats.shots[1])) * 100}%` }}></div>
                    </div>
                    <div className="w-16 text-left text-sm font-medium">{selectedMatch.stats.shots[1]}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-16 text-right text-sm font-medium">{selectedMatch.stats.shotsOnTarget[0]}</div>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(selectedMatch.stats.shotsOnTarget[0] / (selectedMatch.stats.shotsOnTarget[0] + selectedMatch.stats.shotsOnTarget[1])) * 100}%` }}></div>
                    </div>
                    <div className="w-20 text-sm">Cadrés</div>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(selectedMatch.stats.shotsOnTarget[1] / (selectedMatch.stats.shotsOnTarget[0] + selectedMatch.stats.shotsOnTarget[1])) * 100}%` }}></div>
                    </div>
                    <div className="w-16 text-left text-sm font-medium">{selectedMatch.stats.shotsOnTarget[1]}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-16 text-right text-sm font-medium">{selectedMatch.stats.corners[0]}</div>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(selectedMatch.stats.corners[0] / (selectedMatch.stats.corners[0] + selectedMatch.stats.corners[1])) * 100}%` }}></div>
                    </div>
                    <div className="w-20 text-sm">Corners</div>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(selectedMatch.stats.corners[1] / (selectedMatch.stats.corners[0] + selectedMatch.stats.corners[1])) * 100}%` }}></div>
                    </div>
                    <div className="w-16 text-left text-sm font-medium">{selectedMatch.stats.corners[1]}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-16 text-right text-sm font-medium">{selectedMatch.stats.fouls[0]}</div>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(selectedMatch.stats.fouls[0] / (selectedMatch.stats.fouls[0] + selectedMatch.stats.fouls[1])) * 100}%` }}></div>
                    </div>
                    <div className="w-20 text-sm">Fautes</div>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(selectedMatch.stats.fouls[1] / (selectedMatch.stats.fouls[0] + selectedMatch.stats.fouls[1])) * 100}%` }}></div>
                    </div>
                    <div className="w-16 text-left text-sm font-medium">{selectedMatch.stats.fouls[1]}</div>
                  </div>
                </div>
              </div>
            )} */}
            
            {/* Buteurs */}
            {selectedMatch.goals.length > 0 && (
              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-700 mb-3 border-b pb-2">Buteurs</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Buteurs équipe A */}
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h5 className="font-medium text-emerald-800 mb-2">{selectedMatch.teamA}</h5>
                    <ul className="space-y-1">
                      {selectedMatch.goals
                        .filter(goal => goal.team === selectedMatch.teamA)
                        .map((goal, idx) => (
                          <li key={`a-${idx}`} className="flex items-center">
                            <span className="font-medium text-gray-700">{goal.player}</span>
                            <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full">
                              ⚽ Buteur
                            </span>
                          </li>
                        ))}
                      {selectedMatch.goals.filter(goal => goal.team === selectedMatch.teamA).length === 0 && (
                        <li className="text-gray-500 text-sm">Aucun but</li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Buteurs équipe B */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">{selectedMatch.teamB}</h5>
                    <ul className="space-y-1">
                      {selectedMatch.goals
                        .filter(goal => goal.team === selectedMatch.teamB)
                        .map((goal, idx) => (
                          <li key={`b-${idx}`} className="flex items-center">
                            <span className="font-medium text-gray-700">{goal.player}</span>
                            <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                              ⚽ Buteur
                            </span>
                          </li>
                        ))}
                      {selectedMatch.goals.filter(goal => goal.team === selectedMatch.teamB).length === 0 && (
                        <li className="text-gray-500 text-sm">Aucun but</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Vue liste des résultats
        <div className="bg-white rounded-lg shadow-md">
          <div className="divide-y divide-gray-100">
            {filteredResults.length > 0 ? (
              filteredResults.map((match) => (
                <div 
                  key={match.id} 
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedMatchId(match.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs text-gray-500">
                      {formatMatchDate(match.date)} • {formatMatchTime(match.date)}
                    </div>
                    <div className="text-xs bg-gray-100 rounded-full px-2 py-0.5">
                      {match.stage} {match.group ? `• Groupe ${match.group}` : ''}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-right">
                      <div className="font-medium">{match.teamA}</div>
                    </div>
                    
                    <div className="mx-4 px-4 py-2 text-center">
                      <div className="font-bold text-xl">
                        {match.scoreA} - {match.scoreB}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Score Final</div>
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="font-medium">{match.teamB}</div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-center">
                    <span className="text-xs text-gray-500">
                      {match.location} • 
                      {match.goals.length === 0 
                        ? ' Aucun but marqué' 
                        : ` ${match.goals.length} but${match.goals.length > 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="text-5xl mb-4">⚽</div>
                <h3 className="text-xl font-medium text-gray-700">Aucun match trouvé</h3>
                <p className="text-gray-500 mt-2">Il n'y a pas de matchs terminés dans cette phase.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;