"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import type { AttendanceHistoryItem } from "@/components/home/attendanceTypes";

interface AttendanceClockCardProps {
  userDisplayName: string;
  onAttendanceRecorded: (item: AttendanceHistoryItem) => void;
}

interface ClockLocation {
  latitude: number;
  longitude: number;
}

export default function AttendanceClockCard({
  userDisplayName,
  onAttendanceRecorded,
}: AttendanceClockCardProps) {
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  const formatTime = (value: Date | null) => {
    if (!value) return "-";

    return value.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatHourMinute = (value: Date | null) => {
    if (!value) return "--:--";

    return value.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatWorkingHoursHourMinute = () => {
    if (!clockInTime) return "--:--";

    const endTime = clockOutTime ?? now;
    const diffMs = Math.max(0, endTime.getTime() - clockInTime.getTime());
    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const minutes = String(totalMinutes % 60).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const getWorkingHourFromTimes = (start: Date, end: Date) => {
    const diffMs = Math.max(0, end.getTime() - start.getTime());
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0",
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  const getCurrentLocation = async (): Promise<ClockLocation> => {
    if (!navigator.geolocation) {
      throw new Error("Browser tidak mendukung fitur GPS.");
    }

    return await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            reject(new Error("Izin lokasi ditolak. Aktifkan GPS untuk absensi."));
            return;
          }
          reject(new Error("Gagal mengambil lokasi GPS."));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
        },
      );
    });
  };

  const handleClockAction = async () => {
    setIsGettingLocation(true);
    setLocationError("");

    let currentLocation: ClockLocation;
    try {
      currentLocation = await getCurrentLocation();
    } catch (error) {
      setLocationError(
        error instanceof Error ? error.message : "Gagal mengambil lokasi GPS.",
      );
      setIsGettingLocation(false);
      return;
    }

    if (!clockInTime || (clockInTime && clockOutTime)) {
      setClockInTime(new Date());
      setClockOutTime(null);
      setIsGettingLocation(false);
      return;
    }

    const outTime = new Date();
    setClockOutTime(outTime);
    setClockOutLocation(currentLocation);
    const historyItem: AttendanceHistoryItem = {
      day: outTime.toLocaleDateString("id-ID", {
        weekday: "long",
      }),
      date: outTime.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      clockInTime: formatTime(clockInTime),
      clockOutTime: formatTime(outTime),
      workingHour: getWorkingHourFromTimes(clockInTime, outTime),
    };
    onAttendanceRecorded(historyItem);
    setIsGettingLocation(false);
  };

  return (
    <Card className="flex h-full max-h-[450px] flex-col p-6">
      <h2 className="text-xl font-semibold text-on-surface">Clock In / Clock Out</h2>
      <p className="mt-2 text-sm text-on-surface-variant">
        Halo {userDisplayName}. Silakan lakukan absensi harian Anda.
      </p>

      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        <div className="rounded-xl bg-surface-container px-4 py-3 text-sm text-on-surface">
          {now.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>

        <div className="mt-4 grid gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
          <div className="sm:col-span-2 rounded-xl bg-surface px-4 py-4">
            <div className="flex items-center justify-center gap-3 text-3xl font-semibold text-on-surface">
              <div className="text-center">
                <p>{formatHourMinute(clockInTime)}</p>
                <p className="mt-1 text-xs font-normal text-on-surface-variant">
                  Clock In
                </p>
              </div>
              <span className="text-on-surface-variant">|</span>
              <div className="text-center">
                <p>{formatHourMinute(clockOutTime)}</p>
                <p className="mt-1 text-xs font-normal text-on-surface-variant">
                  Clock Out
                </p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-on-surface-variant">Working Hour</p>
              <p className="text-3xl font-semibold text-on-surface">
                {formatWorkingHoursHourMinute()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleClockAction}
          disabled={isGettingLocation}
          className="h-11 w-full rounded-full bg-primary px-6 text-sm font-medium text-on-primary hover:opacity-95"
        >
          {isGettingLocation
            ? "Getting GPS..."
            : !clockInTime || (clockInTime && clockOutTime)
              ? "Clock In"
              : "Clock Out"}
        </button>
        {locationError && (
          <p className="mt-2 text-sm text-error">{locationError}</p>
        )}
      </div>
    </Card>
  );
}
