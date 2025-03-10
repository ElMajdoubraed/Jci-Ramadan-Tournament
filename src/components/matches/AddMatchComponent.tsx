'use client';

import { useState, useEffect } from 'react';
import { ITeam } from '@/models/Team';
import { MatchPhase } from '@/models/Match';

interface AddMatchProps {
  onMatchAdded: () => void;
}

export default function AddMatchComponent({ onMatchAdded }: AddMatchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [phase, setPhase] = useState<MatchPhase>(MatchPhase.GROUP);

  useEffect(() => {
    // Fetch teams for dropdown
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    if (showForm) {
      fetchTeams();
    }
  }, [showForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (teamA === teamB) {
      alert('Teams must be different');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          time,
          teamA,
          teamB,
          phase,
        }),
      });

      if (response.ok) {
        // Reset form
        setDate('');
        setTime('');
        setTeamA('');
        setTeamB('');
        setPhase(MatchPhase.GROUP);
        setShowForm(false);
        onMatchAdded();
      } else {
        alert('Failed to add match');
      }
    } catch (error) {
      console.error('Error adding match:', error);
      alert('Error adding match');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="rounded bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
        >
          Add New Match
        </button>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow">
          <h3 className="mb-4 text-xl font-bold">Add New Match</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Team A</label>
                <select
                  value={teamA}
                  onChange={(e) => setTeamA(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select Team A</option>
                  {teams.map((team) => (
                    <option key={team._id as string} value={team._id as string}>
                      {team.name} (Group {team.group})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium">Team B</label>
                <select
                  value={teamB}
                  onChange={(e) => setTeamB(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select Team B</option>
                  {teams.map((team) => (
                    <option key={team._id as string} value={team._id as string}>
                      {team.name} (Group {team.group})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Phase</label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value as MatchPhase)}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              >
                {Object.values(MatchPhase).map((p) => (
                  <option key={p} value={p}>
                    {p === MatchPhase.GROUP ? 'Group Stage' : 
                     p === MatchPhase.ROUND_OF_16 ? 'Round of 16' : 
                     p === MatchPhase.QUARTER ? 'Quarter Finals' : 
                     p === MatchPhase.SEMI ? 'Semi Finals' : 
                     'Final'}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 disabled:bg-green-300"
              >
                {isLoading ? 'Adding...' : 'Add Match'}
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