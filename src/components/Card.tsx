import { ReactNode } from "react";

interface CardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
}

export default function Card({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: CardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
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
        <span
          className={`text-lg font-semibold ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {change}
        </span>
      </div>
      <h3 className="text-gray-500 text-xl font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-extrabold text-gray-800 mt-1">{value}</p>
    </div>
  );
}
