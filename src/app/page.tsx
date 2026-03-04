"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import Card from "@/components/ui/Card";
import { EyeIcon, EyeOffIcon, UserCircleIcon } from "@/components/icon";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setCredentials } from "@/lib/redux/features/auth/authSlice";

const DUMMY_USER = {
  username: "demo@hrportal.com",
  password: "demo123",
  fullName: "Demo User",
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { username: loggedInUser, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setLoginError("Please fill username/email and password.");
      return;
    }

    const isDummyLogin =
      username.trim().toLowerCase() === DUMMY_USER.username &&
      password === DUMMY_USER.password;

    if (isDummyLogin) {
      dispatch(
        setCredentials({
          username: DUMMY_USER.username,
          fullName: DUMMY_USER.fullName,
          email: DUMMY_USER.username,
        }),
      );
      setLoginError("");
      router.push("/home");
      return;
    }

    dispatch(
      setCredentials({
        username: username.trim(),
        fullName: username.trim(),
        email: username.trim(),
      }),
    );
    setLoginError("");
    router.push("/home");
  };

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="p-1 text-on-surface-variant hover:text-on-surface"
      tabIndex={-1}
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
      <Card className="w-full max-w-sm">
        {/* Logo / Image area */}
        <div className="flex h-48 items-center justify-center rounded-t-3xl bg-primary-container">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
            <UserCircleIcon className="h-10 w-10 text-on-primary" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8">
          <h1 className="text-center text-2xl font-medium text-on-surface">
            Sign In
          </h1>
          <p className="text-center text-sm text-on-surface-variant">
            Enter your credentials to continue
          </p>
          <p className="rounded-xl bg-surface-container px-3 py-2 text-center text-xs text-on-surface-variant">
            Dummy account: <strong>demo@hrportal.com</strong> /{" "}
            <strong>demo123</strong>
          </p>
          {isAuthenticated && (
            <p className="text-center text-sm text-primary">
              Welcome back, {loggedInUser}
            </p>
          )}
          {loginError && (
            <p className="text-center text-sm text-error">{loginError}</p>
          )}

          <InputField
            id="username"
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <InputField
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            trailing={passwordToggle}
          />

          <Button type="submit" fullWidth className="mt-2 h-12">
            Sign In
          </Button>
          <Button
            type="button"
            variant="outlined"
            fullWidth
            onClick={() => {
              setUsername(DUMMY_USER.username);
              setPassword(DUMMY_USER.password);
              setLoginError("");
            }}
          >
            Use Dummy User
          </Button>

          <p className="text-center text-sm text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary">
              Sign Up
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
