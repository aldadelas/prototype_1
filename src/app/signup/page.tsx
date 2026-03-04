"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import PhoneNumberField from "@/components/ui/PhoneNumberField";
import Card from "@/components/ui/Card";
import { EyeIcon, EyeOffIcon, UserCircleIcon } from "@/components/icon";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredentials } from "@/lib/redux/features/auth/authSlice";

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");
  const [companyZipCode, setCompanyZipCode] = useState("");
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState<string>();
  const [companyEmail, setCompanyEmail] = useState("");
  const [adminFullName, setAdminFullName] = useState("");
  const [adminPhoneNumber, setAdminPhoneNumber] = useState<string>();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isMissingRequiredField =
      !companyName.trim() ||
      !companyCountry.trim() ||
      !companyZipCode.trim() ||
      !companyEmail.trim() ||
      !adminFullName.trim() ||
      !adminPhoneNumber ||
      !adminEmail.trim() ||
      !adminPassword.trim() ||
      !verifyPassword.trim();

    if (isMissingRequiredField) {
      setIsRegistered(false);
      setPasswordError("");
      return;
    }

    if (adminPassword !== verifyPassword) {
      setIsRegistered(false);
      setPasswordError("Verify password must match the password.");
      return;
    }

    setPasswordError("");
    dispatch(
      setCredentials({
        username: adminEmail.trim(),
        fullName: adminFullName.trim(),
        email: adminEmail.trim(),
        phoneNumber: adminPhoneNumber ?? "",
        companyName: companyName.trim(),
      }),
    );
    setIsRegistered(true);
    router.push("/home");
  };

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="p-1 text-on-surface-variant hover:text-on-surface"
      tabIndex={-1}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <EyeOffIcon className="h-5 w-5" />
      ) : (
        <EyeIcon className="h-5 w-5" />
      )}
    </button>
  );

  return (
    <div className="flex min-h-svh items-center justify-center bg-surface p-4">
      <Card className="w-full max-w-xl">
        <div className="flex h-48 items-center justify-center rounded-t-3xl bg-primary-container">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
            <UserCircleIcon className="h-10 w-10 text-on-primary" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8">
          <h1 className="text-center text-2xl font-medium text-on-surface">
            Sign Up
          </h1>
          <p className="text-center text-sm text-on-surface-variant">
            Create your company admin account
          </p>
          {isRegistered && (
            <p className="text-center text-sm text-primary">
              Account created for {adminEmail}
            </p>
          )}

          <div className="flex flex-col gap-4 rounded-2xl bg-surface-container p-4">
            <h2 className="text-sm font-semibold tracking-wide text-primary">
              Company Info
            </h2>
            <InputField
              id="company-name"
              label="Company Name"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            <InputField
              id="company-address"
              label="Company Address"
              type="text"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                id="company-country"
                label="Company Country"
                type="text"
                value={companyCountry}
                onChange={(e) => setCompanyCountry(e.target.value)}
                required
              />
              <InputField
                id="company-zip-code"
                label="Company Zip Code"
                type="text"
                value={companyZipCode}
                onChange={(e) => setCompanyZipCode(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PhoneNumberField
                id="company-phone-number"
                label="Company Phone Number"
                value={companyPhoneNumber}
                onChange={setCompanyPhoneNumber}
              />
              <InputField
                id="company-email"
                label="Company Email"
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl bg-surface-container p-4">
            <h2 className="text-sm font-semibold tracking-wide text-primary">
              Admin Info
            </h2>
            <InputField
              id="admin-full-name"
              label="Admin Full Name"
              type="text"
              value={adminFullName}
              onChange={(e) => setAdminFullName(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PhoneNumberField
                id="admin-phone-number"
                label="Admin Phone Number"
                value={adminPhoneNumber}
                onChange={setAdminPhoneNumber}
                required
              />
              <InputField
                id="admin-email"
                label="Admin Email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                id="admin-password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                trailing={passwordToggle}
                required
              />
              <InputField
                id="verify-password"
                label="Verify Password"
                type={showPassword ? "text" : "password"}
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                trailing={passwordToggle}
                error={passwordError}
                required
              />
            </div>
          </div>

          <Button type="submit" fullWidth className="mt-2 h-12">
            Create Account
          </Button>

          <p className="text-center text-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link href="/" className="font-medium text-primary">
              Sign In
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
