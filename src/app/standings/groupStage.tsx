function GroupStage() {
    const groups = [
      { name: 'Group A', teams: [{ name: 'Team 1', points: 6 }, { name: 'Team 2', points: 3 }] },
      { name: 'Group B', teams: [{ name: 'Team 3', points: 4 }, { name: 'Team 4', points: 2 }] },
    ];
  
    return (
      <div className="mt-4">
        {groups.map((group) => (
          <div key={group.name} className="p-4 bg-white shadow rounded-lg border border-teal-300 mb-4">
            <h3 className="text-xl font-bold text-amber-600">{group.name}</h3>
            <ul>
              {group.teams.map((team) => (
                <li key={team.name} className="flex justify-between py-2 border-b border-amber-200">
                  <span>{team.name}</span>
                  <span>{team.points} pts</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  export default GroupStage;