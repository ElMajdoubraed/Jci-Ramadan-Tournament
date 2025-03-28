"use client";
import { useEffect, useRef, useState } from 'react';

export default function SponsorToast() {
  const [showSponsor, setShowSponsor] = useState(true);
  const [sponsorClosed, setSponsorClosed] = useState(false);
  const sponsorTimerRef = useRef(null);

  // Toggle sponsor visibility every 3 seconds if not closed
  useEffect(() => {
    if (sponsorClosed) return;
    
    const toggleSponsor = () => {
      if (!sponsorClosed) {
        setShowSponsor(prev => !prev);
      }
    };
    
    (sponsorTimerRef.current as any) = setInterval(toggleSponsor, 3000);
    
    return () => {
      if (sponsorTimerRef.current) {
        clearInterval(sponsorTimerRef.current);
      }
    };
  }, [sponsorClosed]);
  
  const handleCloseSponsor = () => {
    setShowSponsor(false);
    setSponsorClosed(true);
    if (sponsorTimerRef.current) {
      clearInterval(sponsorTimerRef.current);
    }
  };

  if (!showSponsor) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm animate-slide-in">
      <div className="bg-white rounded-lg shadow-lg border border-emerald-100 overflow-hidden">
        <div className="flex items-center p-3">
          <img 
            src="/fedi-phone.jpg" 
            alt="Fedi Phone Logo" 
            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100"
          />
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Sponsor Officiel</p>
              <button 
                onClick={handleCloseSponsor}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors -mr-1"
                aria-label="Fermer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <a 
              href="https://www.instagram.com/fadi_phone_pm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium flex items-center text-sm"
            >
              Fedi Phone
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-sky-500"></div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}