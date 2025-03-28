'use client';
import { useState, useEffect } from 'react';
import { IMatch } from '@/models/Match';
import { MatchCard, LoadingIndicator, EmptyState } from '@/components/matches';

type MatchListProps = {
  date: Date;
  showDate?: boolean;
  stage?: string;
};

export default function MatchList({ date, stage, showDate = false }: MatchListProps) {
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        // Format the date as ISO string and pass as query parameter
        const formattedDate = date.toISOString().split('T')[0];
        const request = stage ? `/api/matches?stage=${stage}` : `/api/matches?date=${formattedDate}`;
        const response = await fetch(request);
        
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }
        
        const data = await response.json();
        setMatches(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Unable to load matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [date, stage]);

  // Check if there are matches on the selected date
  const hasMatches = matches.length > 0;

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {showDate && (
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-emerald-700">
            Matchs du {date.toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' })}
          </h2>
          <span className="text-sm bg-emerald-100 text-emerald-800 py-1 px-3 rounded-full whitespace-nowrap">
            {hasMatches ? `${matches.length} match${matches.length > 1 ? 's' : ''}` : 'Aucun match'}
          </span>
        </div>
      )}

      {hasMatches ? (
        <div className="space-y-4">
          {matches.map((match) => (
            <MatchCard
              key={match._id as string}
              match={match}
              showDate={showDate}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}