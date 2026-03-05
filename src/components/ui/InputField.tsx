"use client";

import {
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
  label: string;
  error?: string;
  trailing?: ReactNode;
  rows?: number;
}

export default function InputField({
  label,
  error,
  trailing,
  rows = 3,
  id,
  className = "",
  ...props
}: InputFieldProps) {
  const { type, onFocus, onBlur, ...restProps } = props;
  const isTextarea = type === "textarea";
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
        {isTextarea ? (
          <textarea
            id={id}
            placeholder=" "
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e as never);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e as never);
            }}
            rows={rows}
            className={`peer w-full rounded-xl border bg-transparent px-4 pt-6 pb-3 text-on-surface outline-none transition-colors ${borderColor} min-h-24`}
            {...(restProps as unknown as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={id}
            type={type}
            placeholder=" "
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            className={`peer w-full rounded-xl border bg-transparent px-4 pt-5 pb-2 text-on-surface outline-none transition-colors ${borderColor} ${trailing ? "pr-12" : ""}`}
            {...restProps}
          />
        )}
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 transition-all peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs ${isTextarea ? "top-5 -translate-y-1/2" : "top-1/2 -translate-y-1/2"} ${labelColor}`}
        >
          {label}
        </label>
        {!isTextarea && trailing && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
      {error && <span className="px-4 text-xs text-error">{error}</span>}
    </div>
  );
}
