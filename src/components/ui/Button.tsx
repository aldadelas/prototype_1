import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "filled" | "outlined" | "text" | "tonal";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  filled:
    "bg-primary text-on-primary shadow-sm hover:shadow-md active:shadow-none",
  outlined:
    "border border-outline text-primary bg-transparent hover:bg-primary/8 active:bg-primary/12",
  text: "text-primary bg-transparent hover:bg-primary/8 active:bg-primary/12",
  tonal:
    "bg-secondary-container text-on-secondary-container hover:shadow-sm active:shadow-none",
};

export default function Button({
  variant = "filled",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-38 ${variantStyles[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
