'use client';
import { useState, useEffect } from 'react';
import { ITeam, TeamGroup } from '@/models/Team';

// Helper function to get position full name
const getPositionFullName = (position: string): string => {
  switch (position) {
    case 'GK': return 'Goalkeeper';
    case 'DF': return 'Defender';
    case 'MF': return 'Midfielder';
    case 'FW': return 'Forward';
    default: return position;
  }
};

// Header Component
const TournamentHeader = ({ teamsCount, groupsCount }: { teamsCount: number; groupsCount: number }) => (
  <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-4 rounded-lg shadow-md text-white">
    <h2 className="text-xl font-bold text-center">Tournament Teams</h2>
    <p className="text-emerald-100 text-sm text-center mt-1">
      {teamsCount} teams competing in {groupsCount} groups
    </p>
  </div>
);

// Stat Card Component
const StatCard = ({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm">
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className={`text-2xl font-bold ${highlight ? 'text-emerald-600' : ''}`}>
      {value}
    </div>
  </div>
);

// Stats Tab Component
const StatsTab = ({ team }: { team: ITeam }) => {
  const { groupStageDetails } = team;
  const goalDifference = groupStageDetails.goalsFor - groupStageDetails.goalsAgainst;
  const isPositive = goalDifference > 0;
  const isNegative = goalDifference < 0;
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard 
          label="Matches Played" 
          value={groupStageDetails.playedMatches} 
        />
        <StatCard 
          label="Win Rate" 
          value={groupStageDetails.playedMatches > 0 
            ? `${Math.round((groupStageDetails.wins / groupStageDetails.playedMatches) * 100)}%` 
            : '0%'} 
        />
        <StatCard 
          label="Goals Per Game" 
          value={groupStageDetails.playedMatches > 0 
            ? (groupStageDetails.goalsFor / groupStageDetails.playedMatches).toFixed(1) 
            : '0'} 
        />
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Goal Difference</div>
          <div className={`text-2xl font-bold ${
            isPositive ? 'text-emerald-600' : isNegative ? 'text-red-600' : ''
          }`}>
            {isPositive ? '+' : ''}{goalDifference}
          </div>
        </div>
      </div>
    </div>
  );
};

// Team Detail Component
const TeamDetail = ({ team, onBack }: { team: ITeam; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'stats'>('stats');
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
        <button 
          onClick={onBack}
          className="rounded-full p-2 hover:bg-opacity-30 transition-all"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h3 className="text-xl font-bold flex items-center">
          {team.name}
        </h3>
        <div className="bg-white text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
          Group {team.group}
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex items-center mb-2 md:mb-0">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-3">
            👤
              {/* {team.image ? (
                <img src={team.image} alt={team.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                '👤'
              )} */}
            </div>
            <div>
              <div className="text-sm text-gray-500">Captain</div>
              { team.captainName && <div className="font-medium">{team.captainName}</div> }
            </div>
          </div>
          
          <div className="flex space-x-2 text-sm">
            <div className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md">
              <span className="font-medium">{team.wins}</span> W
            </div>
            <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md">
              <span className="font-medium">{team.draws}</span> D
            </div>
            <div className="px-2 py-1 bg-red-100 text-red-800 rounded-md">
              <span className="font-medium">{team.losses}</span> L
            </div>
            <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
              <span className="font-medium">{team.goalsScored}</span> GF
            </div>
          </div>
        </div>
        
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className="px-4 py-2 font-medium text-sm text-emerald-600 border-b-2 border-emerald-500"
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </div>
        
        <StatsTab team={team} />
      </div>
    </div>
  );
};

// Team List Item Component
const TeamListItem = ({ team, onSelect }: { team: ITeam; onSelect: () => void }) => (
  <div 
    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
    onClick={onSelect}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg mr-3">
        ⚽
          {/* {team.image ? (
            <img src={team.image} alt={team.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            '⚽'
          )} */}
        </div>
        <div>
          <div className="font-medium">{team.name}</div>
          {team.captainName &&  <div className="text-xs text-gray-500">Captain: {team.captainName}</div>}
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="text-xs bg-gray-100 rounded-full px-2 py-1 mr-2">
          {team.groupStageDetails.points} pts
        </div>
        <div className="text-emerald-600">→</div>
      </div>
    </div>
  </div>
);

// Group Component
const GroupTeams = ({ group, teams, onSelectTeam }: { group: string; teams: ITeam[]; onSelectTeam: (team: ITeam) => void }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-emerald-600 p-3">
      <h3 className="text-lg font-bold text-white">Group {group}</h3>
    </div>
    
    <div className="divide-y divide-gray-100">
      {teams.map((team:any) => (
        <TeamListItem 
          key={team._id.toString()} 
          team={team} 
          onSelect={() => onSelectTeam(team)}
        />
      ))}
    </div>
  </div>
);

// Teams List Component
const TeamsList = ({ groupedTeams, onSelectTeam }: { groupedTeams: Record<string, ITeam[]>; onSelectTeam: (team: ITeam) => void }) => (
  <div className="grid md:grid-cols-2 gap-6">
    {Object.entries(groupedTeams).map(([group, teams]) => (
      <GroupTeams 
        key={group} 
        group={group} 
        teams={teams} 
        onSelectTeam={onSelectTeam} 
      />
    ))}
  </div>
);

// Main Component
function AllTeams() {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true);
        const response = await fetch('/api/teams');
        
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        
        const teamsData = await response.json();
        setTeams(teamsData);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  // Filter teams based on search query
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.captainName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group teams by their group
  const groupedTeams: Record<string, ITeam[]> = filteredTeams.reduce((acc: Record<string, ITeam[]>, team: ITeam) => {
    if (!acc[team.group]) {
      acc[team.group] = [];
    }
    acc[team.group].push(team);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TournamentHeader 
        teamsCount={teams.length} 
        groupsCount={Object.keys(groupedTeams).length} 
      />

      {selectedTeam ? (
        <TeamDetail 
          team={selectedTeam} 
          onBack={() => setSelectedTeam(null)} 
        />
      ) : (
        <>
          <div className="relative">
            <div className="absolute inset-y-0 left-1 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="search"
              className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Search teams or captains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {Object.keys(groupedTeams).length > 0 ? (
            <TeamsList 
              groupedTeams={groupedTeams} 
              onSelectTeam={setSelectedTeam} 
            />
          ) : searchQuery ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No teams found matching "{searchQuery}"</p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default AllTeams;