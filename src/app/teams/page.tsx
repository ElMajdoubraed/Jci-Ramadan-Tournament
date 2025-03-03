'use client';
import { useState } from 'react';

// Define TypeScript interfaces for our data structures
interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
}

interface TeamStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

interface Team {
  id: number;
  name: string;
  group: string;
  logo: string;
  color: string;
  captain: string;
  players: Player[];
  stats: TeamStats;
}

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

// Player Card Component
const PlayerCard = ({ player }: { player: Player }) => (
  <div className="border border-gray-100 rounded-lg p-3 flex items-center hover:bg-gray-50">
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold mr-3">
      {player.number}
    </div>
    <div>
      <div className="font-medium">{player.name}</div>
      <div className="text-xs text-gray-500">{getPositionFullName(player.position)}</div>
    </div>
  </div>
);

// Players Tab Component
const PlayersTab = ({ players }: { players: Player[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {players.map(player => (
      <PlayerCard key={player.id} player={player} />
    ))}
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
const StatsTab = ({ stats }: { stats: TeamStats }) => {
  const goalDifference = stats.goalsFor - stats.goalsAgainst;
  const isPositive = goalDifference > 0;
  const isNegative = goalDifference < 0;
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard 
          label="Matches Played" 
          value={stats.played} 
        />
        <StatCard 
          label="Win Rate" 
          value={`${Math.round((stats.won / stats.played) * 100)}%`} 
        />
        <StatCard 
          label="Goals Per Game" 
          value={(stats.goalsFor / stats.played).toFixed(1)} 
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
const TeamDetail = ({ team, onBack }: { team: Team; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'players' | 'stats'>('players');
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`bg-${team.color}-600 p-4 flex justify-between items-center text-white`}>
        <button 
          onClick={onBack}
          className="bg-white bg-opacity-20 rounded-full p-1 hover:bg-opacity-30 transition-all"
        >
          ←
        </button>
        <h3 className="text-xl font-bold flex items-center">
          <span className="text-2xl mr-2">{team.logo}</span>
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
            </div>
            <div>
              <div className="text-sm text-gray-500">Captain</div>
              <div className="font-medium">{team.captain}</div>
            </div>
          </div>
          
          <div className="flex space-x-2 text-sm">
            <div className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md">
              <span className="font-medium">{team.stats.won}</span> W
            </div>
            <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md">
              <span className="font-medium">{team.stats.drawn}</span> D
            </div>
            <div className="px-2 py-1 bg-red-100 text-red-800 rounded-md">
              <span className="font-medium">{team.stats.lost}</span> L
            </div>
            <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
              <span className="font-medium">{team.stats.goalsFor}</span> GF
            </div>
          </div>
        </div>
        
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'players' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('players')}
          >
            Players
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'stats' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </div>
        
        {activeTab === 'players' ? (
          <PlayersTab players={team.players} />
        ) : (
          <StatsTab stats={team.stats} />
        )}
      </div>
    </div>
  );
};

// Team List Item Component
const TeamListItem = ({ team, onSelect }: { team: Team; onSelect: () => void }) => (
  <div 
    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
    onClick={onSelect}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full bg-${team.color}-100 text-${team.color}-600 flex items-center justify-center font-bold text-lg mr-3`}>
          {team.logo}
        </div>
        <div>
          <div className="font-medium">{team.name}</div>
          <div className="text-xs text-gray-500">Captain: {team.captain}</div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="text-xs bg-gray-100 rounded-full px-2 py-1 mr-2">
          {team.players.length} players
        </div>
        <div className="text-emerald-600">→</div>
      </div>
    </div>
  </div>
);

// Group Component
const GroupTeams = ({ group, teams, onSelectTeam }: { group: string; teams: Team[]; onSelectTeam: (team: Team) => void }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-emerald-600 p-3">
      <h3 className="text-lg font-bold text-white">Group {group}</h3>
    </div>
    
    <div className="divide-y divide-gray-100">
      {teams.map(team => (
        <TeamListItem 
          key={team.id} 
          team={team} 
          onSelect={() => onSelectTeam(team)}
        />
      ))}
    </div>
  </div>
);

// Teams List Component
const TeamsList = ({ groupedTeams, onSelectTeam }: { groupedTeams: Record<string, Team[]>; onSelectTeam: (team: Team) => void }) => (
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
  // Sample team data with groups, players, and stats
  const teamsData: Team[] = [
    {
      id: 1,
      name: 'Al Barakah',
      group: 'A',
      logo: '⚽',
      color: 'emerald',
      captain: 'Ahmed Hassan',
      players: [
        { id: 1, name: 'Ahmed Hassan', position: 'FW', number: 10 },
        { id: 2, name: 'Mahmoud Ibrahim', position: 'MF', number: 8 },
        { id: 3, name: 'Khalid Ali', position: 'DF', number: 4 },
        { id: 4, name: 'Omar Samir', position: 'GK', number: 1 },
        { id: 5, name: 'Hamza Karim', position: 'MF', number: 6 }
      ],
      stats: { played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 7, goalsAgainst: 3 }
    },
    {
      id: 2,
      name: 'Al Fursan',
      group: 'A',
      logo: '⚽',
      color: 'sky',
      captain: 'Yasir Mohammed',
      players: [
        { id: 1, name: 'Yasir Mohammed', position: 'MF', number: 7 },
        { id: 2, name: 'Tariq Nabil', position: 'FW', number: 9 },
        { id: 3, name: 'Faris Ziad', position: 'DF', number: 3 },
        { id: 4, name: 'Malik Qasim', position: 'GK', number: 1 },
        { id: 5, name: 'Bilal Hasan', position: 'MF', number: 11 }
      ],
      stats: { played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 4, goalsAgainst: 5 }
    },
    {
      id: 3,
      name: 'Al Najm',
      group: 'B',
      logo: '⚽',
      color: 'amber',
      captain: 'Jamal Rashid',
      players: [
        { id: 1, name: 'Jamal Rashid', position: 'FW', number: 10 },
        { id: 2, name: 'Karim Farouk', position: 'MF', number: 8 },
        { id: 3, name: 'Zain Amir', position: 'DF', number: 5 },
        { id: 4, name: 'Saeed Nasir', position: 'GK', number: 1 },
        { id: 5, name: 'Adel Hakim', position: 'DF', number: 2 }
      ],
      stats: { played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 5, goalsAgainst: 4 }
    },
    {
      id: 4,
      name: 'Al Sakhr',
      group: 'B',
      logo: '⚽',
      color: 'indigo',
      captain: 'Waleed Tarek',
      players: [
        { id: 1, name: 'Waleed Tarek', position: 'MF', number: 6 },
        { id: 2, name: 'Hisham Fahmy', position: 'FW', number: 9 },
        { id: 3, name: 'Rami Majid', position: 'DF', number: 4 },
        { id: 4, name: 'Akram Noor', position: 'GK', number: 1 },
        { id: 5, name: 'Sami Jalal', position: 'MF', number: 7 }
      ],
      stats: { played: 3, won: 0, drawn: 2, lost: 1, goalsFor: 2, goalsAgainst: 3 }
    }
  ];

  // Group teams by their group
  const groupedTeams: Record<string, Team[]> = teamsData.reduce((acc: Record<string, Team[]>, team: Team) => {
    if (!acc[team.group]) {
      acc[team.group] = [];
    }
    acc[team.group].push(team);
    return acc;
  }, {});

  // State for selected team to view details
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  return (
    <div className="space-y-6">
      <TournamentHeader 
        teamsCount={teamsData.length} 
        groupsCount={Object.keys(groupedTeams).length} 
      />

      {selectedTeam ? (
        <TeamDetail 
          team={selectedTeam} 
          onBack={() => setSelectedTeam(null)} 
        />
      ) : (
        <TeamsList 
          groupedTeams={groupedTeams} 
          onSelectTeam={setSelectedTeam} 
        />
      )}
    </div>
  );
}

export default AllTeams;