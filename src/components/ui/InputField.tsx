"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";

interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
  label: string;
  error?: string;
  trailing?: ReactNode;
}

export default function InputField({
  label,
  error,
  trailing,
  id,
  className = "",
  ...props
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;

  const borderColor = hasError
    ? "border-error"
    : focused
      ? "border-primary border-2"
      : "border-outline";

  const labelColor = hasError
    ? "text-error"
    : focused
      ? "text-primary"
      : "text-on-surface-variant";

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="group relative">
        <input
          id={id}
          placeholder=" "
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className={`peer w-full rounded-xl border bg-transparent px-4 pt-5 pb-2 text-on-surface outline-none transition-colors ${borderColor} ${trailing ? "pr-12" : ""}`}
          {...props}
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 transition-all peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs ${labelColor}`}
        >
          {label}
        </label>
        {trailing && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
      {error && <span className="px-4 text-xs text-error">{error}</span>}
    </div>
  );
}
