'use client';
import { useState } from 'react';

// Define TypeScript interfaces
interface MatchGoal {
  player: string;
  team: string;
  minute: number;
  isOwnGoal?: boolean;
  isPenalty?: boolean;
}

interface MatchResult {
  id: number;
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
  // Sample match results data
  const resultsData: MatchResult[] = [
    {
      id: 1,
      date: '2024-03-01T14:00:00',
      teamA: 'Al Barakah',
      teamB: 'Al Fursan',
      scoreA: 3,
      scoreB: 1,
      stage: 'Group Stage',
      group: 'A',
      location: 'Main Stadium',
      isCompleted: true,
      goals: [
        { player: 'Ahmed Hassan', team: 'Al Barakah', minute: 23 },
        { player: 'Tariq Nabil', team: 'Al Fursan', minute: 37 },
        { player: 'Mahmoud Ibrahim', team: 'Al Barakah', minute: 56 },
        { player: 'Ahmed Hassan', team: 'Al Barakah', minute: 78, isPenalty: true }
      ],
      stats: {
        possession: [58, 42],
        shots: [14, 9],
        shotsOnTarget: [7, 3],
        corners: [6, 4],
        fouls: [8, 12]
      }
    },
    {
      id: 2,
      date: '2024-03-01T16:00:00',
      teamA: 'Al Najm',
      teamB: 'Al Sakhr',
      scoreA: 2,
      scoreB: 2,
      stage: 'Group Stage',
      group: 'B',
      location: 'Field 2',
      isCompleted: true,
      goals: [
        { player: 'Jamal Rashid', team: 'Al Najm', minute: 15 },
        { player: 'Waleed Tarek', team: 'Al Sakhr', minute: 34 },
        { player: 'Karim Farouk', team: 'Al Najm', minute: 61 },
        { player: 'Hisham Fahmy', team: 'Al Sakhr', minute: 89 }
      ],
      stats: {
        possession: [45, 55],
        shots: [10, 15],
        shotsOnTarget: [5, 7],
        corners: [3, 8],
        fouls: [14, 9]
      }
    },
    {
      id: 3,
      date: '2024-03-02T14:00:00',
      teamA: 'Al Barakah',
      teamB: 'Al Najm',
      scoreA: 2,
      scoreB: 1,
      stage: 'Group Stage',
      group: 'A',
      location: 'Main Stadium',
      isCompleted: true,
      goals: [
        { player: 'Ahmed Hassan', team: 'Al Barakah', minute: 12 },
        { player: 'Jamal Rashid', team: 'Al Najm', minute: 45 },
        { player: 'Khalid Ali', team: 'Al Barakah', minute: 72 }
      ],
      stats: {
        possession: [52, 48],
        shots: [12, 11],
        shotsOnTarget: [6, 4],
        corners: [5, 6],
        fouls: [10, 11]
      }
    },
    {
      id: 4,
      date: '2024-03-05T16:00:00',
      teamA: 'Al Sakhr',
      teamB: 'Al Fursan',
      scoreA: 0,
      scoreB: 0,
      stage: 'Group Stage',
      group: 'B',
      location: 'Field 2',
      isCompleted: true,
      goals: [],
      stats: {
        possession: [50, 50],
        shots: [8, 7],
        shotsOnTarget: [2, 3],
        corners: [4, 5],
        fouls: [13, 15]
      }
    },
    {
      id: 5,
      date: '2024-03-08T14:00:00',
      teamA: 'Al Barakah',
      teamB: 'Al Sakhr',
      scoreA: 2,
      scoreB: 1,
      stage: 'Final Stage',
      location: 'Main Stadium',
      isCompleted: true,
      goals: [
        { player: 'Hisham Fahmy', team: 'Al Sakhr', minute: 8 },
        { player: 'Ahmed Hassan', team: 'Al Barakah', minute: 34 },
        { player: 'Mahmoud Ibrahim', team: 'Al Barakah', minute: 76 }
      ],
      stats: {
        possession: [62, 38],
        shots: [18, 6],
        shotsOnTarget: [9, 2],
        corners: [7, 2],
        fouls: [7, 16]
      }
    }
  ];

  // Filter options
  const stages = ['All Stages', 'Group Stage', 'Final Stage'];
  const [selectedStage, setSelectedStage] = useState<string>('All Stages');
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  // Filter results based on selected stage
  const filteredResults = selectedStage === 'All Stages' 
    ? resultsData 
    : resultsData.filter(match => match.stage === selectedStage);

