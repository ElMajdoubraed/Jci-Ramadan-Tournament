'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ITeam } from '@/models/Team';
import { IMatch } from '@/models/Match';
import AddTeamComponent from '@/components/teams/AddTeamComponent';
import TeamListComponent from '@/components/teams/TeamListComponent';
import AddMatchComponent from '@/components/matches/AddMatchComponent';
import MatchListComponent from '@/components/matches/MatchListComponent';

export default function AdminPage() {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [matches, setMatches] = useState<IMatch[]>([]);
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
              {activeTab === 'teams' && <AddTeamComponent onTeamAdded={fetchTeams} />}
              {activeTab === 'matches' && <AddMatchComponent onMatchAdded={fetchMatches} />}
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

        {/* Content based on active tab */}
        {activeTab === 'teams' && (
          <>
            <AddTeamComponent onTeamAdded={fetchTeams} />
            <TeamListComponent teams={teams} onRefresh={fetchTeams} />
          </>
        )}

        {activeTab === 'matches' && (
          <>
            <AddMatchComponent onMatchAdded={fetchMatches} />
            <MatchListComponent matches={matches} onRefresh={fetchMatches} />
          </>
        )}
      </main>
    </div>
  );
}