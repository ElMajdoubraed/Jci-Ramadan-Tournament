'use client';
import Link from 'next/link';
import { IMatch, MatchStatus } from '@/models/Match';
import { ITeam } from '@/models/Team';

interface MatchCardProps {
  match: IMatch;
  showDate?: boolean;
}

export default function MatchCard({ match, showDate = false }: MatchCardProps) {
  const teamA = match.teamA as ITeam;
  const teamB = match.teamB as ITeam;
  
  return (
    <div 
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
}