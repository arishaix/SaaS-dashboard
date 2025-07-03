import Topbar from "../components/Topbar";
import Link from "next/link";
import Button from "../components/Button";
import {
  ChartBarIcon,
  UsersIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <>
      <Topbar />
      {/* Hero Section: Full viewport height */}
      <section className="flex flex-col items-center justify-center h-[70vh] text-center px-4 sm:px-8">
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6"
          style={{ color: "#16113a" }}
        >
          SaaS Dashboard
        </h1>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-400">
          Your Business at a Glance
        </h2>
        <p className="text-xl sm:text-2xl md:text-3xl mb-10 text-gray-900">
          Custom dashboards for business insights.
        </p>
        <Link href="/signup">
          <Button
            variant="green"
            className="text-lg sm:text-xl md:text-2xl px-10 sm:px-12 py-4"
          >
            Get Started
          </Button>
        </Link>
      </section>
      {/* Feature Highlights Heading */}
      <h2
        className="text-2xl sm:text-5xl font-bold text-center mb-15 mt-0 px-4"
        style={{ color: "#16113a" }}
      >
        Feature Highlights
      </h2>
      {/* Feature Highlights Section: Scroll to see */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-14 md:gap-20 mb-20 mt-0 px-4">
        <div className="flex flex-col items-center p-10 sm:p-14 md:p-16 bg-white rounded-2xl shadow-lg border-2 border-gray-300 min-w-[340px]">
          <ChartBarIcon className="w-20 h-20 mb-7 text-gray-400" />
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Dynamic Analytics
          </h3>
          <p className="text-xl sm:text-2xl text-gray-500">
            Monitor your business metrics as they happen.
          </p>
        </div>
        <div className="flex flex-col items-center p-10 sm:p-14 md:p-16 bg-white rounded-2xl shadow-lg border-2 border-gray-300 min-w-[340px]">
          <UsersIcon className="w-20 h-20 mb-7 text-gray-400" />
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Multi-user Roles
          </h3>
          <p className="text-xl sm:text-2xl text-gray-500">
            Invite your team and manage permissions easily.
          </p>
        </div>
        <div className="flex flex-col items-center p-10 sm:p-14 md:p-16 bg-white rounded-2xl shadow-lg border-2 border-gray-300 min-w-[340px]">
          <PuzzlePieceIcon className="w-20 h-20 mb-7 text-gray-400" />
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Customizable Widgets
          </h3>
          <p className="text-xl sm:text-2xl text-gray-500">
            Personalize your dashboard with drag-and-drop widgets.
          </p>
        </div>
      </section>
      <footer className="w-full py-4 text-center text-gray-500 text-sm border-t border-gray-200 mt-auto px-4">
        Built for startups, managers, and teams. &nbsp;|&nbsp; ©️ 2025 SaaS
        Dashboard
      </footer>
    </>
  );
}
