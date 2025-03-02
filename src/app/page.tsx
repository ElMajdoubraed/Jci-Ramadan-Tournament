"use client";
import { useState } from 'react';
import MatchesComponent from './matches/page';
import StandingsComponent from './standings/page';
import AllTeamsComponent from './teams/page';
import ResultsComponent from './results/page';

const tabs = [
  { name: 'Matches', component: Matches, icon: '⚽' },
  { name: 'Standings', component: Standings, icon: '🏆' },
  { name: 'All Teams', component: Teams, icon: '👥' },
  { name: 'Results', component: Results, icon: '📊' },
];

function App() {
  const [activeTab, setActiveTab] = useState('Matches');
  const ActiveComponent = tabs.find((tab) => tab.name === activeTab)?.component || Matches;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 text-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-emerald-100">
        <header className="p-6 bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center">
              <span className="mr-3 bg-white text-emerald-600 w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                ⚽
              </span>
              <span>
                <span className="text-amber-300">JCI</span> Ramadan Tournament
              </span>
            </h1>
            <div className="text-white text-opacity-80 text-sm hidden md:block">Ramadan 2025</div>
          </div>
        </header>
        
        <nav className="flex flex-wrap bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`flex-1 px-4 py-3 cursor-pointer transition-all duration-200 text-center md:text-base text-sm font-medium
                ${activeTab === tab.name 
                  ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'}`}
              onClick={() => setActiveTab(tab.name)}
            >
              <div className="flex flex-col md:flex-row items-center justify-center md:space-x-2">
                <span className="text-xl mb-1 md:mb-0">{tab.icon}</span>
                <span>{tab.name}</span>
              </div>
            </button>
          ))}
        </nav>
        
        <main className="p-4 md:p-6 bg-white min-h-[60vh]">
          <div className="bg-white rounded-lg p-2">
            <ActiveComponent />
          </div>
        </main>
        
        <footer className="p-4 text-center text-sm text-gray-500 bg-gray-50 border-t border-gray-100">
          © 2025 JCI Ramadan Football Tournament. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

function Matches() {
  return (
    <div className="text-center p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-emerald-700 mb-2">Upcoming Matches</h2>
        <p className="text-gray-600">View all scheduled matches of the tournament</p>
      </div>
      <MatchesComponent />
    </div>
  );
}

function Standings() {
  return (
    <div className="text-center p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-emerald-700 mb-2">Tournament Standings</h2>
        <p className="text-gray-600">Current rankings of all teams</p>
      </div>
      <StandingsComponent />
    </div>
  );
}

function Teams() {
  return (
    <div className="text-center p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-emerald-700 mb-2">All Teams</h2>
        <p className="text-gray-600">Participating teams and their players</p>
      </div>
      <AllTeamsComponent />
    </div>
  );
}

function Results() {
  return (
    <div className="text-center p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-emerald-700 mb-2">Match Results</h2>
        <p className="text-gray-600">Complete history of match outcomes</p>
      </div>
      <ResultsComponent />
    </div>
  );
}

export default App;