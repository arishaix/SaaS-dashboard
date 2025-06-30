import { ReactNode } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  className?: string;
  icon?: ReactNode;
}

export default function Select({
  value,
  onChange,
  options,
  className = "",
  icon,
}: SelectProps) {
  return (
    <div className={`relative w-full ${className}`}>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0fd354] focus:border-[#0fd354] text-gray-900 bg-white shadow-sm ${
          icon ? "pl-10" : ""
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
