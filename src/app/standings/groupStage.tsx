'use client';

function GroupStage() {
  // Enhanced data structure with more statistics
  const groups = [
    { 
      name: 'Group A', 
      teams: [
        { name: 'Team 1', played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 7, goalsAgainst: 3, points: 6 },
        { name: 'Team 2', played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 4, goalsAgainst: 5, points: 3 },
        { name: 'Team 5', played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 2, points: 4 },
        { name: 'Team 6', played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 5, points: 1 }
      ] 
    },
    { 
      name: 'Group B', 
      teams: [
        { name: 'Team 3', played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 5, goalsAgainst: 4, points: 4 },
        { name: 'Team 4', played: 3, won: 0, drawn: 2, lost: 1, goalsFor: 2, goalsAgainst: 3, points: 2 },
        { name: 'Team 7', played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 6, goalsAgainst: 2, points: 6 },
        { name: 'Team 8', played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 7, points: 4 }
      ] 
    },
  ];
  
  // Sort teams by points (highest first)
  const sortedGroups = groups.map(group => ({
    ...group,
    teams: [...group.teams].sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points;
      const aGoalDiff = a.goalsFor - a.goalsAgainst;
      const bGoalDiff = b.goalsFor - b.goalsAgainst;
      return bGoalDiff - aGoalDiff;
    })
  }));

  // Calculate qualifying positions (top 2 teams qualify)
  const getPositionClass = (index: number) => {
    if (index < 2) return "border-l-4 border-emerald-500"; // Qualifying positions
    return ""; // Non-qualifying positions
  };

  return (
    <div className="grid sm:grid-cols-2 gap-6 w-full max-w-6xl mx-auto px-3">
      {sortedGroups.map((group) => (
        <div key={group.name} className="overflow-hidden bg-white rounded-lg shadow-md">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-3">
            <h3 className="text-lg sm:text-xl font-bold text-white">{group.name}</h3>
          </div>
          
          {/* Desktop Table header - hidden on very small screens */}
          <div className="hidden xs:grid px-3 sm:px-4 py-2 sm:py-3 bg-emerald-50 text-2xs xs:text-xs text-emerald-800 font-medium grid-cols-12 gap-1">
            <div className="col-span-4">Team</div>
            <div className="col-span-1 text-center">P</div>
            <div className="col-span-1 text-center">W</div>
            <div className="col-span-1 text-center">D</div>
            <div className="col-span-1 text-center">L</div>
            <div className="col-span-1 text-center">GF</div>
            <div className="col-span-1 text-center">GA</div>
            <div className="col-span-1 text-center">GD</div>
            <div className="col-span-1 text-center font-bold">Pts</div>
          </div>
          
          {/* Mobile view - compact table with only essential info */}
          <div className="xs:hidden px-3 py-2 bg-emerald-50 text-2xs font-medium grid grid-cols-8 gap-1">
            <div className="col-span-4">Team</div>
            <div className="col-span-1 text-center">P</div>
            <div className="col-span-1 text-center">GD</div>
            <div className="col-span-2 text-center font-bold">Pts</div>
          </div>
          
          {/* Team rows - Desktop view */}
          <div className="divide-y divide-gray-100">
            {group.teams.map((team, index) => {
              const goalDifference = team.goalsFor - team.goalsAgainst;
              const isQualifying = index < 2;
              
              return (
                <div key={team.name}>
                  {/* Desktop view */}
                  <div 
                    className={`hidden xs:grid px-3 sm:px-4 py-2 sm:py-3 grid-cols-12 gap-1 items-center hover:bg-gray-50 ${getPositionClass(index)}`}
                  >
                    <div className="col-span-4 font-medium flex items-center">
                      <span className="inline-block w-5 text-center mr-2 text-2xs xs:text-xs text-gray-500">{index + 1}</span>
                      <span className={`truncate ${isQualifying ? "text-emerald-700" : ""}`}>{team.name}</span>
                      {index === 0 && <span className="ml-2 text-2xs xs:text-xs bg-emerald-100 text-emerald-800 px-1 rounded">Leader</span>}
                    </div>
                    <div className="col-span-1 text-center text-2xs xs:text-xs">{team.played}</div>
                    <div className="col-span-1 text-center text-2xs xs:text-xs">{team.won}</div>
                    <div className="col-span-1 text-center text-2xs xs:text-xs">{team.drawn}</div>
                    <div className="col-span-1 text-center text-2xs xs:text-xs">{team.lost}</div>
                    <div className="col-span-1 text-center text-2xs xs:text-xs">{team.goalsFor}</div>
                    <div className="col-span-1 text-center text-2xs xs:text-xs">{team.goalsAgainst}</div>
                    <div className="col-span-1 text-center font-medium text-2xs xs:text-xs">
                      <span className={
                        goalDifference > 0 ? "text-emerald-600" : 
                        goalDifference < 0 ? "text-red-600" : "text-gray-600"
                      }>
                        {goalDifference > 0 ? "+" : ""}{goalDifference}
                      </span>
                    </div>
                    <div className="col-span-1 text-center font-bold text-2xs xs:text-xs">{team.points}</div>
                  </div>
                  
                  {/* Mobile view - compact */}
                  <div 
                    className={`xs:hidden px-3 py-2 grid grid-cols-8 gap-1 items-center hover:bg-gray-50 ${getPositionClass(index)}`}
                  >
                    <div className="col-span-4 font-medium flex items-center overflow-hidden">
                      <span className="inline-block w-4 text-center mr-1 text-2xs text-gray-500">{index + 1}</span>
                      <span className={`truncate ${isQualifying ? "text-emerald-700" : ""}`}>{team.name}</span>
                    </div>
                    <div className="col-span-1 text-center text-2xs">{team.played}</div>
                    <div className="col-span-1 text-center text-2xs">
                      <span className={
                        goalDifference > 0 ? "text-emerald-600" : 
                        goalDifference < 0 ? "text-red-600" : "text-gray-600"
                      }>
                        {goalDifference > 0 ? "+" : ""}{goalDifference}
                      </span>
                    </div>
                    <div className="col-span-2 text-center font-bold text-2xs">{team.points}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="px-3 sm:px-4 py-2 bg-gray-50 text-2xs xs:text-xs text-gray-500 border-t border-gray-100">
            <div className="flex items-center">
              <span className="inline-block w-2 sm:w-3 h-2 sm:h-3 bg-emerald-500 mr-1"></span>
              <span>Qualification zone</span>
            </div>
          </div>
        </div>
      ))}
      
      {/* Legend for abbreviations */}
      <div className="sm:col-span-2 bg-white p-3 rounded-lg shadow text-2xs xs:text-xs sm:text-sm text-gray-600 flex flex-wrap gap-x-3 sm:gap-x-6 gap-y-1 sm:gap-y-2 justify-center sm:justify-start">
        <span><strong>P</strong>: Played</span>
        <span><strong>W</strong>: Won</span>
        <span><strong>D</strong>: Drawn</span>
        <span><strong>L</strong>: Lost</span>
        <span><strong>GF</strong>: Goals For</span>
        <span><strong>GA</strong>: Goals Against</span>
        <span><strong>GD</strong>: Goal Difference</span>
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