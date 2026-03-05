"use client";

import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import { TimepickerUI, type ConfirmEventData } from "timepicker-ui";

interface TimePickerFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange" | "placeholder"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  clockType?: "12h" | "24h";
}

export default function TimePickerField({
  label,
  value,
  onChange,
  error,
  id,
  className = "",
  clockType = "12h",
  ...props
}: TimePickerFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);
  const [focused, setFocused] = useState(false);
  const [isSystemDark, setIsSystemDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (event: MediaQueryListEvent) => {
      setIsSystemDark(event.matches);
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleThemeChange);
      return () => media.removeEventListener("change", handleThemeChange);
    }

    media.addListener(handleThemeChange);
    return () => media.removeListener(handleThemeChange);
  }, []);

  useEffect(() => {
    if (!inputRef.current) return;

    const timepickerTheme = isSystemDark ? "dark" : "basic";

    const picker = new TimepickerUI(inputRef.current, {
      clock: { type: clockType },
      ui: { mobile: false, editable: false, theme: timepickerTheme },
      callbacks: {
        onConfirm: (data: ConfirmEventData) => {
          const hour = (data.hour ?? "").padStart(2, "0");
          const minutes = (data.minutes ?? "").padStart(2, "0");

          if (hour && minutes) {
            onChange(`${hour}:${minutes}`);
            return;
          }

          onChange(inputRef.current?.value ?? "");
        },
      },
    });

    picker.create();
    pickerRef.current = picker;

    return () => {
      picker.destroy({ keepInputValue: true });
      pickerRef.current = null;
    };
  }, [clockType, isSystemDark, onChange]);

  useEffect(() => {
    if (!pickerRef.current) return;
    if (!value) return;
    pickerRef.current.setValue(value, true);
  }, [value]);

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
          ref={inputRef}
          id={id}
          type="text"
          placeholder=" "
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className={`peer w-full rounded-xl border bg-transparent px-4 pt-5 pb-2 text-on-surface outline-none transition-colors ${borderColor}`}
          {...props}
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 transition-all peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs ${labelColor}`}
        >
          {label}
        </label>
      </div>
      {error && <span className="px-4 text-xs text-error">{error}</span>}
    </div>
  );
}
