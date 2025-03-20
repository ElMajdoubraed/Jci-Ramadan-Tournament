'use client';

import { useState, useEffect } from 'react';
import { ITeam } from '@/models/Team';

interface TeamListProps {
  teams: ITeam[];
  onRefresh: () => void;
}

export default function TeamListComponent({ teams, onRefresh }: TeamListProps) {
  
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
                    {team.captainName}
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
              </tr>
            ))}
            {teams.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center">
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
    </div>
  );
}