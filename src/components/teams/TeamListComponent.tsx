'use client';

import { useState, useEffect } from 'react';
import { ITeam, TeamGroup } from '@/models/Team';

interface TeamListProps {
  teams: ITeam[];
  onRefresh: () => void;
}

export default function TeamListComponent({ teams, onRefresh }: TeamListProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamGroup, setTeamGroup] = useState('');
  const [captainName, setCaptainName] = useState('');
  
  // Reset form when selected team changes
  useEffect(() => {
    if (selectedTeam) {
      setTeamName(selectedTeam.name);
      setTeamGroup(selectedTeam.group as string);
      setCaptainName(selectedTeam.captainName);
    } else {
      setTeamName('');
      setTeamGroup('');
      setCaptainName('');
    }
  }, [selectedTeam]);
  
  const openUpdateModal = (team: ITeam) => {
    setSelectedTeam(team);
    setShowUpdateModal(true);
  };
  
  const openDeleteModal = (team: ITeam) => {
    setSelectedTeam(team);
    setShowDeleteModal(true);
  };
  
  const closeModal = () => {
    setShowUpdateModal(false);
    setShowDeleteModal(false);
    setSelectedTeam(null);
  };
  
  const handleUpdateTeam = async () => {
    if (isUpdating || !selectedTeam) return;
    setIsUpdating(true);
    
    try {
      const updatedTeamData = {
        name: teamName,
        group: teamGroup,
        captainName: captainName,
      };
      
      const response = await fetch(`/api/teams/${selectedTeam._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTeamData),
      });
      
      if (response.ok) {
        closeModal();
        onRefresh();
      } else {
        alert('Failed to update team');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      alert('Error updating team');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteTeam = async () => {
    if (isUpdating || !selectedTeam) return;
    setIsUpdating(true);
    
    try {
      const response = await fetch(`/api/teams/${selectedTeam._id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        closeModal();
        onRefresh();
      } else {
        alert('Failed to delete team');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Error deleting team');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Function to determine the background color for each group
  const getGroupBadgeColor = (group: string) => {
    switch(group) {
      case 'A': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'B': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'C': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'D': return 'bg-pink-100 text-pink-800 border border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-50">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Team
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Group
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Captain
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                W/D/L
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Goals (F/A)
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Points
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {teams.map((team, index) => (
              <tr 
                key={'team-' + index}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'} transition-colors duration-150 hover:bg-indigo-100`}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-indigo-100">
                    <div className="flex h-full w-full items-center justify-center text-indigo-500 font-bold">
                          {team.name.charAt(0)}
                        </div>
                      {/* {team.image ? (
                        <img 
                          src={team.image} 
                          alt={team.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-indigo-500 font-bold">
                          {team.name.charAt(0)}
                        </div>
                      )} */}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-gray-900">{team.name}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getGroupBadgeColor(team.group as string)}`}>
                    Group {team.group}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                    { team.captainName ? team.captainName : '' }
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex space-x-1">
                    <span className="flex items-center justify-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      {team.wins}W
                    </span>
                    <span className="flex items-center justify-center rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                      {team.draws}D
                    </span>
                    <span className="flex items-center justify-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                      {team.losses}L
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <span className="flex items-center justify-center rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                      {team.goalsScored}
                    </span>
                    <span className="text-gray-500">/</span>
                    <span className="flex items-center justify-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                      {team.goalsAccepted}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-bold text-white">
                    {team.groupStageDetails?.points || 0}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex space-x-2">
                    {/* Update button */}
                    <button
                      onClick={() => openUpdateModal(team)}
                      className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Update
                    </button>
                    
                    {/* Delete button */}
                    <button
                      onClick={() => openDeleteModal(team)}
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
            {teams.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">No teams registered yet</p>
                    <p className="text-gray-400 text-sm mt-1">Add your first team to get started</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Update Team Modal */}
      {showUpdateModal && selectedTeam && (
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
                      Update Team: {selectedTeam.name}
                    </h3>
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Team Name
                        </label>
                        <input
                          type="text"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Group
                        </label>
                        <select
                          value={teamGroup}
                          onChange={(e) => setTeamGroup(e.target.value)}
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                          <option value="">Select Group</option>
                          <option value="A">Group A</option>
                          <option value="B">Group B</option>
                          <option value="C">Group C</option>
                          <option value="D">Group D</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Captain Name
                        </label>
                        <input
                          type="text"
                          value={captainName}
                          onChange={(e) => setCaptainName(e.target.value)}
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
                  onClick={handleUpdateTeam}
                  disabled={isUpdating}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                >
                  {isUpdating ? 'Saving...' : 'Update Team'}
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
      {showDeleteModal && selectedTeam && (
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
                      Delete Team
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the team "{selectedTeam.name}"? This action cannot be undone and may affect related matches.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleDeleteTeam}
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
    </div>
  );
}