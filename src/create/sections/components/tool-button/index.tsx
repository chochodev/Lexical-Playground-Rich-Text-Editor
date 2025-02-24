"use client";

import React, { useState } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  state?: boolean;
}

// :::::::::::::::: Button
const Button: React.FC<ButtonProps> = ({ icon, label, ...props }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        className={`rounded-md p-2 hover:bg-gray-200/60 ${props.state ? "shadow-sm shadow-gray-400 ring-1 ring-gray-400" : ""} ease-250 active:bg-gray-200`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        {...props}
      >
        {icon}
      </button>

      <div
        className={`absolute left-1/2 -translate-x-1/2 transform ${showTooltip ? "bottom-[calc(100%+0.5rem)] opacity-100" : "bottom-[100%] opacity-0"} ease-250 whitespace-nowrap rounded bg-gray-200 px-2 py-1 text-[0.625rem] text-gray-900 shadow-md`}
      >
        {label}
      </div>
    </div>
  );
};

// :::::::::::::::: Separator
const Separator: React.FC = () => (
  <div className="mx-[1rem] h-6 w-px bg-gray-300" />
);

export { Button, Separator };
