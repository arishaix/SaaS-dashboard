import React from "react";
import { toast, ToastOptions } from "react-toastify";

interface ToastMessageProps {
  type: "success" | "error";
  message: string;
}

const iconStyles: React.CSSProperties = {
  width: 24,
  height: 24,
  marginRight: 12,
  flexShrink: 0,
};

const NAVBAR_BLUE = "#16113a";

const ToastMessage: React.FC<ToastMessageProps> = ({ type, message }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {type === "success" ? (
        <svg style={iconStyles} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill={NAVBAR_BLUE} />
          <path
            d="M7 13l3 3 7-7"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg style={iconStyles} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill={NAVBAR_BLUE} />
          <path
            d="M15 9l-6 6M9 9l6 6"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span style={{ fontWeight: 500 }}>{message}</span>
    </div>
  );
};

export default ToastMessage;

export function showToast(content: React.ReactNode, options?: ToastOptions) {
  if (typeof window !== "undefined") {
    const enabled = localStorage.getItem("notifications-enabled");
    if (enabled === null || enabled === "true") {
      toast(content, options);
    }
  }
}
