import { ReactNode } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import Loader from "./Loader";

interface CardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
  onAdd?: () => void;
  loading?: boolean;
}

export default function Card({
  title,
  value,
  change,
  trend,
  icon: Icon,
  onAdd,
  loading = false,
}: CardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8 border border-gray-100 relative">
      <div className="flex items-center justify-between mb-6 relative">
        <div
          className={`p-4 rounded-xl ${
            trend === "up" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <Icon
            className={`h-8 w-8 ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          />
        </div>
        {onAdd && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            aria-label={`Add to ${title}`}
            className="absolute -top-3 -right-5 p-2 z-10 pointer-events-auto transition not-draggable cursor-pointer hover:scale-110 hover:bg-gray-100 hover:rounded-full"
            type="button"
          >
            <PlusIcon
              className="h-7 w-7"
              style={{ color: "#16113a" }}
              strokeWidth={3}
            />
          </button>
        )}
      </div>
      <h3 className="text-gray-500 text-xl font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-extrabold text-gray-800 mt-1">
        {loading ? <Loader small /> : value}
      </p>
      <span
        className={`absolute bottom-9 right-4 text-lg font-semibold ${
          trend === "up" ? "text-green-600" : "text-red-600"
        }`}
      >
        {change}
      </span>
    </div>
  );
}
