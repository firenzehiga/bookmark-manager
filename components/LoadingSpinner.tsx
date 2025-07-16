export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4 animate-spin" />
      <p className="text-gray-400 text-lg">Memuat bookmark...</p>
    </div>
  );
}
