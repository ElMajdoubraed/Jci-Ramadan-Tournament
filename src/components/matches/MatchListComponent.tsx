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
        return 'bg-green-100 text-green-800';
      case MatchStatus.LIVE:
        return 'bg-red-100 text-red-800';
      case MatchStatus.COMING:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Date & Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Teams
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Score
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Phase
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {matches.map((match) => (
            <tr key={match._id as string}>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {new Date(match.date).toLocaleDateString()} {match.time}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {(match.teamA as any)?.name || 'Team A'} vs {(match.teamB as any)?.name || 'Team B'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {editMatchId === match._id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      value={teamAScore}
                      onChange={(e) => setTeamAScore(parseInt(e.target.value) || 0)}
                      className="w-12 rounded border p-1"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min="0"
                      value={teamBScore}
                      onChange={(e) => setTeamBScore(parseInt(e.target.value) || 0)}
                      className="w-12 rounded border p-1"
                    />
                  </div>
                ) : (
                  <span>
                    {match.teamAScore} - {match.teamBScore}
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                <span 
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    getStatusBadgeClasses(match.status as MatchStatus)
                  }`}
                >
                  {match.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatMatchPhase(match.phase as MatchPhase)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {match.status === MatchStatus.COMING && (
                  <button
                    onClick={() => handleStartMatch(match._id as string)}
                    disabled={isUpdating}
                    className="mr-2 rounded bg-blue-500 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-600 disabled:bg-blue-300"
                  >
                    Start Match
                  </button>
                )}
                
                {match.status === MatchStatus.LIVE && !editMatchId && (
                  <button
                    onClick={() => startEditingScore(match)}
                    className="mr-2 rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    End Match
                  </button>
                )}
                
                {editMatchId === match._id && (
                  <>
                    <button
                      onClick={() => handleEndMatch(match._id as string)}
                      disabled={isUpdating}
                      className="mr-2 rounded bg-green-500 px-2 py-1 text-xs font-semibold text-white hover:bg-green-600 disabled:bg-green-300"
                    >
                      Save & End
                    </button>
                    <button
                      onClick={cancelEditingScore}
                      disabled={isUpdating}
                      className="rounded border border-gray-300 px-2 py-1 text-xs font-semibold hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {matches.length === 0 && (
            <tr>
              <td colSpan={6} className="py-4 text-center text-sm text-gray-500">
                No matches found. Schedule your first match!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
