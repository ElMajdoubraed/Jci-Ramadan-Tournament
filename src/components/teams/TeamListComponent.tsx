'use client';

import { useState, useEffect } from 'react';
import { ITeam } from '@/models/Team';

interface TeamListProps {
  teams: ITeam[];
  onRefresh: () => void;
}

export default function TeamListComponent({ teams, onRefresh }: TeamListProps) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Team
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Group
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Captain
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              W/D/L
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Goals (F/A)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Points
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {teams.map((team, index) => (
            <tr key={'team-' + index}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {team.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {team.group}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {team.captainName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {team.wins}/{team.draws}/{team.losses}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {team.goalsScored}/{team.goalsAccepted}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {team.groupStageDetails?.points || 0}
              </td>
            </tr>
          ))}
          {teams.length === 0 && (
            <tr>
              <td colSpan={6} className="py-4 text-center text-sm text-gray-500">
                No teams found. Add your first team!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}