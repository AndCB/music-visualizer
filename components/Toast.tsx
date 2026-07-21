import React, { useEffect, useState } from "react";

export interface ToastMessage {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastProps {
  messages: ToastMessage[];
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ messages, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
      {messages.map((msg) => (
        <ToastItem key={msg.id} message={msg} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  message: ToastMessage;
  onDismiss: (id: number) => void;
}> = ({ message, onDismiss }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(message.id), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [message.id, onDismiss]);

  const bgColor =
    message.type === "error"
      ? "bg-red-500"
      : message.type === "success"
      ? "bg-green-500"
      : "bg-blue-500";

  const icon =
    message.type === "error" ? "✕" : message.type === "success" ? "✓" : "ℹ";

  return (
    <div
      className={`
        ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg
        flex items-center gap-3
        transition-all duration-300 ease-in-out
        ${exiting ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}
      `}
    >
      <span className="font-bold text-lg">{icon}</span>
      <p className="text-sm flex-1">{message.message}</p>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(() => onDismiss(message.id), 300);
        }}
        className="text-white/70 hover:text-white transition-colors"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