  // Format date for display
  const formatMatchDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time for display
  const formatMatchTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Determine match outcome for a team
  const getMatchOutcome = (match: MatchResult, team: string): string => {
    const isTeamA = match.teamA === team;
    const teamScore = isTeamA ? match.scoreA : match.scoreB;
    const opponentScore = isTeamA ? match.scoreB : match.scoreA;
    
    if (teamScore > opponentScore) return 'W';
    if (teamScore < opponentScore) return 'L';
    return 'D';
  };

  // Get appropriate color class for match outcome
  const getOutcomeColorClass = (outcome: string): string => {
    switch (outcome) {
      case 'W': return 'bg-emerald-100 text-emerald-800';
      case 'L': return 'bg-red-100 text-red-800';
      case 'D': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Find selected match
  const selectedMatch = selectedMatchId 
    ? resultsData.find(match => match.id === selectedMatchId) 
    : null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-4 rounded-lg shadow-md text-white">
        <h2 className="text-xl font-bold text-center">Tournament Results</h2>
        <p className="text-emerald-100 text-sm text-center mt-1">
          {resultsData.length} completed matches
        </p>
      </div>

      {/* Filter controls */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-wrap justify-between items-center">
          <h3 className="text-lg font-medium text-emerald-700 mb-2 md:mb-0">Filter Results</h3>
          <div className="flex space-x-2">
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
        // Match detail view
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
            <button 
              onClick={() => setSelectedMatchId(null)}
              className="bg-white bg-opacity-20 rounded-full p-1 hover:bg-opacity-30 transition-all"
            >
              ←
            </button>
            <h3 className="text-lg font-bold">Match Details</h3>
            <div className="bg-white text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
              {selectedMatch.stage} {selectedMatch.group ? `• Group ${selectedMatch.group}` : ''}
            </div>
          </div>
          
          {/* Match overview */}
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
            
            {/* Match stats */}
            {selectedMatch.stats && (
              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-700 mb-3 border-b pb-2">Match Statistics</h4>
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
                    <div className="w-20 text-sm">Shots</div>
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
                    <div className="w-20 text-sm">On Target</div>
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
                    <div className="w-20 text-sm">Fouls</div>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(selectedMatch.stats.fouls[1] / (selectedMatch.stats.fouls[0] + selectedMatch.stats.fouls[1])) * 100}%` }}></div>
                    </div>
                    <div className="w-16 text-left text-sm font-medium">{selectedMatch.stats.fouls[1]}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Goal timeline */}
            {selectedMatch.goals.length > 0 && (
              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-700 mb-3 border-b pb-2">Goals</h4>
                <div className="relative py-4">
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-200"></div>
                  
                  {selectedMatch.goals.map((goal, index) => {
                    const isTeamA = goal.team === selectedMatch.teamA;
                    
                    return (
                      <div key={index} className={`relative flex items-center mb-4 ${isTeamA ? 'justify-start' : 'justify-end'}`}>
                        <div className={`absolute top-1/2 left-1/2 transform -translate-y-1/2 ${isTeamA ? '-translate-x-1/2' : 'translate-x-1/2'} w-3 h-3 rounded-full bg-yellow-400 z-10`}></div>
                        
                        <div className={`${isTeamA ? 'mr-8' : 'ml-8'} p-2 rounded-lg bg-gray-50 border border-gray-100 ${isTeamA ? 'text-right' : 'text-left'} w-5/12`}>
                          <div className="font-medium">{goal.player}</div>
                          <div className="text-sm text-gray-500 flex items-center justify-between">
                            <span>{goal.team}</span>
                            <span className="bg-yellow-100 text-yellow-800 px-1 rounded text-xs">
                              {goal.minute}{"'"}
                              {goal.isPenalty && ' (P)'}
                              {goal.isOwnGoal && ' (OG)'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Results list view
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
                      {match.stage} {match.group ? `• Group ${match.group}` : ''}
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
                      <div className="text-xs text-gray-500 mt-1">Final Score</div>
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="font-medium">{match.teamB}</div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-center">
                    <span className="text-xs text-gray-500">
                      {match.location} • 
                      {match.goals.length === 0 
                        ? ' No goals scored' 
                        : ` ${match.goals.length} goal${match.goals.length > 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="text-5xl mb-4">⚽</div>
                <h3 className="text-xl font-medium text-gray-700">No matches found</h3>
                <p className="text-gray-500 mt-2">There are no completed matches in this stage.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;