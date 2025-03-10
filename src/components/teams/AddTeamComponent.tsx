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
    <div className="mb-6 w-full max-w-4xl mx-auto">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          <span className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            Add New Team
          </span>
        </button>
      ) : (
        <div className="rounded-xl border-2 border-indigo-100 bg-white p-6 shadow-2xl transition-all duration-300 hover:shadow-indigo-100">
          <h3 className="mb-6 text-2xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text">Register New Team</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group transition-all duration-200">
              <label className="mb-2 block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">Team Name</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800"
                  placeholder="Enter team name"
                  required
                />
              </div>
            </div>
            
            <div className="group transition-all duration-200">
              <label className="mb-2 block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">Tournament Group</label>
              <div className="relative rounded-md shadow-sm">
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value as TeamGroup)}
                  className="w-full appearance-none rounded-lg border border-gray-300 pl-10 p-3 pr-8 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800"
                  required
                >
                  {Object.values(TeamGroup).map((g) => (
                    <option key={g} value={g}>
                      Group {g}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="group transition-all duration-200">
              <label className="mb-2 block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">Captain Name</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  value={captainName}
                  onChange={(e) => setCaptainName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800"
                  placeholder="Enter captain name"
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Register Team
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 transition-all duration-200"
              >
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Cancel
                </span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}