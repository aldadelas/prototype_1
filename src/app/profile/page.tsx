"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/features/auth/authSlice";

const sideNavMenus = [
  "Dashboard",
  "Attendance",
  "Leave",
  "Employee Management",
];

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    username,
    fullName,
    email,
    phoneNumber,
    companyName,
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
          title="Profile"
          userDisplayName={fullName || username || "User"}
          userEmail={email || "Logged in user"}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onLogout={handleLogout}
          profileHref="/profile"
        />

        <section className="p-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-on-surface">
                User Information
              </h2>
              <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
                <p>
                  <span className="font-medium text-on-surface">Full Name:</span>{" "}
                  {fullName || "-"}
                </p>
                <p>
                  <span className="font-medium text-on-surface">Username:</span>{" "}
                  {username || "-"}
                </p>
                <p>
                  <span className="font-medium text-on-surface">Email:</span>{" "}
                  {email || "-"}
                </p>
                <p>
                  <span className="font-medium text-on-surface">Phone:</span>{" "}
                  {phoneNumber || "-"}
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-on-surface">
                Company Information
              </h2>
              <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
                <p>
                  <span className="font-medium text-on-surface">Company:</span>{" "}
                  {companyName || "-"}
                </p>
                <p>
                  <span className="font-medium text-on-surface">Role:</span> Admin
                </p>
                <p>
                  <span className="font-medium text-on-surface">Status:</span>{" "}
                  Active
                </p>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
