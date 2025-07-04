"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBarIcon,
  CogIcon,
  HomeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Reports", href: "/report", icon: ChartBarIcon },
    { name: "Exports", href: "/exports", icon: ArrowDownTrayIcon },
    { name: "Admin", href: "/admin", icon: CogIcon },
    { name: "Settings", href: "/settings", icon: CogIcon },
  ];

  return (
    <div className="h-screen flex flex-col justify-between w-64 px-4 py-5 transition-all duration-300">
      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#2d2856] text-[#0fd354]"
                  : "hover:bg-[#2d2856] text-white hover:text-white"
              }`}
              title={item.name}
            >
              <item.icon
                className={`h-6 w-6 flex-shrink-0 ${
                  isActive ? "text-[#0fd354]" : "text-white"
                }`}
              />
              <span
                className={isActive ? "ml-3 text-[#0fd354]" : "ml-3 text-white"}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
