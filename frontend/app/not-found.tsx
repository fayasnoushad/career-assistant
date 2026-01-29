"use client";
export default function NotFoundPage() {
  return (
    <main className="flex flex-col justify-center items-center text-center animate-fadeIn">
      <div className="space-y-6">
        <div className="text-9xl">🔍</div>
        <h1 className="text-5xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-2xl text-base-content/70">Page not found</p>
        <p className="text-base text-base-content/50 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          className="btn btn-lg bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-6"
          onClick={() => (window.location.href = "/")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Go to Homepage
        </button>
      </div>
    </main>
  );
}
