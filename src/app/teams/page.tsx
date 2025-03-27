'use client';
import { useState, useEffect } from 'react';
import { ITeam, TeamGroup } from '@/models/Team';

// Fonction auxiliaire pour obtenir le nom complet du poste
const getPositionFullName = (position: string): string => {
  switch (position) {
    case 'GK': return 'Gardien';
    case 'DF': return 'Défenseur';
    case 'MF': return 'Milieu';
    case 'FW': return 'Attaquant';
    default: return position;
  }
};

// Composant d'en-tête du tournoi
const TournamentHeader = ({ teamsCount, groupsCount }: { teamsCount: number; groupsCount: number }) => (
  <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-4 rounded-lg shadow-md text-white">
    <h2 className="text-xl font-bold text-center">Équipes du Tournoi</h2>
    <p className="text-emerald-100 text-sm text-center mt-1">
      {teamsCount} équipes en compétition dans {groupsCount} groupes
    </p>
  </div>
);

// Composant Carte de Statistique
const StatCard = ({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm">
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className={`text-2xl font-bold ${highlight ? 'text-emerald-600' : ''}`}>
      {value}
    </div>
  </div>
);

// Composant Onglet de Statistiques
const StatsTab = ({ team }: { team: ITeam }) => {
  const { groupStageDetails } = team;
  const goalDifference = groupStageDetails.goalsFor - groupStageDetails.goalsAgainst;
  const isPositive = goalDifference > 0;
  const isNegative = goalDifference < 0;
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard 
          label="Matchs Joués" 
          value={groupStageDetails.playedMatches} 
        />
        <StatCard 
          label="Taux de Victoire" 
          value={groupStageDetails.playedMatches > 0 
            ? `${Math.round((groupStageDetails.wins / groupStageDetails.playedMatches) * 100)}%` 
            : '0%'} 
        />
        <StatCard 
          label="Buts Par Match" 
          value={groupStageDetails.playedMatches > 0 
            ? (groupStageDetails.goalsFor / groupStageDetails.playedMatches).toFixed(1) 
            : '0'} 
        />
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Différence de Buts</div>
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

// Composant Détail d'Équipe
const TeamDetail = ({ team, onBack }: { team: ITeam; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'matches'>('stats');
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Récupérer les matchs de l'équipe lorsque l'ID de l'équipe est disponible
  useEffect(() => {
    async function fetchTeamMatches() {
      if (!team || !team._id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/teams/${team._id}/matches`);
        
        if (!response.ok) {
          throw new Error('Échec de récupération des matchs de l\'équipe');
        }
        
        const matchesData = await response.json();
        setMatches(matchesData);
      } catch (err) {
        console.error('Erreur lors de la récupération des matchs de l\'équipe:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTeamMatches();
  }, [team]);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
        <button 
          onClick={onBack}
          className="rounded-full p-2 hover:bg-opacity-30 transition-all"
          aria-label="Retour"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h3 className="text-xl font-bold flex items-center">
          {team.name}
        </h3>
        <div className="bg-white text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
          Groupe {team.group}
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
              <div className="text-sm text-gray-500">Capitaine</div>
              { team.captainName && <div className="font-medium">{team.captainName}</div> }
            </div>
          </div>
          
          <div className="flex space-x-2 text-sm">
            <div className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md">
              <span className="font-medium">{team.wins}</span> V
            </div>
            <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md">
              <span className="font-medium">{team.draws}</span> N
            </div>
            <div className="px-2 py-1 bg-red-100 text-red-800 rounded-md">
              <span className="font-medium">{team.losses}</span> D
            </div>
            <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
              <span className="font-medium">{team.goalsScored}</span> BM
            </div>
          </div>
        </div>
        
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'stats' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-500'}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistiques
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'matches' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-500'}`}
            onClick={() => setActiveTab('matches')}
          >
            Matchs
          </button>
        </div>
        
        {activeTab === 'stats' && <StatsTab team={team} />}
        {activeTab === 'matches' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
              </div>
            ) : matches.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {matches.map((match) => (
                  <div key={match._id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs text-gray-500">
                        {new Date(match.date).toLocaleDateString()} • {match.time}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${match.status === 'finished' ? 'bg-green-100 text-green-800' : match.status === 'live' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {match.status === 'finished' ? 'Terminé' : 
                         match.status === 'live' ? 'En Direct' : 'À Venir'}
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                      <div className="text-right flex-1">
                        <div className="font-semibold">{match.teamA.name}</div>
                        {match.status !== 'coming' && (
                          <div className="mt-1">
                            {match.teamAPlayerGoals && match.teamAPlayerGoals.map((scorer: string, idx: number) => (
                              <div key={idx} className="text-xs text-gray-500">{scorer}</div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-white py-2 px-4 rounded-lg shadow-sm">
                          <span className="text-lg font-bold">
                            {match.status !== 'coming' ? `${match.teamAScore} - ${match.teamBScore}` : 'vs'}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {match.phase === 'group' ? 'Phase de Groupes' : 
                           match.phase === 'quarter' ? 'Quarts de Finale' : 
                           match.phase === 'semi' ? 'Demi-finales' : 'Finale'}
                        </div>
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold">{match.teamB.name}</div>
                        {match.status !== 'coming' && (
                          <div className="mt-1">
                            {match.teamBPlayerGoals && match.teamBPlayerGoals.map((scorer: string, idx: number) => (
                              <div key={idx} className="text-xs text-gray-500">{scorer}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun match trouvé pour cette équipe
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant d'Élément de Liste d'Équipe
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
          {team.captainName &&  <div className="text-xs text-gray-500">Capitaine: {team.captainName}</div>}
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

// Composant Groupe
const GroupTeams = ({ group, teams, onSelectTeam }: { group: string; teams: ITeam[]; onSelectTeam: (team: ITeam) => void }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-emerald-600 p-3">
      <h3 className="text-lg font-bold text-white">Groupe {group}</h3>
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

// Composant Liste d'Équipes
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

// Composant Principal
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
          throw new Error('Échec de récupération des équipes');
        }
        
        const teamsData = await response.json();
        setTeams(teamsData);
      } catch (err) {
        console.error('Erreur lors de la récupération des équipes:', err);
        setError('Impossible de charger les équipes. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  // Filtrer les équipes en fonction de la requête de recherche
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.captainName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Regrouper les équipes par leur groupe
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
              placeholder="Rechercher équipes ou capitaines..."
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
              <p className="text-gray-500">Aucune équipe trouvée correspondant à "{searchQuery}"</p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default AllTeams;