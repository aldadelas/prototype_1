"use client";

import { useState } from "react";
import AttendanceClockCard from "@/components/home/AttendanceClockCard";
import AttendanceHistoryCard from "@/components/home/AttendanceHistoryCard";
import type { AttendanceHistoryItem } from "@/components/home/attendanceTypes";
import { useAppSelector } from "@/lib/redux/hooks";

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
  const { username, firstName, lastName } = useAppSelector((state) => state.auth);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistoryItem[]>(
    generateDummyAttendanceHistory(),
  );

  const handleAttendanceRecorded = (item: AttendanceHistoryItem) => {
    setAttendanceHistory((prevHistory) => [item, ...prevHistory].slice(0, 7));
  };

  return (
    <section className="flex max-w-full flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-start lg:p-8">
      <div className="w-full min-w-0 md:h-[450px] md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4">
        <AttendanceClockCard
          userDisplayName={`${firstName} ${lastName}`.trim() || username || "User"}
          onAttendanceRecorded={handleAttendanceRecorded}
        />
      </div>
      <div className="w-full min-w-0 md:h-[450px] md:w-1/2 lg:w-1/2 xl:w-2/5 2xl:w-1/3">
        <AttendanceHistoryCard history={attendanceHistory} />
      </div>
    </section>
  );
}
