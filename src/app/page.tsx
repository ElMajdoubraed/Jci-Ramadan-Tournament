"use client";
import { useState, useEffect } from 'react';
import MatchesComponent from './matches/page';
import StandingsComponent from './standings/page';
import AllTeamsComponent from './teams/page';
import ResultsComponent from './results/page';
import { 
  Header, 
  SponsorBanner, 
  Navigation, 
  SponsorFooter, 
  Footer,
  TabContent
} from '@/components/layout';

// Tab configuration
const tabs = [
  { name: 'Matchs', component: MatchesComponent, icon: '⚽' },
  { name: 'Classements', component: StandingsComponent, icon: '🏆' },
  { name: 'Équipes', component: AllTeamsComponent, icon: '👥' },
  { name: 'Résultats', component: ResultsComponent, icon: '📊' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Matchs');
  const [animationClass, setAnimationClass] = useState('');
  
  // Find the active component based on tab selection
  const ActiveComponent = tabs.find((tab) => tab.name === activeTab)?.component || tabs[0].component;

  // Add animation when tab changes
  useEffect(() => {
    setAnimationClass('page-transition-enter');
    const timer = setTimeout(() => {
      setAnimationClass('');
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Render tab content with title and subtitle if needed
  const renderTabContent = () => {
    if (activeTab === 'Résultats') {
      return (
        <TabContent 
          title="Résultats des Matchs"
          subtitle="Historique complet des résultats des matchs"
        >
          <ResultsComponent />
        </TabContent>
      );
    }
    
    return (
      <TabContent>
        <ActiveComponent />
      </TabContent>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 text-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-emerald-100">
        <Header />
        <SponsorBanner />
        <Navigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <main className="p-0 sm:p-6 bg-white min-h-[60vh]">
          <div className={`bg-white rounded-lg p-0 sm:p-2 ${animationClass}`} key={activeTab}>
            {renderTabContent()}
          </div>
        </main>
        
        <SponsorFooter />
        <Footer />
      </div>
    </div>
  );
}