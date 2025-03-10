'use client';

import { useState } from 'react';
import { TeamGroup } from '@/models/Team';

interface AddTeamProps {
  onTeamAdded: () => void;
}

export default function AddTeamComponent({ onTeamAdded }: AddTeamProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [group, setGroup] = useState<TeamGroup>(TeamGroup.A);
  const [captainName, setCaptainName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          group,
          captainName,
          image: `/images/${name.toLowerCase().replace(/\s+/g, '-')}.png`,
        }),
      });

      if (response.ok) {
        // Reset form
        setName('');
        setGroup(TeamGroup.A);
        setCaptainName('');
        setShowForm(false);
        onTeamAdded();
      } else {
        alert('Failed to add team');
      }
    } catch (error) {
      console.error('Error adding team:', error);
      alert('Error adding team');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        >
          Add New Team
        </button>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow">
          <h3 className="mb-4 text-xl font-bold">Add New Team</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Team Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Group</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value as TeamGroup)}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              >
                {Object.values(TeamGroup).map((g) => (
                  <option key={g} value={g}>
                    Group {g}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Captain Name</label>
              <input
                type="text"
                value={captainName}
                onChange={(e) => setCaptainName(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isLoading ? 'Adding...' : 'Add Team'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}