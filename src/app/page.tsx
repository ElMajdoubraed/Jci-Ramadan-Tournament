"use client";
import { useState } from 'react';
import MatchesComponent from './matches/page';
import StandingsComponent from './standings/page';

const tabs = [
  { name: 'Matches', component: Matches },
  { name: 'Standings', component: Standings },
  { name: 'All Teams', component: Teams },
  { name: 'Results', component: Results },
];

function App() {
  const [activeTab, setActiveTab] = useState('Matches');
  const ActiveComponent = tabs.find((tab) => tab.name === activeTab)?.component || Matches;

  return (
    <div className="min-h-screen bg-teal-50 text-teal-900 p-4">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg border border-amber-400">
        <header className="p-4 border-b border-amber-400">
          <h1 className="text-2xl font-bold text-sky-500">
            <span className='text-sky-400'>J</span>
            <span className='text-amber-500'>C</span>
            <span className='text-teal-400'>I</span>
            {" "} Ramadan Football Tournament</h1>
        </header>
        <nav className="flex flex-wrap justify-around p-2 bg-amber-50">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`px-4 py-2 cursor-pointer transition-all duration-300 ${activeTab === tab.name ? 'border-b-2 border-sky-500 text-sky-500' : 'text-amber-600 hover:text-teal-600'}`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
        <main className="p-4">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}

function Matches() {
  return <div className="text-center p-6 text-lg">
    <MatchesComponent />
  </div>;
}

function Standings() {
  return <div className="text-center p-6 text-lg">
    <StandingsComponent />
  </div>;
}

function Teams() {
  return <div className="text-center p-6 text-lg">🏃 List of teams and players.</div>;
}

function Results() {
  return <div className="text-center p-6 text-lg">📅 Match results and scores.</div>;
}

export default App;
