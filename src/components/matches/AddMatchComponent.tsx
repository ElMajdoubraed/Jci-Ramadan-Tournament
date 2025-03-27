'use client';

import { useState, useEffect } from 'react';
import { ITeam } from '@/models/Team';
import { MatchPhase } from '@/models/Match';

interface AddMatchProps {
  onMatchAdded: () => void;
}

export default function AddMatchComponent({ onMatchAdded }: AddMatchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [phase, setPhase] = useState<MatchPhase>(MatchPhase.GROUP);

  useEffect(() => {
    // Récupérer les équipes pour le menu déroulant
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des équipes:', error);
      }
    };

    if (showForm) {
      fetchTeams();
    }
  }, [showForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (teamA === teamB) {
      alert('Les équipes doivent être différentes');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          time,
          teamA,
          teamB,
          phase,
        }),
      });

      if (response.ok) {
        // Réinitialiser le formulaire
        setDate('');
        setTime('');
        setTeamA('');
        setTeamB('');
        setPhase(MatchPhase.GROUP);
        setShowForm(false);
        onMatchAdded();
      } else {
        alert('Échec d\'ajout du match');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du match:', error);
      alert('Erreur lors de l\'ajout du match');
    } finally {
      setIsLoading(false);
    }
  };

  const getPhaseLabel = (p: MatchPhase): string => {
    switch(p) {
      case MatchPhase.GROUP: return 'Phase de Groupes';
      case MatchPhase.QUARTER: return 'Quarts de Finale';
      case MatchPhase.SEMI: return 'Demi-finales';
      case MatchPhase.FINAL: return 'Finale';
      default: return p;
    }
  };

  return (
    <div className="mb-6 w-full max-w-4xl mx-auto">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          <span className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Programmer un Nouveau Match
          </span>
        </button>
      ) : (
        <div className="rounded-xl border-2 border-indigo-100 bg-white p-6 shadow-2xl transition-all duration-300 hover:shadow-indigo-100">
          <h3 className="mb-6 text-2xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text">Programmer un Nouveau Match</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="group">
                <label className="mb-2 block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">Date du Match</label>
                <input
                  type="date"
                  value={date}
                  min="2025-03-20"
                  max="2025-03-30"
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-sm text-gray-800 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                  required
                />
              </div>
              
              <div className="group">
                <label className="mb-2 block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">Heure du Match</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-sm text-gray-800 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="relative group">
                <label className="mb-2 block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">Équipe A</label>
                <select
                  value={teamA}
                  onChange={(e) => setTeamA(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white p-3 pr-8 shadow-sm text-gray-800 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                  required
                >
                  <option value="">Sélectionner l'Équipe A</option>
                  {teams.map((team) => (
                    <option key={team._id as string} value={team._id as string}>
                      {team.name} (Groupe {team.group})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              
              <div className="relative group">
                <label className="mb-2 block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">Équipe B</label>
                <select
                  value={teamB}
                  onChange={(e) => setTeamB(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white p-3 pr-8 shadow-sm text-gray-800 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                  required
                >
                  <option value="">Sélectionner l'Équipe B</option>
                  {teams.map((team) => (
                    <option key={team._id as string} value={team._id as string}>
                      {team.name} (Groupe {team.group})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mb-6 relative group">
              <label className="mb-2 block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">Phase du Tournoi</label>
                              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value as MatchPhase)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white p-3 pr-8 shadow-sm text-gray-800 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                required
              >
                {Object.values(MatchPhase).map((p) => (
                  <option key={p} value={p}>
                    {getPhaseLabel(p)}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Programmer le Match
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 transition-all duration-200"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}