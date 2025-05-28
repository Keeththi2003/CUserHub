import React from "react";

export const Button = ({
  label,
  onClick,
  type,
  className,
  varient = "primary",
}) => {
  const baseStyle = " py-2 px-5 rounded-md  ";
  const varients = {
    primary: "bg-orange-600 hover:bg-orange-800 text-white",
    secondary:
      "border-2  text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white",
  };
  return (
    <div>
      <button
        type={type}
        onClick={onClick}
        className={` ${className} ${baseStyle} ${varients[varient]}`}
      >
        {label}
      </button>
    </div>
  );
};
