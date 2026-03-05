"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import type { AttendanceRow } from "@/components/attendance/attendanceTypes";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DatePickerField from "@/components/ui/DatePickerField";
import InputField from "@/components/ui/InputField";
import Modal from "@/components/ui/Modal";
import TimePickerField from "@/components/ui/TimePickerField";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/features/auth/authSlice";

type MonthlyAttendanceData = Record<string, AttendanceRow[]>;

const sideNavMenus = [
  { label: "Dashboard", href: "/home" },
  { label: "Attendance", href: "/attendance" },
  { label: "Leave" },
  { label: "Employee Management" },
];

const ATTENDANCE_STORAGE_KEY = "prototype-attendance";
const PAGE_SIZE = 5;

const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const buildMonthOptions = (count: number) => {
  const options: { key: string; label: string }[] = [];
  const now = new Date();

  for (let i = 0; i < count; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({
      key: formatMonthKey(d),
      label: d.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
    });
  }

  return options;
};

const generateRowsForMonth = (monthKey: string, seed: number) => {
  const [yearStr, monthStr] = monthKey.split("-");
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;
  const rows: AttendanceRow[] = [];

  // Simulate 12 attendance entries per month.
  for (let i = 1; i <= 12; i += 1) {
    const date = new Date(year, monthIndex, i + 1);
    const dayLabel = date.toLocaleDateString("id-ID", { weekday: "short" });
    const dateLabel = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const inHour = 8 + ((i + seed) % 2);
    const inMinute = 5 + ((i * 7 + seed) % 25);
    const outHour = 17 + ((i + seed) % 2);
    const outMinute = 10 + ((i * 5 + seed) % 20);

    rows.push({
      id: `${monthKey}-${i}`,
      date: dateLabel,
      day: dayLabel,
      clockIn: `${String(inHour).padStart(2, "0")}:${String(inMinute).padStart(2, "0")}`,
      clockOut: `${String(outHour).padStart(2, "0")}:${String(outMinute).padStart(2, "0")}`,
      reason: "",
    });
  }

  return rows;
};

const calculateWorkingHour = (clockIn: string, clockOut: string) => {
  const [inH, inM] = clockIn.split(":").map(Number);
  const [outH, outM] = clockOut.split(":").map(Number);
  const inMinutes = inH * 60 + inM;
  const outMinutes = outH * 60 + outM;
  const diff = Math.max(0, outMinutes - inMinutes);
  const hh = String(Math.floor(diff / 60)).padStart(2, "0");
  const mm = String(diff % 60).padStart(2, "0");
  return `${hh}:${mm}`;
};

