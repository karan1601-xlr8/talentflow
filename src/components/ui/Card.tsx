import React from "react";
import type { CardProps } from "../../types";

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
}) => {
  const baseStyles =
    "h-full bg-white rounded-lg shadow-md border border-gray-200";

  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const cardClassName = `${baseStyles} ${paddingStyles[padding]} ${className}`;

  return <div className={cardClassName}>{children}</div>;
};

export default Card;
