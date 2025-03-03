'use client';

import { useParams } from 'next/navigation';

type Scorer = {
  id: string;
  name: string;
  team: 'A' | 'B';
  minute: number;
  isOwnGoal?: boolean;
  isPenalty?: boolean;
};

function MatchDetail() {
  // Get params using the hook approach
  const params = useParams();
  const id = params?.id as string;
  
  // In a real app, you would fetch match data based on the ID
  // For demo purposes, hardcoded match data
  const match = {
    id: id,
    date: new Date('2025-03-03'),
    teamA: 'Team 1',
    teamB: 'Team 2',
    scoreA: 2,
    scoreB: 1,
    scorers: [
      { id: '1', name: 'Player One', team: 'A' as const, minute: 23 },
      { id: '2', name: 'Player Two', team: 'A' as const, minute: 56, isPenalty: true },
      { id: '3', name: 'Player Three', team: 'B' as const, minute: 78 }
    ],
    status: 'live'
  };

  return (
    <div className="max-w-2xl h-screen mx-auto px-4 py-8 bg-white">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Match header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
          <div className="text-center mb-3 text-emerald-50 font-medium">
            {match.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className="text-xl font-bold mb-1">{match.teamA}</div>
              <div className="text-4xl font-bold">{match.scoreA}</div>
            </div>
            
            <div className="mx-4 px-3 py-1 bg-opacity-20 rounded-md text-sm font-semibold">
              {match.status === 'played' ? 'FULL TIME' : match.status === 'live' ? 'LIVE' : ''}
            </div>
            
            <div className="text-center flex-1">
              <div className="text-xl font-bold mb-1">{match.teamB}</div>
              <div className="text-4xl font-bold">{match.scoreB}</div>
            </div>
          </div>
        </div>
        
        {/* Match details */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Scorers</h2>
          
          <div className="space-y-1">
            {match.scorers.map((scorer: Scorer) => (
              <div key={scorer.id} className="flex items-center py-2 border-b border-gray-100">
                <div className={`w-16 ${scorer.team === 'A' ? 'text-left' : 'text-right'} text-gray-500 font-medium`}>
                  {scorer.minute}{"'"}
                </div>
                
                <div className={`flex-1 ${scorer.team === 'A' ? 'text-left' : 'text-right'}`}>
                  <div className="inline-flex items-center">
                    <span className={`font-medium ${scorer.team === 'A' ? 'text-emerald-700' : 'text-indigo-700'}`}>
                      {scorer.name}
                    </span>
                    {scorer.isPenalty && (
                      <span className="ml-1 text-xs text-gray-500">(P)</span>
                    )}
                    {scorer.isOwnGoal && (
                      <span className="ml-1 text-xs text-gray-500">(OG)</span>
                    )}
                  </div>
                </div>
                
                <div className="w-8 flex justify-center">
                  {scorer.team === 'A' ? (
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold">
                      A
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xs font-bold">
                      B
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {match.scorers.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No goals in this match
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchDetail;