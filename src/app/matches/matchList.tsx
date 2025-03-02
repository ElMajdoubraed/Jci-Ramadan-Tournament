'use client';

function MatchList({ date }: { date: Date }) {
  // Sample matches data
  const matches = [
    { 
      time: '14:00', 
      teamA: 'Team 1', 
      teamB: 'Team 2',
      group: 'Group A'
    },
    { 
      time: '16:00', 
      teamA: 'Team 3', 
      teamB: 'Team 4',
      group: 'Group B'
    },
  ];

  // Check if there are matches on the selected date
  const hasMatches = matches.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-emerald-700">
          Matches on {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </h2>
        <span className="text-sm bg-emerald-100 text-emerald-800 py-1 px-3 rounded-full">
          {hasMatches ? `${matches.length} match${matches.length > 1 ? 'es' : ''}` : 'No matches'}
        </span>
      </div>

      {hasMatches ? (
        <div className="space-y-4">
          {matches.map((match, index) => (
            <div 
              key={index} 
              className="p-5 bg-white border-l-4 border-emerald-500 shadow-md rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <div className="md:flex items-center justify-between">
                <div className="flex-1 flex items-center justify-end">
                  <div className="text-right mr-3">
                    <div className="font-semibold text-lg">{match.teamA}</div>
                  </div>
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">
                    🏆
                  </div>
                </div>
                
                <div className="mx-6 my-4 md:my-0 flex flex-col items-center">
                  <div className="bg-emerald-50 text-emerald-800 py-1 px-4 rounded-full font-medium text-sm">
                    {match.time}
                  </div>
                  <div className="mt-2 text-gray-500 text-xs uppercase font-semibold">VS</div>
                </div>
                
                <div className="flex-1 flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">
                    🏆
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-lg">{match.teamB}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="text-xs text-gray-500">{match.group}</div>
                <button className="text-sm bg-white border border-emerald-500 text-emerald-600 py-1 px-4 rounded-full hover:bg-emerald-50 transition-colors">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <div className="text-5xl mb-4">⚽</div>
          <h3 className="text-xl font-medium text-gray-700">No matches scheduled</h3>
          <p className="text-gray-500 mt-2">There are no matches scheduled for this date.</p>
        </div>
      )}
    </div>
  );
}

export default MatchList;