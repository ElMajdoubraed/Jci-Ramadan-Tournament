'use client';
import { useState, useEffect } from 'react';
import { ITeam, TeamGroup } from '@/models/Team';

function GroupStage() {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Group teams by their group
  const groupedTeams: Record<string, ITeam[]> = teams.reduce((acc: Record<string, ITeam[]>, team: ITeam) => {
    if (!acc[team.group]) {
      acc[team.group] = [];
    }
    acc[team.group].push(team);
    return acc;
  }, {});

  // Sort grouped teams by points
  const sortedGroups = Object.entries(groupedTeams).map(([groupName, groupTeams]) => {
    return {
      name: `Groupe ${groupName}`,
      teams: [...groupTeams].sort((a, b) => {
        // First sort by points
        if (a.groupStageDetails.points !== b.groupStageDetails.points) {
          return b.groupStageDetails.points - a.groupStageDetails.points;
        }
        
        // Then by goal difference
        const aGoalDiff = a.groupStageDetails.goalsFor - a.groupStageDetails.goalsAgainst;
        const bGoalDiff = b.groupStageDetails.goalsFor - b.groupStageDetails.goalsAgainst;
        
        if (aGoalDiff !== bGoalDiff) {
          return bGoalDiff - aGoalDiff;
        }
        
        // Finally by goals scored
        return b.groupStageDetails.goalsFor - a.groupStageDetails.goalsFor;
      })
    };
  }).sort((a, b) => a.name.localeCompare(b.name)); // Sort groups alphabetically

  // Calculate qualifying positions (top 2 teams qualify)
  const getPositionClass = (index: number) => {
    if (index < 2) return "border-l-4 border-emerald-500"; // Qualifying positions
    return ""; // Non-qualifying positions
  };

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-6xl mx-auto px-2 md:px-3">
      {sortedGroups.map((group) => (
        <div key={group.name} className="overflow-hidden bg-white rounded-lg shadow-md">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-2 md:p-3">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white text-center sm:text-left">{group.name}</h3>
          </div>
          
          {/* Desktop Table header - hidden on very small screens */}
          <div className="hidden xs:grid px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 bg-emerald-50 text-2xs xs:text-xs text-emerald-800 font-medium grid-cols-12 gap-1">
            <div className="col-span-4">Équipe</div>
            <div className="col-span-1 text-center">J</div>
            <div className="col-span-1 text-center">G</div>
            <div className="col-span-1 text-center">N</div>
            <div className="col-span-1 text-center">P</div>
            <div className="col-span-1 text-center">BP</div>
            <div className="col-span-1 text-center">BC</div>
            <div className="col-span-1 text-center">DB</div>
            <div className="col-span-1 text-center font-bold">Pts</div>
          </div>
          
          {/* Mobile view - compact table with only essential info */}
          <div className="xs:hidden px-2 py-1.5 bg-emerald-50 text-2xs font-medium grid grid-cols-8 gap-1">
            <div className="col-span-4">Équipe</div>
            <div className="col-span-1 text-center">J</div>
            <div className="col-span-1 text-center">DB</div>
            <div className="col-span-2 text-center font-bold">Pts</div>
          </div>
          
          {/* Team rows - Desktop view */}
          <div className="divide-y divide-gray-100">
            {group.teams.map((team, index) => {
              const details = team.groupStageDetails;
              const goalDifference = details.goalsFor - details.goalsAgainst;
              const isQualifying = index < 2;
              
              return (
                <div key={`${team.name}-${index}`}>
                  {/* Desktop view */}
                  <div 
                    className={`hidden xs:grid px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 grid-cols-12 gap-1 items-center hover:bg-gray-50 ${getPositionClass(index)}`}
                  >
                    <div className="col-span-4 font-medium flex items-center">
                      <span className="inline-block w-4 sm:w-5 text-center mr-1 sm:mr-2 text-2xs xs:text-xs text-gray-500">{index + 1}</span>
                      <span className={`truncate ${isQualifying ? "text-emerald-700" : ""}`}>{team.name}</span>
                      {index === 0 && <span className="ml-1 sm:ml-2 text-2xs xs:text-xs bg-emerald-100 text-emerald-800 px-1 rounded">Meneur</span>}
                    </div>
                    <div className="col-span-1 text-center text-2xs xs:text-xs">{details.playedMatches}</div>
                    <div className="col-span-1 text-center text-2xs xs:text-xs">{details.wins}</div>
                    <div className="col-span-1 text-center text-2xs xs:text-xs">{details.draws}</div>
                    <div className="col-span-1 text-center text-2xs xs:text-xs">{details.losses}</div>
                    <div className="col-span-1 text-center text-2xs xs:text-xs">{details.goalsFor}</div>
                    <div className="col-span-1 text-center text-2xs xs:text-xs">{details.goalsAgainst}</div>
                    <div className="col-span-1 text-center font-medium text-2xs xs:text-xs">
                      <span className={
                        goalDifference > 0 ? "text-emerald-600" : 
                        goalDifference < 0 ? "text-red-600" : "text-gray-600"
                      }>
                        {goalDifference > 0 ? "+" : ""}{goalDifference}
                      </span>
                    </div>
                    <div className="col-span-1 text-center font-bold text-2xs xs:text-xs">{details.points}</div>
                  </div>
                  
                  {/* Mobile view - compact */}
                  <div 
                    className={`xs:hidden px-2 py-1.5 grid grid-cols-8 gap-1 items-center hover:bg-gray-50 ${getPositionClass(index)}`}
                  >
                    <div className="col-span-4 font-medium flex items-center overflow-hidden">
                      <span className="inline-block w-3.5 text-center mr-1 text-2xs text-gray-500">{index + 1}</span>
                      <span className={`truncate ${isQualifying ? "text-emerald-700" : ""}`}>{team.name}</span>
                    </div>
                    <div className="col-span-1 text-center text-2xs">{details.playedMatches}</div>
                    <div className="col-span-1 text-center text-2xs">
                      <span className={
                        goalDifference > 0 ? "text-emerald-600" : 
                        goalDifference < 0 ? "text-red-600" : "text-gray-600"
                      }>
                        {goalDifference > 0 ? "+" : ""}{goalDifference}
                      </span>
                    </div>
                    <div className="col-span-2 text-center font-bold text-2xs">{details.points}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gray-50 text-2xs xs:text-xs text-gray-500 border-t border-gray-100">
            <div className="flex items-center">
              <span className="inline-block w-2 sm:w-3 h-2 sm:h-3 bg-emerald-500 mr-1"></span>
              <span>Zone de qualification</span>
            </div>
          </div>
        </div>
      ))}
      
      {/* Legend for abbreviations */}
      <div className="sm:col-span-2 bg-white p-2 md:p-3 rounded-lg shadow text-2xs xs:text-xs sm:text-sm text-gray-600 flex flex-wrap gap-x-2 sm:gap-x-3 md:gap-x-6 gap-y-1 sm:gap-y-2 justify-center sm:justify-start">
        <span><strong>J</strong>: Joués</span>
        <span><strong>G</strong>: Gagnés</span>
        <span><strong>N</strong>: Nuls</span>
        <span><strong>P</strong>: Perdus</span>
        <span><strong>BP</strong>: Buts Pour</span>
        <span><strong>BC</strong>: Buts Contre</span>
        <span><strong>DB</strong>: Différence de Buts</span>
        <span><strong>Pts</strong>: Points</span>
      </div>
    </div>
  );
}

// Add a custom breakpoint for extra small devices
const styles = `
  @media (min-width: 480px) {
    .xs\\:grid {
      display: grid;
    }
    .xs\\:hidden {
      display: none;
    }
    .xs\\:text-xs {
      font-size: 0.75rem;
      line-height: 1rem;
    }
  }
  
  .text-2xs {
    font-size: 0.65rem;
    line-height: 1rem;
  }
`;

function StyledGroupStage() {
  return (
    <>
      <style jsx global>{styles}</style>
      <GroupStage />
    </>
  );
}

export default StyledGroupStage;