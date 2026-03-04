"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";

interface AttendanceClockCardProps {
  userDisplayName: string;
}

interface ClockLocation {
  latitude: number;
  longitude: number;
}

export default function AttendanceClockCard({
  userDisplayName,
}: AttendanceClockCardProps) {
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  const [clockInLocation, setClockInLocation] = useState<ClockLocation | null>(null);
  const [clockOutLocation, setClockOutLocation] = useState<ClockLocation | null>(
    null,
  );
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

  const formatWorkingHours = () => {
    if (!clockInTime) return "-";

    const endTime = clockOutTime ?? now;
    const diffMs = Math.max(0, endTime.getTime() - clockInTime.getTime());
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0",
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  const formatLocation = (value: ClockLocation | null) => {
    if (!value) return "-";
    return `${value.latitude.toFixed(6)}, ${value.longitude.toFixed(6)}`;
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
      setClockInLocation(currentLocation);
      setClockOutLocation(null);
      setIsGettingLocation(false);
      return;
    }

    setClockOutTime(new Date());
    setClockOutLocation(currentLocation);
    setIsGettingLocation(false);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-on-surface">Clock In / Clock Out</h2>
      <p className="mt-2 text-sm text-on-surface-variant">
        Halo {userDisplayName}. Silakan lakukan absensi harian Anda.
      </p>

      <div className="mt-4 rounded-xl bg-surface-container px-4 py-3 text-sm text-on-surface">
        {now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </div>

      <div className="mt-4 grid gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
        <p>
          <span className="font-medium text-on-surface">Clock In Time:</span>{" "}
          {formatTime(clockInTime)}
        </p>
        <p>
          <span className="font-medium text-on-surface">Clock In GPS:</span>{" "}
          {formatLocation(clockInLocation)}
        </p>
        <p>
          <span className="font-medium text-on-surface">Clock Out Time:</span>{" "}
          {formatTime(clockOutTime)}
        </p>
        <p>
          <span className="font-medium text-on-surface">Clock Out GPS:</span>{" "}
          {formatLocation(clockOutLocation)}
        </p>
        <p className="sm:col-span-2">
          <span className="font-medium text-on-surface">Working Hour:</span>{" "}
          {formatWorkingHours()}
        </p>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleClockAction}
          disabled={isGettingLocation}
          className="h-11 rounded-full bg-primary px-6 text-sm font-medium text-on-primary hover:opacity-95"
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
