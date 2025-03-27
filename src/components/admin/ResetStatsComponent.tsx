'use client';

import { useState } from 'react';

interface ResetStatsProps {
  onComplete: () => void;
}

export default function ResetStatsComponent({ onComplete }: ResetStatsProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResetConfirmation = () => {
    setShowConfirmation(true);
  };

  const closeModal = () => {
    setShowConfirmation(false);
    // Si nous avons réussi, réinitialiser également l'état du composant
    if (status === 'success') {
      setStatus('idle');
      setProgress(0);
      setResults(null);
    }
  };

  const simulateProgress = () => {
    // Simuler une progression qui n'atteint jamais 100% jusqu'à ce que nous obtenions une réponse
    setProgress(5); // Commencer à 5%
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          // Rester à 90% jusqu'à ce que l'opération soit terminée
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 10; // Incrément aléatoire pour simuler une progression variable
      });
    }, 300);

    return interval;
  };

  const handleResetStats = async () => {
    setIsResetting(true);
    setStatus('processing');
    setError(null);
    setResults(null);
    
    // Commencer à simuler la progression
    const progressInterval = simulateProgress();
    
    try {
      const response = await fetch('/api/teams/reset-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      clearInterval(progressInterval); // Arrêter la simulation de progression
      
      if (response.ok) {
        const data = await response.json();
        setProgress(100);
        setStatus('success');
        setResults(data);
        onComplete(); // Actualiser les données parentes
      } else {
        const errorData = await response.json();
        setProgress(0);
        setStatus('error');
        setError(errorData.message || 'Échec de réinitialisation des statistiques');
      }
    } catch (error) {
      clearInterval(progressInterval); // Arrêter la simulation de progression
      console.error('Erreur lors de la réinitialisation des statistiques:', error);
      setProgress(0);
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Une erreur inattendue est survenue');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-red-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-red-50">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Réinitialiser les Statistiques</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Ceci réinitialisera toutes les statistiques des équipes et les recalculera en fonction des résultats des matchs.
                </p>
              </div>
            </div>
            <button
              onClick={handleResetConfirmation}
              disabled={isResetting}
              className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-all duration-200"
            >
              {isResetting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Réinitialiser
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmation */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Arrière-plan superposé */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={status !== 'processing' ? closeModal : undefined}
              aria-hidden="true"
            ></div>

            {/* Panneau modal */}
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  {status === 'idle' && (
                    <>
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Réinitialiser Toutes les Statistiques
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Êtes-vous sûr de vouloir réinitialiser toutes les statistiques des équipes ? Cette action va :
                          </p>
                          <ul className="mt-2 list-disc pl-5 text-sm text-gray-500">
                            <li>Réinitialiser tous les records de victoires/défaites/nuls</li>
                            <li>Réinitialiser toutes les statistiques de buts</li>
                            <li>Réinitialiser les points et classements de la phase de groupes</li>
                            <li>Recalculer toutes les statistiques en fonction des matchs terminés</li>
                          </ul>
                          <p className="mt-2 text-sm font-semibold text-red-600">
                            Cette opération peut prendre du temps. Ne quittez pas cette page pendant le traitement.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {status === 'processing' && (
                    <div className="w-full px-4 py-4">
                      <div className="text-center">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                          Réinitialisation des Statistiques en Cours
                        </h3>
                        <div className="flex justify-center mb-4">
                          <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          Réinitialisation des statistiques et recalcul basé sur l'historique des matchs.
                          Veuillez patienter, cela peut prendre un moment...
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {progress.toFixed(0)}% Terminé
                        </p>
                      </div>
                    </div>
                  )}

                  {status === 'success' && (
                    <div className="w-full px-4 py-4">
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
                          Réinitialisation Terminée
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Toutes les statistiques des équipes ont été réinitialisées et recalculées avec succès.
                        </p>
                        <div className="mb-4 max-h-40 overflow-y-auto rounded-md bg-gray-50 p-3 text-left">
                          <p className="text-xs text-gray-500 mb-2">Résumé de l'opération :</p>
                          <p className="text-xs font-medium text-gray-700">
                            {results?.results?.filter((r: any) => r.status === 'success').length || 0} équipes traitées avec succès
                          </p>
                          {results?.results?.some((r: any) => r.status === 'error') && (
                            <p className="text-xs font-medium text-red-700">
                              {results?.results?.filter((r: any) => r.status === 'error').length || 0} équipes ont rencontré des erreurs
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="w-full px-4 py-4">
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
                          Échec de l'Opération de Réinitialisation
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Une erreur s'est produite lors de la réinitialisation des statistiques.
                        </p>
                        {error && (
                          <div className="mb-4 rounded-md bg-red-50 p-3 text-left">
                            <p className="text-xs font-medium text-red-800">{error}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                {status === 'idle' && (
                  <>
                    <button
                      type="button"
                      onClick={handleResetStats}
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto"
                    >
                      Réinitialiser
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Annuler
                    </button>
                  </>
                )}

                {status === 'processing' && (
                  <button
                    type="button"
                    disabled
                    className="inline-flex w-full justify-center rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-500 shadow-sm sm:ml-3 sm:w-auto cursor-not-allowed"
                  >
                    Traitement en cours...
                  </button>
                )}

                {(status === 'success' || status === 'error') && (
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 sm:ml-3 sm:w-auto"
                  >
                    {status === 'success' ? 'Terminé' : 'Fermer'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}