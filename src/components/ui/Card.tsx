import { type HTMLAttributes } from "react";

type CardVariant = "elevated" | "filled" | "outlined";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantStyles: Record<CardVariant, string> = {
  elevated: "bg-surface-container-low shadow-md",
  filled: "bg-surface-container-highest",
  outlined: "border border-outline-variant bg-surface",
};

export default function Card({
  variant = "elevated",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-3xl ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
