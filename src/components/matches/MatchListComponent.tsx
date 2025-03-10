'use client';

import { useState } from 'react';
import { IMatch, MatchStatus, MatchPhase } from '@/models/Match';

interface MatchListProps {
  matches: IMatch[];
  onRefresh: () => void;
}

export default function MatchListComponent({ matches, onRefresh }: MatchListProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [editMatchId, setEditMatchId] = useState<string | null>(null);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);

  const handleStartMatch = async (matchId: string) => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/matches/${matchId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: MatchStatus.LIVE,
        }),
      });

      if (response.ok) {
        onRefresh();
      } else {
        alert('Failed to start match');
      }
    } catch (error) {
      console.error('Error starting match:', error);
      alert('Error starting match');
    } finally {
      setIsUpdating(false);
    }
  };

  const startEditingScore = (match: IMatch) => {
    setEditMatchId(match._id as string);
    setTeamAScore(match.teamAScore);
    setTeamBScore(match.teamBScore);
  };

  const cancelEditingScore = () => {
    setEditMatchId(null);
  };

  const handleEndMatch = async (matchId: string) => {
    if (isUpdating) return;
    if (!editMatchId) return;
    
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/matches/${matchId}/end`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamAScore,
          teamBScore,
        }),
      });

      if (response.ok) {
        setEditMatchId(null);
        onRefresh();
      } else {
        alert('Failed to end match');
      }
    } catch (error) {
      console.error('Error ending match:', error);
      alert('Error ending match');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatMatchPhase = (phase: MatchPhase): string => {
    switch (phase) {
      case MatchPhase.GROUP:
        return 'Group Stage';
      case MatchPhase.ROUND_OF_16:
        return 'Round of 16';
      case MatchPhase.QUARTER:
        return 'Quarter Finals';
      case MatchPhase.SEMI:
        return 'Semi Finals';
      case MatchPhase.FINAL:
        return 'Final';
      default:
        return phase;
    }
  };

  const getStatusBadgeClasses = (status: MatchStatus): string => {
    switch (status) {
      case MatchStatus.FINISHED:
        return 'bg-green-100 text-green-800 border border-green-200';
      case MatchStatus.LIVE:
        return 'bg-red-100 text-red-800 border border-red-200 animate-pulse';
      case MatchStatus.COMING:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-50">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Teams
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Score
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Phase
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {matches.map((match, index) => (
              <tr 
                key={match._id as string} 
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'} transition-colors duration-150 hover:bg-indigo-100`}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{new Date(match.date).toLocaleDateString()}</span>
                    <span className="text-xs text-gray-500">{match.time}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex flex-col items-end mr-2">
                      <span className="text-sm font-bold text-indigo-700">{(match.teamA as any)?.name || 'Team A'}</span>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-800">
                      VS
                    </div>
                    <div className="flex flex-col items-start ml-2">
                      <span className="text-sm font-bold text-purple-700">{(match.teamB as any)?.name || 'Team B'}</span>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {editMatchId === match._id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        value={teamAScore}
                        onChange={(e) => setTeamAScore(parseInt(e.target.value) || 0)}
                        className="w-16 rounded-md border border-indigo-300 p-2 text-center text-indigo-700 font-semibold focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <span className="text-gray-500 font-bold">-</span>
                      <input
                        type="number"
                        min="0"
                        value={teamBScore}
                        onChange={(e) => setTeamBScore(parseInt(e.target.value) || 0)}
                        className="w-16 rounded-md border border-purple-300 p-2 text-center text-purple-700 font-semibold focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-20 h-10 rounded-lg bg-gray-100">
                      <span className="font-bold text-indigo-700">{match.teamAScore}</span>
                      <span className="mx-2 text-gray-400">-</span>
                      <span className="font-bold text-purple-700">{match.teamBScore}</span>
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span 
                    className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${
                      getStatusBadgeClasses(match.status as MatchStatus)
                    }`}
                  >
                    {match.status === MatchStatus.LIVE && (
                      <span className="mr-1.5 h-2 w-2 rounded-full bg-red-600"></span>
                    )}
                    {match.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
                    {formatMatchPhase(match.phase as MatchPhase)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex space-x-2">
                    {match.status === MatchStatus.COMING && (
                      <button
                        onClick={() => handleStartMatch(match._id as string)}
                        disabled={isUpdating}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Start
                      </button>
                    )}
                    
                    {match.status !== MatchStatus.FINISHED && !editMatchId && (
                      <button
                        onClick={() => startEditingScore(match)}
                        className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                        </svg>
                        End
                      </button>
                    )}
                    
                    {editMatchId === match._id && (
                      <>
                        <button
                          onClick={() => handleEndMatch(match._id as string)}
                          disabled={isUpdating}
                          className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-all duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Save
                        </button>
                        <button
                          onClick={cancelEditingScore}
                          disabled={isUpdating}
                          className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {matches.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">No matches scheduled yet</p>
                    <p className="text-gray-400 text-sm mt-1">Add your first match to get started</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}