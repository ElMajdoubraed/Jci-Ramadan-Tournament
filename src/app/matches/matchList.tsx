'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IMatch, MatchStatus } from '@/models/Match';
import { ITeam } from '@/models/Team';

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
        // Formater la date en chaîne ISO et la passer comme paramètre de requête
        const formattedDate = date.toISOString().split('T')[0];
        const request = stage ? `/api/matches?stage=${stage}` : `/api/matches?date=${formattedDate}`;
        const response = await fetch(request);
        
        if (!response.ok) {
          throw new Error('Échec de la récupération des matchs');
        }
        
        const data = await response.json();
        setMatches(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des matchs:', err);
        setError('Impossible de charger les matchs. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [date, stage]);

  // Vérifier s'il y a des matchs à la date sélectionnée
  const hasMatches = matches.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 spin-animation glow-effect">⚽</div>
      </div>
    );
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
          {matches.map((match, index) => {
            const teamA = match.teamA as ITeam;
            const teamB = match.teamB as ITeam;
            
            return (
              <div 
                key={`${match._id}-${index}`}
                className="p-4 sm:p-5 bg-white border-l-4 border-emerald-500 shadow-md rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
                  <div className="flex-1 flex items-center justify-center md:justify-end w-full md:w-auto">
                    <div className="text-center md:text-right mr-3">
                      <div className="font-semibold text-base sm:text-lg">{teamA.name}</div>
                      {match.status !== MatchStatus.COMING && (
                        <div className="font-bold text-xl text-emerald-600">{match.teamAScore}</div>
                      )}
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">
                    🏆
                      {/* {teamA.image ? (
                        <img 
                          src={teamA.image} 
                          alt={`Drapeau de ${teamA.name}`} 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        '🏆'
                      )} */}
                    </div>
                  </div>
                  
                  <div className="mx-2 sm:mx-6 flex flex-col items-center">
                    {match.status === MatchStatus.LIVE && (
                      <div className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-semibold mb-1 animate-pulse">
                        EN DIRECT
                      </div>
                    )}
                    <div className="text-gray-500 text-xs uppercase font-semibold">VS</div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center md:justify-start w-full md:w-auto">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">
                    🏆
                      {/* {teamB.image ? (
                        <img 
                          src={teamB.image} 
                          alt={`Drapeau de ${teamB.name}`} 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        '🏆'
                      )} */}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-base sm:text-lg">{teamB.name}</div>
                      {match.status !== MatchStatus.COMING && (
                        <div className="font-bold text-xl text-emerald-600">{match.teamBScore}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`py-1 px-3 rounded-full font-medium text-xs ${
                      match.status === MatchStatus.COMING 
                        ? 'bg-emerald-50 text-emerald-800' 
                        : match.status === MatchStatus.LIVE
                          ? 'bg-red-50 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {match.status === MatchStatus.FINISHED ? 'Terminé' : match.time}
                    </div>
                    <div className="text-xs text-gray-500">
                      {match.phase}
                    </div>
                  </div>
                  <Link 
                    href={`/matches/${match._id}`}
                    className="text-sm bg-white border border-emerald-500 text-emerald-600 py-1 px-4 rounded-full hover:bg-emerald-50 transition-colors"
                  >
                    Détails
                  </Link>
                </div>
                {showDate && (
                  <div className="text-xs text-gray-500 text-center mt-4">
                    {new Date(match.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 sm:p-8 rounded-lg text-center">
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 float-animation glow-effect">⚽</div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-700">Aucun match programmé</h3>
          <p className="text-sm sm:text-base text-gray-500 mt-2">Il n'y a pas de matchs programmés pour cette date.</p>
        </div>
      )}
    </div>
  );
}