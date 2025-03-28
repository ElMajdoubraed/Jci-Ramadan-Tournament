export default function SponsorFooter() {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-sky-50 py-3 px-6 border-t border-emerald-100">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-600">Sponsorisé par:</div>
        <a 
          href="https://www.instagram.com/fadi_phone_pm" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:bg-emerald-50"
        >
          <img 
            src="/fedi-phone.jpg" 
            alt="Fedi Phone" 
            className="w-8 h-8 rounded-full object-cover border border-emerald-200"
          />
          <span className="font-medium text-gray-700">Fedi Phone</span>
          <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full">Partenaire Officiel</span>
        </a>
      </div>
    </div>
  );
}