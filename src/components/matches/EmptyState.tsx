export default function EmptyState() {
  return (
    <div className="bg-gray-50 p-4 sm:p-8 rounded-lg text-center">
      <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">⚽</div>
      <h3 className="text-lg sm:text-xl font-medium text-gray-700">Aucun match programmé</h3>
      <p className="text-sm sm:text-base text-gray-500 mt-2">Il n'y a pas de matchs programmés pour cette date.</p>
    </div>
  );
}