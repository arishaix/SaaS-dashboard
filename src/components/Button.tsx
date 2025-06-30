import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "green" | "blue";
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = "green",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "px-8 py-2 rounded-full font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const color =
    variant === "green"
      ? "bg-[#0fd354] text-[#16113a] hover:bg-[#0fd354]/90 focus:ring-[#0fd354] border border-[#0fd354]"
      : "bg-transparent text-black border-2 border-black hover:bg-black hover:text-white focus:ring-black";
  return (
    <button className={`${base} ${color} ${className}`} {...props}>
      {children}
    </button>
  );
}
