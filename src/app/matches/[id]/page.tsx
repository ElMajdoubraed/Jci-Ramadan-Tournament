'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IMatch, MatchStatus } from '@/models/Match';
import { ITeam } from '@/models/Team';

interface Goal {
  player: string;
  minute: number;
  isOwnGoal?: boolean;
  isPenalty?: boolean;
}

function MatchDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [match, setMatch] = useState<IMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamAGoalCounts, setTeamAGoalCounts] = useState<Record<string, number>>({});
  const [teamBGoalCounts, setTeamBGoalCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/matches/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Match not found');
          }
          throw new Error('Failed to fetch match details');
        }
        
        const data = await response.json();
        setMatch(data);
      } catch (err: any) {
        console.error('Error fetching match:', err);
        setError(err.message || 'Failed to load match details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMatchDetails();
    }
  }, [id]);

  // Count goals for each player when match data changes
  useEffect(() => {
    if (!match) return;
    
    // Count Team A goals
    const aGoalCounts: Record<string, number> = {};
    match.teamAPlayerGoals.forEach(player => {
      aGoalCounts[player] = (aGoalCounts[player] || 0) + 1;
    });
    setTeamAGoalCounts(aGoalCounts);
    
    // Count Team B goals
    const bGoalCounts: Record<string, number> = {};
    match.teamBPlayerGoals.forEach(player => {
      bGoalCounts[player] = (bGoalCounts[player] || 0) + 1;
    });
    setTeamBGoalCounts(bGoalCounts);
  }, [match]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center h-96">
        <div className="text-red-500 text-xl font-bold mb-4">{error}</div>
        <Link
          href="/"
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors"
        >
          Return to Matches
        </Link>
      </div>
    );
  }

  if (!match) return null;

  const teamA = match.teamA as ITeam;
  const teamB = match.teamB as ITeam;

  // Get unique player names for each team (no duplicates)
  const teamAScorers = Array.from(new Set(match.teamAPlayerGoals));
  const teamBScorers = Array.from(new Set(match.teamBPlayerGoals));
  
  // Function to render goal indicator
  const renderGoalCount = (count: number) => {
    if (count === 1) return null;
    
    if (count === 2) {
      return <span className="ml-2 text-xs text-gray-500">(Brace)</span>;
    }
    
    if (count === 3) {
      return (
        <span className="ml-2 text-xs text-yellow-600 font-medium flex items-center">
          <span className="mr-1">Hat-trick</span>
          <span className="flex">
            {"⚽".repeat(3)}
          </span>
        </span>
      );
    }
    
    return <span className="ml-2 text-xs text-yellow-600 font-medium">{count} goals</span>;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 bg-white">
      <Link
        href="/"
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Matches
      </Link>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Match header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
          <div className="text-center mb-3 text-emerald-50 font-medium">
            {new Date(match.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • {match.time}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className="flex flex-col items-center">
              🏆
                {/* {teamA.image && (
                  <img src={teamA.image} alt={teamA.name} className="w-16 h-16 object-cover rounded-full mb-2 border-2 border-white" />
                )} */}
                <div className="text-xl font-bold mb-1">{teamA.name}</div>
                <div className="text-4xl font-bold">{match.teamAScore}</div>
              </div>
            </div>
            
            <div className="mx-4 px-3 py-1 bg-gray-50/15 rounded-md text-sm font-semibold">
              {match.status === MatchStatus.FINISHED ? 'FULL TIME' : 
               match.status === MatchStatus.LIVE ? 'LIVE' : 'UPCOMING'}
            </div>
            
            <div className="text-center flex-1">
              <div className="flex flex-col items-center">
              🏆
                {/* {teamB.image && (
                  <img src={teamB.image} alt={teamB.name} className="w-16 h-16 object-cover rounded-full mb-2 border-2 border-white" />
                )} */}
                <div className="text-xl font-bold mb-1">{teamB.name}</div>
                <div className="text-4xl font-bold">{match.teamBScore}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Match details */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-700">Scorers</h2>
            <div className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
              {match.phase}
            </div>
          </div>
          
          <div className="space-y-1">
            {(match.status === MatchStatus.FINISHED || match.status === MatchStatus.LIVE) && 
             (teamAScorers.length > 0 || teamBScorers.length > 0) ? (
              <div className="flex flex-col gap-6">
                {/* Team A scorers */}
                {teamAScorers.length > 0 && (
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-medium text-emerald-800 mb-2 flex items-center">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold mr-2">
                        A
                      </div>
                      {teamA.name} Scorers
                    </h3>
                    <div className="space-y-2">
                      {teamAScorers.map((player, index) => (
                        <div key={`a-${index}`} className="flex items-center">
                          <span 
                            className={`font-medium ${
                              teamAGoalCounts[player] >= 2 ? 'text-emerald-700' : 'text-gray-700'
                            }`}
                          >
                            {player}
                          </span>
                          {renderGoalCount(teamAGoalCounts[player])}
                          <div className="ml-auto flex items-center">
                            {Array.from({ length: teamAGoalCounts[player] }).map((_, i) => (
                              <span key={i} className="text-emerald-600 ml-1">⚽</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Team B scorers */}
                {teamBScorers.length > 0 && (
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="font-medium text-indigo-800 mb-2 flex items-center">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xs font-bold mr-2">
                        B
                      </div>
                      {teamB.name} Scorers
                    </h3>
                    <div className="space-y-2">
                      {teamBScorers.map((player, index) => (
                        <div key={`b-${index}`} className="flex items-center">
                          <span 
                            className={`font-medium ${
                              teamBGoalCounts[player] >= 2 ? 'text-indigo-700' : 'text-gray-700'
                            }`}
                          >
                            {player}
                          </span>
                          {renderGoalCount(teamBGoalCounts[player])}
                          <div className="ml-auto flex items-center">
                            {Array.from({ length: teamBGoalCounts[player] }).map((_, i) => (
                              <span key={i} className="text-indigo-600 ml-1">⚽</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              match.status === MatchStatus.COMING ? (
                <div className="text-center py-6 text-gray-500">
                  Match has not started yet
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No goals in this match
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchDetail;