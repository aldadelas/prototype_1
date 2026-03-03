"use client";

import PhoneInput from "react-phone-number-input";

interface PhoneNumberFieldProps {
  id: string;
  label: string;
  value?: string;
  onChange: (value?: string) => void;
  required?: boolean;
  error?: string;
}

export default function PhoneNumberField({
  id,
  label,
  value,
  onChange,
  required = false,
  error,
}: PhoneNumberFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <PhoneInput
        id={id}
        international
        defaultCountry="ID"
        countryCallingCodeEditable={false}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={label}
        className="phone-input-root h-[54px] rounded-xl border border-outline bg-transparent px-4 text-on-surface transition-colors focus-within:border-2 focus-within:border-primary"
      />
      {error && <span className="px-1 text-xs text-error">{error}</span>}
    </div>
  );
}
