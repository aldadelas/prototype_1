"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/features/auth/authSlice";

const sideNavMenus = [
  { label: "Dashboard", href: "/home" },
  { label: "Attendance" },
  { label: "Leave" },
  { label: "Employee Management" },
];

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    username,
    firstName,
    lastName,
    email,
    phoneNumber,
    companyName,
    profilePhotoUrl,
    isAuthenticated,
    hydrated,
  } = useAppSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/");
    }
  }, [hydrated, isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface text-on-surface-variant">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-surface">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        menus={sideNavMenus}
        activeMenu="Dashboard"
      />

      <main className="w-full">
        <Topbar
          title="Home"
          userDisplayName={`${firstName} ${lastName}`.trim() || username || "User"}
          userEmail={email || "Logged in user"}
          profilePhotoUrl={profilePhotoUrl}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onLogout={handleLogout}
        />

        <section className="p-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-on-surface">
              Welcome, {`${firstName} ${lastName}`.trim() || username || "User"}
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              This is your home page layout with top bar, profile dropdown, and
              side navigation.
            </p>
            <div className="mt-4 grid gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
              <p>
                <span className="font-medium text-on-surface">Email:</span>{" "}
                {email || "-"}
              </p>
              <p>
                <span className="font-medium text-on-surface">Phone:</span>{" "}
                {phoneNumber || "-"}
              </p>
              <p>
                <span className="font-medium text-on-surface">Company:</span>{" "}
                {companyName || "-"}
              </p>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
