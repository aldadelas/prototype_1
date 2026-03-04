"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AttendanceClockCard from "@/components/home/AttendanceClockCard";
import AttendanceHistoryCard from "@/components/home/AttendanceHistoryCard";
import type { AttendanceHistoryItem } from "@/components/home/attendanceTypes";
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

const generateDummyAttendanceHistory = (): AttendanceHistoryItem[] => {
  const dummyWorkingHours = [
    "08:35:12",
    "08:12:44",
    "07:58:30",
    "08:40:05",
    "08:03:27",
    "07:49:51",
    "08:21:16",
  ];

  return dummyWorkingHours.map((workingHour, index) => {
    const dateValue = new Date();
    dateValue.setDate(dateValue.getDate() - (index + 1));

    const clockInHour = 8 + (index % 2 === 0 ? 0 : 1);
    const clockInMinute = 5 + ((index * 7) % 20);
    const clockOutHour = 17 + (index % 3 === 0 ? 1 : 0);
    const clockOutMinute = 5 + ((index * 5) % 20);

    return {
      day: dateValue.toLocaleDateString("id-ID", { weekday: "long" }),
      date: dateValue.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      clockInTime: `${String(clockInHour).padStart(2, "0")}:${String(
        clockInMinute,
      ).padStart(2, "0")}:00`,
      clockOutTime: `${String(clockOutHour).padStart(2, "0")}:${String(
        clockOutMinute,
      ).padStart(2, "0")}:00`,
      workingHour,
    };
  });
};

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
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistoryItem[]>(
    generateDummyAttendanceHistory(),
  );

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

  const handleAttendanceRecorded = (item: AttendanceHistoryItem) => {
    setAttendanceHistory((prevHistory) => [item, ...prevHistory].slice(0, 7));
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

        <section className="flex flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-start lg:p-8">
          <div className="w-full md:h-[450px] md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4">
            <AttendanceClockCard
              userDisplayName={`${firstName} ${lastName}`.trim() || username || "User"}
              onAttendanceRecorded={handleAttendanceRecorded}
            />
          </div>
          <div className="w-full md:h-[450px] md:w-1/2 lg:w-1/2 xl:w-2/5 2xl:w-1/3">
            <AttendanceHistoryCard history={attendanceHistory} />
          </div>
        </section>
      </main>
    </div>
  );
}
