'use client';

import { useState, useEffect } from 'react';
import { IMatch, MatchStatus, MatchPhase } from '@/models/Match';
import { ITeam } from '@/models/Team';

interface MatchListProps {
  matches: IMatch[];
  onRefresh: () => void;
}

export default function MatchListComponent({ matches, onRefresh }: MatchListProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<IMatch | null>(null);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [teamAScorers, setTeamAScorers] = useState<string[]>([]);
  const [teamBScorers, setTeamBScorers] = useState<string[]>([]);
  const [newTeamAScorer, setNewTeamAScorer] = useState('');
  const [newTeamBScorer, setNewTeamBScorer] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');

  // Reset form when selected match changes
  useEffect(() => {
    if (selectedMatch) {
      setTeamAScore(selectedMatch.teamAScore);
      setTeamBScore(selectedMatch.teamBScore);
      setTeamAScorers(selectedMatch.teamAPlayerGoals || []);
      setTeamBScorers(selectedMatch.teamBPlayerGoals || []);
      
      // Format date for the date input (YYYY-MM-DD)
      if (selectedMatch.date) {
        const date = new Date(selectedMatch.date);
        const formattedDate = date.toISOString().split('T')[0];
        setMatchDate(formattedDate);
      }
      
      // Set the time
      setMatchTime(selectedMatch.time || '');
    } else {
      setTeamAScore(0);
      setTeamBScore(0);
      setTeamAScorers([]);
      setTeamBScorers([]);
      setMatchDate('');
      setMatchTime('');
    }
  }, [selectedMatch]);

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

  const openScoreModal = (match: IMatch) => {
    setSelectedMatch(match);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowUpdateModal(false);
    setShowDeleteModal(false);
    setSelectedMatch(null);
  };
  
  const openUpdateModal = (match: IMatch) => {
    setSelectedMatch(match);
    setShowUpdateModal(true);
  };
  
  const openDeleteModal = (match: IMatch) => {
    setSelectedMatch(match);
    setShowDeleteModal(true);
  };
  
  const handleUpdateMatch = async () => {
    if (isUpdating || !selectedMatch) return;
    setIsUpdating(true);
    
    try {
      const updatedMatchData = {
        date: new Date(matchDate),
        time: matchTime,
      };
      
      const response = await fetch(`/api/matches/${selectedMatch._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMatchData),
      });
      
      if (response.ok) {
        closeModal();
        onRefresh();
      } else {
        alert('Failed to update match');
      }
    } catch (error) {
      console.error('Error updating match:', error);
      alert('Error updating match');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteMatch = async () => {
    if (isUpdating || !selectedMatch) return;
    setIsUpdating(true);
    
    try {
      const response = await fetch(`/api/matches/${selectedMatch._id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        closeModal();
        onRefresh();
      } else {
        alert('Failed to delete match');
      }
    } catch (error) {
      console.error('Error deleting match:', error);
      alert('Error deleting match');
    } finally {
      setIsUpdating(false);
    }
  };

  const addTeamAScorer = () => {
    if (!newTeamAScorer.trim()) return;
    setTeamAScorers([...teamAScorers, newTeamAScorer.trim()]);
    setNewTeamAScorer('');
    // Automatically update score to match the number of scorers
    setTeamAScore(teamAScorers.length + 1);
  };

  const addTeamBScorer = () => {
    if (!newTeamBScorer.trim()) return;
    setTeamBScorers([...teamBScorers, newTeamBScorer.trim()]);
    setNewTeamBScorer('');
    // Automatically update score to match the number of scorers
    setTeamBScore(teamBScorers.length + 1);
  };

  const removeTeamAScorer = (index: number) => {
    const newScorers = [...teamAScorers];
    newScorers.splice(index, 1);
    setTeamAScorers(newScorers);
    // Automatically update score to match the number of scorers
    setTeamAScore(newScorers.length);
  };

  const removeTeamBScorer = (index: number) => {
    const newScorers = [...teamBScorers];
    newScorers.splice(index, 1);
    setTeamBScorers(newScorers);
    // Automatically update score to match the number of scorers
    setTeamBScore(newScorers.length);
  };

  const handleUpdateResult = async () => {
    if (isUpdating || !selectedMatch) return;
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/matches/${selectedMatch._id}/result`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamAScore,
          teamBScore,
          teamAPlayerGoals: teamAScorers,
          teamBPlayerGoals: teamBScorers,
          status: selectedMatch.status === MatchStatus.LIVE ? MatchStatus.FINISHED : selectedMatch.status
        }),
      });

      if (response.ok) {
        closeModal();
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
    <>
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
                        <span className="text-sm font-bold text-indigo-700">{(match.teamA as ITeam)?.name || 'Team A'}</span>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-800">
                        VS
                      </div>
                      <div className="flex flex-col items-start ml-2">
                        <span className="text-sm font-bold text-purple-700">{(match.teamB as ITeam)?.name || 'Team B'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center justify-center w-20 h-10 rounded-lg bg-gray-100">
                      <span className="font-bold text-indigo-700">{match.teamAScore}</span>
                      <span className="mx-2 text-gray-400">-</span>
                      <span className="font-bold text-purple-700">{match.teamBScore}</span>
                    </div>
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
                      
                      <button
                        onClick={() => openScoreModal(match)}
                        className={`inline-flex items-center rounded-md ${match.status === MatchStatus.FINISHED ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500'} px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all duration-200`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          {match.status !== MatchStatus.FINISHED ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                          ) : (
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          )}
                        </svg>
                        {match.status !== MatchStatus.FINISHED ? 'End' : 'Update Score'}
                      </button>
                      
                      {/* Update button - available for all matches */}
                      <button
                        onClick={() => openUpdateModal(match)}
                        className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Update
                      </button>
                      
                      {/* Delete button - available for all matches */}
                      <button
                        onClick={() => openDeleteModal(match)}
                        className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                      </button>
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

      {/* Score and Scorer Modal */}
      {showModal && selectedMatch && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={closeModal}
              aria-hidden="true"
            ></div>

            {/* Modal panel */}
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {selectedMatch.status === MatchStatus.FINISHED ? 'Update Score' : 'End Match'}: {(selectedMatch.teamA as ITeam)?.name} vs {(selectedMatch.teamB as ITeam)?.name}
                    </h3>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Team A */}
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <h4 className="font-bold text-indigo-700 mb-4">
                          {(selectedMatch.teamA as ITeam)?.name}
                        </h4>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Final Score
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={teamAScore}
                            onChange={(e) => setTeamAScore(parseInt(e.target.value) || 0)}
                            className="w-full rounded-md border border-indigo-300 p-2 text-center text-indigo-700 font-semibold focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Goal Scorers
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={newTeamAScorer}
                              onChange={(e) => setNewTeamAScorer(e.target.value)}
                              placeholder="Player name"
                              className="flex-1 rounded-md border border-indigo-300 p-2 text-indigo-700 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                          </div>
                          <div>
                          <button
                              onClick={addTeamAScorer}
                              className="inline-flex w-full items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all duration-200"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        
                        {/* Scorer list */}
                        <div className="mt-2 max-h-48 overflow-y-auto">
                          {teamAScorers.length > 0 ? (
                            <ul className="space-y-2">
                              {teamAScorers.map((scorer, index) => (
                                <li key={index} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
                                  <span className="font-medium text-indigo-700">
                                    {scorer}
                                  </span>
                                  <button
                                    onClick={() => removeTeamAScorer(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-center text-gray-500 py-2">No scorers added</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Team B */}
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-bold text-purple-700 mb-4">
                          {(selectedMatch.teamB as ITeam)?.name}
                        </h4>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Final Score
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={teamBScore}
                            onChange={(e) => setTeamBScore(parseInt(e.target.value) || 0)}
                            className="w-full rounded-md border border-purple-300 p-2 text-center text-purple-700 font-semibold focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Goal Scorers
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={newTeamBScorer}
                              onChange={(e) => setNewTeamBScorer(e.target.value)}
                              placeholder="Player name"
                              className="flex-1 rounded-md border border-purple-300 p-2 text-purple-700 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                            />
                          </div>
                          <div>
                            <button onClick={addTeamBScorer} className="inline-flex items-center w-full rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition-all duration-200">
                            Add</button>
                          </div>
                        </div>
                        
                        {/* Scorer list */}
                        <div className="mt-2 max-h-48 overflow-y-auto">
                          {teamBScorers.length > 0 ? (
                            <ul className="space-y-2">
                              {teamBScorers.map((scorer, index) => (
                                <li key={index} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
                                  <span className="font-medium text-purple-700">
                                    {scorer}
                                  </span>
                                  <button
                                    onClick={() => removeTeamBScorer(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-center text-gray-500 py-2">No scorers added</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleUpdateResult}
                  disabled={isUpdating}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  {isUpdating ? 'Saving...' : (selectedMatch?.status === MatchStatus.LIVE ? 'End Match' : 'Update Score')}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isUpdating}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Update Match Modal */}
      {showUpdateModal && selectedMatch && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={closeModal}
              aria-hidden="true"
            ></div>

            {/* Modal panel */}
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Update Match: {(selectedMatch.teamA as ITeam)?.name} vs {(selectedMatch.teamB as ITeam)?.name}
                    </h3>
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Match Date
                        </label>
                        <input
                          type="date"
                          value={matchDate}
                          onChange={(e) => setMatchDate(e.target.value)}
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Match Time
                        </label>
                        <input
                          type="time"
                          value={matchTime}
                          onChange={(e) => setMatchTime(e.target.value)}
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleUpdateMatch}
                  disabled={isUpdating}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                >
                  {isUpdating ? 'Saving...' : 'Update Match'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isUpdating}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMatch && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={closeModal}
              aria-hidden="true"
            ></div>

            {/* Modal panel */}
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Delete Match
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the match between {(selectedMatch.teamA as ITeam)?.name} and {(selectedMatch.teamB as ITeam)?.name}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleDeleteMatch}
                  disabled={isUpdating}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  {isUpdating ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isUpdating}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}