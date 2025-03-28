"use client";

interface NavTab {
  name: string;
  icon: string;
}

interface NavigationProps {
  tabs: NavTab[];
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

export default function Navigation({ tabs, activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="flex flex-wrap bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          className={`flex-1 px-4 py-3 cursor-pointer transition-all duration-200 text-center md:text-base text-sm font-medium
            ${activeTab === tab.name 
              ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'}`}
          onClick={() => onTabChange(tab.name)}
        >
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-2">
            <span className="text-xl mb-1 md:mb-0">{tab.icon}</span>
            <span>{tab.name}</span>
          </div>
        </button>
      ))}
    </nav>
  );
}