'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Simple interface for teams
interface Team {
  _id: string;
  name: string;
  group: string;
  captainName: string;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsAccepted: number;
  groupStageDetails: {
    points: number;
  };
}

// Simple interface for matches
interface Match {
  _id: string;
  date: string;
  time: string;
  teamA: any;
  teamB: any;
  teamAScore: number;
  teamBScore: number;
  status: string;
  phase: string;
}

export default function AdminPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teams');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/login');
      return;
    }

    // Fetch data
    fetchTeams();
    fetchMatches();
  }, [router]);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches');
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  // Basic admin functions
  const handleAddTeam = () => {
    // In a real app, you'd probably use a modal or navigate to a form page
    const teamName = prompt('Enter team name:');
    if (!teamName) return;

    const teamGroup = prompt('Enter team group (A, B, C, or D):');
    if (!teamGroup) return;

    const captainName = prompt('Enter captain name:');
    if (!captainName) return;

    // Create a new team
    fetch('/api/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: teamName,
        group: teamGroup.toUpperCase(),
        captainName: captainName,
        image: `/images/${teamName.toLowerCase().replace(/\s+/g, '-')}.png`,
      }),
    })
      .then(response => {
        if (response.ok) {
          alert('Team added successfully!');
          fetchTeams();
        } else {
          alert('Failed to add team');
        }
      })
      .catch(error => {
        console.error('Error adding team:', error);
        alert('Error adding team');
      });
  };

  const handleAddMatch = () => {
    // In a real app, this would be a form with proper validation
    if (teams.length < 2) {
      alert('Need at least 2 teams to create a match');
      return;
    }

    // Simple implementation for demo
    alert('In a real app, this would open a form to add a match');
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Ramadan Tournament Admin</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">Total Teams</h2>
            <p className="mt-2 text-3xl font-bold">{teams.length}</p>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">Total Matches</h2>
            <p className="mt-2 text-3xl font-bold">{matches.length}</p>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
            <div className="mt-2 space-x-2">
              <button 
                onClick={handleAddTeam}
                className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
              >
                Add Team
              </button>
              <button 
                onClick={handleAddMatch}
                className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
              >
                Add Match
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === 'teams'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('teams')}
            >
              Teams
            </button>
            <button
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === 'matches'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('matches')}
            >
              Matches
            </button>
          </nav>
        </div>

        {/* Teams Table */}
        {activeTab === 'teams' && (
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
                {teams.map((team) => (
                  <tr key={team._id}>
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
        )}

        {/* Matches Table */}
        {activeTab === 'matches' && (
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {matches.map((match) => (
                  <tr key={match._id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(match.date).toLocaleDateString()} {match.time}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {match.teamA?.name || 'Team A'} vs {match.teamB?.name || 'Team B'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {match.teamAScore} - {match.teamBScore}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span 
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          match.status === 'finished' 
                            ? 'bg-green-100 text-green-800' 
                            : match.status === 'live' 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {match.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {match.phase}
                    </td>
                  </tr>
                ))}
                {matches.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-sm text-gray-500">
                      No matches found. Schedule your first match!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}