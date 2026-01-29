export default function Loading() {
  return (
    <div className="min-h-[25vh] flex flex-col justify-center items-center animate-fadeIn">
      <div className="relative">
        <span className="loading loading-spinner loading-xl text-purple-600"></span>
        <div className="absolute inset-0 loading loading-spinner loading-xl text-blue-600 opacity-50 blur-sm"></div>
      </div>
      <p className="mt-6 text-lg font-medium bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Loading...
      </p>
    </div>
  );
}
