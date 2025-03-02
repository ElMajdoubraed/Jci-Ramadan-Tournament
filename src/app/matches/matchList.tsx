'use client';

function MatchList({ date }: { date: Date }) {
    const matches = [
      { time: '14:00', teamA: 'Team 1', teamB: 'Team 2' },
      { time: '16:00', teamA: 'Team 3', teamB: 'Team 4' },
    ];
  
    return (
      <div className="mt-4">
        <h2 className="text-xl font-bold text-amber-600">Matches on {date.toDateString()}</h2>
        <div className="space-y-4 mt-2">
          {matches.map((match, index) => (
            <div key={index} className="p-4 bg-white shadow rounded-lg border border-teal-300">
              <div className="flex justify-between">
                <span className="text-teal-700">{match.teamA}</span>
                <span className="text-amber-500">{match.time}</span>
                <span className="text-teal-700">{match.teamB}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  export default MatchList;