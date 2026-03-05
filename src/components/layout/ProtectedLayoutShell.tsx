"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/features/auth/authSlice";

interface ProtectedLayoutShellProps {
  children: ReactNode;
}

const sideNavMenus = [
  { label: "Dashboard", href: "/home" },
  { label: "Attendance", href: "/attendance" },
  { label: "Leave", href: "/leave" },
  { label: "Employee Management" },
];

const isProtectedPath = (pathname: string) =>
  pathname === "/home" ||
  pathname === "/attendance" ||
  pathname === "/leave" ||
  pathname.startsWith("/leave/") ||
  pathname === "/profile" ||
  pathname.startsWith("/profile/");

export default function ProtectedLayoutShell({ children }: ProtectedLayoutShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { username, firstName, lastName, email, profilePhotoUrl, isAuthenticated, hydrated } =
    useAppSelector((state) => state.auth);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);

  const isProtected = isProtectedPath(pathname);

  useEffect(() => {
    if (!isProtected) return;

    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktopViewport(desktop);
      if (desktop) setIsMobileSidebarOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isProtected]);

  useEffect(() => {
    if (!isProtected) return;
    if (hydrated && !isAuthenticated) {
      router.replace("/");
    }
  }, [hydrated, isAuthenticated, isProtected, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const title = useMemo(() => {
    if (pathname === "/home") return "Home";
    if (pathname === "/attendance") return "Attendance";
    if (pathname === "/leave/request") return "Leave Request";
    if (pathname === "/leave") return "Leave";
    if (pathname === "/profile/edit") return "Edit Profile";
    if (pathname.startsWith("/profile")) return "Profile";
    return "Home";
  }, [pathname]);

  const activeMenu = useMemo(() => {
    if (pathname === "/attendance") return "Attendance";
    if (pathname === "/leave" || pathname.startsWith("/leave/")) return "Leave";
    return "Dashboard";
  }, [pathname]);

  if (!isProtected) return <>{children}</>;

  if (!hydrated) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface text-on-surface-variant">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-svh overflow-x-hidden bg-surface">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        onToggleDesktop={() => setIsDesktopSidebarCollapsed((prevCollapsed) => !prevCollapsed)}
        menus={sideNavMenus}
        activeMenu={activeMenu}
      />

      <main
        className={`w-full min-w-0 transition-all duration-200 ${
          isDesktopSidebarCollapsed
            ? "lg:ml-20 lg:w-[calc(100%-5rem)]"
            : "lg:ml-72 lg:w-[calc(100%-18rem)]"
        }`}
      >
        <Topbar
          title={title}
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

        {children}
      </main>
    </div>
  );
}