const isValidTimeFormat = (value: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

const parseTimeToMinutes = (value: string) => {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
};

const buildDefaultMonthlyData = (
  monthOptions: { key: string; label: string }[],
): MonthlyAttendanceData => {
  const map: MonthlyAttendanceData = {};
  monthOptions.forEach((option, idx) => {
    map[option.key] = generateRowsForMonth(option.key, idx);
  });
  return map;
};

const sanitizeStoredMonthlyData = (
  raw: unknown,
  monthOptions: { key: string; label: string }[],
): MonthlyAttendanceData => {
  const defaults = buildDefaultMonthlyData(monthOptions);

  if (!raw || typeof raw !== "object") return defaults;

  const source = raw as Record<string, unknown>;
  const sanitized: MonthlyAttendanceData = {};

  monthOptions.forEach((option) => {
    const monthRows = source[option.key];

    if (!Array.isArray(monthRows)) {
      sanitized[option.key] = defaults[option.key];
      return;
    }

    const cleanedRows = monthRows
      .map((row, index) => {
        if (!row || typeof row !== "object") return null;
        const item = row as Record<string, unknown>;
        if (
          typeof item.date !== "string" ||
          typeof item.day !== "string" ||
          typeof item.clockIn !== "string" ||
          typeof item.clockOut !== "string" ||
          !isValidTimeFormat(item.clockIn) ||
          !isValidTimeFormat(item.clockOut)
        ) {
          return null;
        }

        return {
          id:
            typeof item.id === "string" && item.id.length > 0
              ? item.id
              : `${option.key}-${index + 1}`,
          date: item.date,
          day: item.day,
          clockIn: item.clockIn,
          clockOut: item.clockOut,
          reason: typeof item.reason === "string" ? item.reason : "",
        };
      })
      .filter((item): item is AttendanceRow => item !== null);

    sanitized[option.key] =
      cleanedRows.length > 0 ? cleanedRows : defaults[option.key];
  });

  return sanitized;
};

export default function AttendancePage() {
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

  const monthOptions = useMemo(() => buildMonthOptions(3), []);
  const currentMonthKey = monthOptions[0].key;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [monthlyData, setMonthlyData] = useState<MonthlyAttendanceData>(() =>
    buildDefaultMonthlyData(monthOptions),
  );

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editClockIn, setEditClockIn] = useState("");
  const [editClockOut, setEditClockOut] = useState("");
  const [editReason, setEditReason] = useState("");
  const [editError, setEditError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAttendanceHydrated, setIsAttendanceHydrated] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestDate, setRequestDate] = useState("");
  const [requestClockIn, setRequestClockIn] = useState("");
  const [requestClockOut, setRequestClockOut] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktopViewport(desktop);
      if (desktop) setIsMobileSidebarOpen(false);
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

  useEffect(() => {
    try {
      const savedAttendance = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
      if (!savedAttendance) {
        setMonthlyData(buildDefaultMonthlyData(monthOptions));
      } else {
        const parsed = JSON.parse(savedAttendance) as unknown;
        setMonthlyData(sanitizeStoredMonthlyData(parsed, monthOptions));
      }
    } catch {
      setMonthlyData(buildDefaultMonthlyData(monthOptions));
    } finally {
      setIsAttendanceHydrated(true);
    }
  }, [monthOptions]);

  useEffect(() => {
    if (!isAttendanceHydrated) return;
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(monthlyData));
  }, [monthlyData, isAttendanceHydrated]);

  useEffect(() => {
    setCurrentPage(1);
    setEditingIndex(null);
    setEditReason("");
    setEditError("");
  }, [selectedMonth]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const rows = monthlyData[selectedMonth] ?? [];
  const editingRow = editingIndex !== null ? rows[editingIndex] ?? null : null;
  const isCurrentMonth = selectedMonth === currentMonthKey;
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedRows = rows.slice(pageStartIndex, pageStartIndex + PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startEdit = (index: number) => {
    const row = rows[index];
    setEditingIndex(index);
    setEditClockIn(row.clockIn);
    setEditClockOut(row.clockOut);
    setEditReason(row.reason ?? "");
    setEditError("");
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const normalizedClockIn = editClockIn.trim();
    const normalizedClockOut = editClockOut.trim();
    const normalizedReason = editReason.trim();

    if (!normalizedClockIn || !normalizedClockOut || !normalizedReason) {
      setEditError("Clock in, clock out, dan reason wajib diisi.");
      return;
    }

    if (
      !isValidTimeFormat(normalizedClockIn) ||
      !isValidTimeFormat(normalizedClockOut)
    ) {
      setEditError("Format jam tidak valid.");
      return;
    }

    if (parseTimeToMinutes(normalizedClockOut) <= parseTimeToMinutes(normalizedClockIn)) {
      setEditError("Clock out harus lebih besar dari clock in.");
      return;
    }

    setMonthlyData((prev) => {
      const target = [...(prev[selectedMonth] ?? [])];
      target[editingIndex] = {
        ...target[editingIndex],
        clockIn: normalizedClockIn,
        clockOut: normalizedClockOut,
        reason: normalizedReason,
      };
      return { ...prev, [selectedMonth]: target };
    });
    setEditingIndex(null);
    setEditReason("");
    setEditError("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditReason("");
    setEditError("");
  };

  const closeRequestModal = () => {
    setIsRequestModalOpen(false);
    setRequestDate("");
    setRequestClockIn("");
    setRequestClockOut("");
    setRequestReason("");
    setRequestError("");
  };

  const submitRequestAttendance = () => {
    const normalizedDate = requestDate.trim();
    const normalizedClockIn = requestClockIn.trim();
    const normalizedClockOut = requestClockOut.trim();
    const normalizedReason = requestReason.trim();

    if (!normalizedDate || !normalizedClockIn || !normalizedClockOut || !normalizedReason) {
      setRequestError("Date, clock in, clock out, dan reason wajib diisi.");
      return;
    }

    if (
      !isValidTimeFormat(normalizedClockIn) ||
      !isValidTimeFormat(normalizedClockOut)
    ) {
      setRequestError("Format jam tidak valid.");
      return;
    }

    if (parseTimeToMinutes(normalizedClockOut) <= parseTimeToMinutes(normalizedClockIn)) {
      setRequestError("Clock out harus lebih besar dari clock in.");
      return;
    }

    closeRequestModal();
  };

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
        onToggleDesktop={() =>
          setIsDesktopSidebarCollapsed((prevCollapsed) => !prevCollapsed)
        }
        menus={sideNavMenus}
        activeMenu="Attendance"
      />

      <main
        className={`w-full min-w-0 transition-all duration-200 ${
          isDesktopSidebarCollapsed
            ? "lg:ml-20 lg:w-[calc(100%-5rem)]"
            : "lg:ml-72 lg:w-[calc(100%-18rem)]"
        }`}
      >
        <Topbar
          title="Attendance"
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

        <section className="max-w-full space-y-6 p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Card className="p-5">
              <p className="text-sm text-on-surface-variant">Annual Leave Taken</p>
              <p className="mt-2 text-3xl font-semibold text-on-surface">5 Days</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-on-surface-variant">Sick Leave Taken</p>
              <p className="mt-2 text-3xl font-semibold text-on-surface">2 Days</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-on-surface-variant">Working Day (This Month)</p>
              <p className="mt-2 text-3xl font-semibold text-on-surface">
                {monthlyData[currentMonthKey]?.length ?? 0} Days
              </p>
            </Card>
          </div>

          <Card className="min-w-0 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <h2 className="text-lg font-semibold text-on-surface">Clock In/Out History</h2>
                <Button
                  type="button"
                  variant="outlined"
                  className="h-9 px-4"
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  Request Attendance
                </Button>
              </div>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-lg border border-outline bg-surface px-3 py-2 text-sm text-on-surface outline-none"
              >
                {monthOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <AttendanceTable
              paginatedRows={paginatedRows}
              pageStartIndex={pageStartIndex}
              rowsCount={rows.length}
              pageSize={PAGE_SIZE}
              safePage={safePage}
              totalPages={totalPages}
              isCurrentMonth={isCurrentMonth}
              editingIndex={editingIndex}
              editClockIn={editClockIn}
              editClockOut={editClockOut}
              editReason={editReason}
              editError={editError}
              editingRow={editingRow}
              calculateWorkingHour={calculateWorkingHour}
              onEditClockInChange={setEditClockIn}
              onEditClockOutChange={setEditClockOut}
              onEditReasonChange={setEditReason}
              onStartEdit={startEdit}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
              onPrevPage={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              onNextPage={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            />
          </Card>
        </section>
      </main>

      <Modal
        open={isRequestModalOpen}
        onClose={closeRequestModal}
        title="Request Attendance"
        description="Isi tanggal dan jam attendance yang ingin diajukan."
        footer={
          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="text" className="h-9 px-4" onClick={closeRequestModal}>
              Cancel
            </Button>
            <Button type="button" className="h-9 px-4" onClick={submitRequestAttendance}>
              Submit Request
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3">
          <DatePickerField
            id="request-attendance-date"
            label="Date"
            value={requestDate}
            onChange={setRequestDate}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TimePickerField
              id="request-attendance-clock-in"
              label="Clock In"
              value={requestClockIn}
              onChange={setRequestClockIn}
            />
            <TimePickerField
              id="request-attendance-clock-out"
              label="Clock Out"
              value={requestClockOut}
              onChange={setRequestClockOut}
            />
          </div>
          <InputField
            id="request-attendance-reason"
            label="Reason"
            type="textarea"
            rows={3}
            value={requestReason}
            onChange={(e) => setRequestReason(e.target.value)}
          />
        </div>
        {requestError && <p className="mt-3 text-sm text-error">{requestError}</p>}
      </Modal>
    </div>
  );
}
