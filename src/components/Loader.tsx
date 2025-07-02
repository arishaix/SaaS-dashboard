"use client";

export default function Loader({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center animate-fade-in${
        small ? "" : " min-h-screen"
      }`}
    >
      <svg
        className={`animate-spin ${
          small ? "h-6 w-6" : "h-12 w-12"
        } text-[#16113a] drop-shadow-lg`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-30"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
      </svg>
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease;
        }
      `}</style>
    </div>
  );
}
