"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AttendanceClockCard from "@/components/home/AttendanceClockCard";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
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
          title="Home"
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
        />

        <section className="p-4 sm:p-6 lg:p-8">
          <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4">
            <AttendanceClockCard
              userDisplayName={`${firstName} ${lastName}`.trim() || username || "User"}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
