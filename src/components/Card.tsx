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
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`p-2 rounded-lg ${
            trend === "up" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          />
        </div>
        <span
          className={`text-sm font-medium ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {change}
        </span>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}
