"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBarIcon,
  CogIcon,
  HomeIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Reports", href: "/report", icon: ChartBarIcon },
    { name: "Settings", href: "/settings", icon: CogIcon },
  ];

  return (
    <div className="h-screen flex flex-col justify-between py-5 px-4">
      {/* Logo Section */}
      <div>
        <div className="flex items-center justify-between mb-8">
          {isOpen ? (
            <Link href="/dashboard">
              <span className="text-xl font-bold" style={{ color: "#0fd354" }}>
                SaaS Dashboard
              </span>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#0fd354] flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-[#2d2856] transition-colors hidden lg:block"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <ChevronLeftIcon className="h-6 w-6" />
            ) : (
              <ChevronRightIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center ${
                  isOpen ? "px-4" : "justify-center"
                } py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#2d2856] text-[#0fd354]"
                    : "hover:bg-[#2d2856] text-white hover:text-white"
                }`}
                title={!isOpen ? item.name : undefined}
              >
                <item.icon
                  className={`h-6 w-6 flex-shrink-0 ${
                    isActive ? "text-[#0fd354]" : "text-white"
                  }`}
                />
                {isOpen && (
                  <span
                    className={
                      isActive ? "ml-3 text-[#0fd354]" : "ml-3 text-white"
                    }
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
