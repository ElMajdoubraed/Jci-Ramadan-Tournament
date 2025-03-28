"use client";

export default function Header() {
  return (
    <header className="p-6 bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <span className="mr-3 bg-white text-emerald-600 w-10 h-10 rounded-full flex items-center justify-center shadow-md">
            ⚽
          </span>
          <span>
            <span className="text-amber-300">JCI</span> Tournoi Ramadan
          </span>
        </h1>
        <div className="text-white text-opacity-80 text-sm hidden md:block">Ramadan 2025</div>
      </div>
    </header>
  );
}