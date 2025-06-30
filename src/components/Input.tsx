import { ReactNode } from "react";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
  type?: string;
}

export default function Input({
  value,
  onChange,
  placeholder,
  icon,
  className = "",
  type = "text",
}: InputProps) {
  return (
    <div className={`relative w-full ${className}`}>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`pl-${
          icon ? "10" : "4"
        } pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0fd354] focus:border-[#0fd354] text-gray-900 placeholder:text-gray-400 bg-white shadow-sm`}
      />
    </div>
  );
}
