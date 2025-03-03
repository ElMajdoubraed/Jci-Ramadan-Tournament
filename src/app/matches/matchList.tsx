'use client';

type Match = {
  id: string;
  time: string;
  teamA: string;
  teamB: string;
  group: string;
  status: 'upcoming' | 'live' | 'finished';
  scoreA?: number;
  scoreB?: number;
};

function MatchList({ date, showDate }: { date: Date, showDate?: boolean }) {
  // Sample matches data with status and scores
  const matches: Match[] = [
    { 
      id: '1',
      time: '14:00', 
      teamA: 'Team 1', 
      teamB: 'Team 2',
      group: 'Group A',
      status: 'finished',
      scoreA: 2,
      scoreB: 1
    },
    { 
      id: '2',
      time: '16:00', 
      teamA: 'Team 3', 
      teamB: 'Team 4',
      group: 'Group B',
      status: 'upcoming'
    },
    {
      id: '3',
      time: '18:30',
      teamA: 'Team 5',
      teamB: 'Team 6',
      group: 'Group A',
      status: 'live',
      scoreA: 1,
      scoreB: 1
    }
  ];

  // Check if there are matches on the selected date
  const hasMatches = matches.length > 0;

  return (
    <div>
      {
        showDate && (
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-emerald-700">
              Matches on {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </h2>
            <span className="text-sm bg-emerald-100 text-emerald-800 py-1 px-3 rounded-full whitespace-nowrap">
              {hasMatches ? `${matches.length} match${matches.length > 1 ? 'es' : ''}` : 'No matches'}
            </span>
        </div>
        )
      }

      {hasMatches ? (
        <div className="space-y-4">
          {matches.map((match, index) => (
            <div 
              key={index} 
              className="p-4 sm:p-5 bg-white border-l-4 border-emerald-500 shadow-md rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
                <div className="flex-1 flex items-center justify-center md:justify-end w-full md:w-auto">
                  <div className="text-center md:text-right mr-3">
                    <div className="font-semibold text-base sm:text-lg">{match.teamA}</div>
                    {match.status !== 'upcoming' && (
                      <div className="font-bold text-xl text-emerald-600">{match.scoreA}</div>
                    )}
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">
                    🏆
                  </div>
                </div>
                
                <div className="mx-2 sm:mx-6 flex flex-col items-center">
                  {match.status === 'live' && (
                    <div className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-semibold mb-1 animate-pulse">
                      LIVE
                    </div>
                  )}
                  <div className="text-gray-500 text-xs uppercase font-semibold">VS</div>
                </div>
                
                <div className="flex-1 flex items-center justify-center md:justify-start w-full md:w-auto">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">
                    🏆
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-base sm:text-lg">{match.teamB}</div>
                    {match.status !== 'upcoming' && (
                      <div className="font-bold text-xl text-emerald-600">{match.scoreB}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className={`py-1 px-3 rounded-full font-medium text-xs ${
                    match.status === 'upcoming' 
                      ? 'bg-emerald-50 text-emerald-800' 
                      : match.status === 'live'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {match.status === 'finished' ? 'Finished' : match.time}
                  </div>
                </div>
                <a 
                  href={`/matches/${match.id}`}
                  className="text-sm bg-white border border-emerald-500 text-emerald-600 py-1 px-4 rounded-full hover:bg-emerald-50 transition-colors"
                >
                  Details
                </a>
              </div>
              {
                showDate && (
                  <div className="text-xs text-gray-500 text-center mt-4">{match.group}</div>
                )
              }
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 sm:p-8 rounded-lg text-center">
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">⚽</div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-700">No matches scheduled</h3>
          <p className="text-sm sm:text-base text-gray-500 mt-2">There are no matches scheduled for this date.</p>
        </div>
      )}
    </div>
  );
}

export default MatchList;