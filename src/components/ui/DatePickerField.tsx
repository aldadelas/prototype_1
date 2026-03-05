"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
} from "react";
import { DayPicker } from "react-day-picker";

interface DatePickerFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange" | "placeholder"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const parseIsoDate = (value: string) => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
};

const formatIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function DatePickerField({
  label,
  value,
  onChange,
  error,
  id,
  className = "",
  disabled,
  ...props
}: DatePickerFieldProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const selectedDate = useMemo(() => parseIsoDate(value), [value]);
  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const hasError = !!error;
  const borderColor = hasError
    ? "border-error"
    : focused || isOpen
      ? "border-primary border-2"
      : "border-outline";
  const labelColor = hasError
    ? "text-error"
    : focused || isOpen
      ? "text-primary"
      : "text-on-surface-variant";

  const dayPickerStyle = {
    "--rdp-accent-color": "var(--md-primary)",
    "--rdp-accent-background-color": "var(--md-primary-container)",
    "--rdp-today-color": "var(--md-primary)",
    "--rdp-day_button-border-radius": "9999px",
    color: "var(--md-on-surface)",
  } as CSSProperties;

  return (
    <div className={`flex flex-col gap-1 ${className}`} ref={wrapperRef}>
      <div className="relative">
        <input
          id={id}
          type="text"
          readOnly
          value={displayValue}
          disabled={disabled}
          placeholder=" "
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          onClick={() => {
            if (!disabled) setIsOpen((prev) => !prev);
          }}
          className={`peer w-full rounded-xl border bg-transparent px-4 pt-5 pb-2 text-on-surface outline-none transition-colors ${borderColor} ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          {...props}
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 transition-all peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs ${labelColor}`}
        >
          {label}
        </label>
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 text-on-surface-variant hover:bg-surface-container"
          onClick={() => {
            if (!disabled) setIsOpen((prev) => !prev);
          }}
          aria-label="Toggle date picker"
          disabled={disabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 15H5V9h14v10z" />
          </svg>
        </button>
      </div>

      {isOpen && !disabled && (
        <div className="z-50 mt-2 flex justify-center rounded-xl border border-outline bg-surface p-2 shadow-md">
          <DayPicker
            className="mx-auto"
            style={dayPickerStyle}
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              onChange(formatIsoDate(date));
              setIsOpen(false);
            }}
            weekStartsOn={1}
          />
        </div>
      )}

      {error && <span className="px-4 text-xs text-error">{error}</span>}
    </div>
  );
}
