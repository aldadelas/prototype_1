"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/features/auth/authSlice";

const sideNavMenus = [
  { label: "Dashboard", href: "/home" },
  { label: "Attendance", href: "/attendance" },
  { label: "Leave" },
  { label: "Employee Management" },
];

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    username,
    firstName,
    lastName,
    birthDate,
    jobTitle,
    email,
    phoneNumber,
    profilePhotoUrl,
    isAuthenticated,
    hydrated,
  } = useAppSelector((state) => state.auth);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktopViewport(desktop);
      if (desktop) {
        setIsMobileSidebarOpen(false);
      }
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
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        onToggleDesktop={() =>
          setIsDesktopSidebarCollapsed((prevCollapsed) => !prevCollapsed)
        }
        menus={sideNavMenus}
        activeMenu="Dashboard"
      />

      <main
        className={`w-full transition-all duration-200 ${
          isDesktopSidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        <Topbar
          title="Profile"
          userDisplayName={`${firstName} ${lastName}`.trim() || username || "User"}
          userEmail={email || "Logged in user"}
          profilePhotoUrl={profilePhotoUrl}
          onOpenSidebar={() => {
            if (isDesktopViewport) {
              setIsDesktopSidebarCollapsed((prevCollapsed) => !prevCollapsed);
            } else {
              setIsMobileSidebarOpen(true);
            }
          }}
          onLogout={handleLogout}
          profileHref="/profile"
        />

        <section className="p-8">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-on-surface">
                Profile Summary
              </h2>
              <Button
                type="button"
                variant="outlined"
                onClick={() => router.push("/profile/edit")}
              >
                Edit Profile
              </Button>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <img
                src={profilePhotoUrl || "https://i.pravatar.cc/100?img=12"}
                alt="Profile photo"
                className="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <p className="text-base font-semibold text-on-surface">
                  {`${firstName} ${lastName}`.trim() || username || "User"}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {jobTitle || "No job title"}
                </p>
                <p className="text-sm text-on-surface-variant">{email || "-"}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
              <p>
                <span className="font-medium text-on-surface">First Name:</span>{" "}
                {firstName || "-"}
              </p>
              <p>
                <span className="font-medium text-on-surface">Last Name:</span>{" "}
                {lastName || "-"}
              </p>
              <p>
                <span className="font-medium text-on-surface">Birth Date:</span>{" "}
                {birthDate || "-"}
              </p>
              <p>
                <span className="font-medium text-on-surface">Job Title:</span>{" "}
                {jobTitle || "-"}
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
        </section>
      </main>
    </div>
  );
}
