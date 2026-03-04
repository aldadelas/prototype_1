"use client";

import Card from "@/components/ui/Card";
import type { AttendanceHistoryItem } from "@/components/home/attendanceTypes";

interface AttendanceHistoryCardProps {
  history: AttendanceHistoryItem[];
}

export default function AttendanceHistoryCard({
  history,
}: AttendanceHistoryCardProps) {
  return (
    <Card className="flex h-full max-h-[450px] flex-col p-6">
      <h3 className="text-sm font-semibold text-on-surface">
        Riwayat Clock In/Out 7 Hari Terakhir
      </h3>
      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        {history.length === 0 ? (
          <p className="text-sm text-on-surface-variant">Belum ada data clock in/out.</p>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={`${item.date}-${item.clockInTime}-${index}`}
                className="rounded-xl border border-outline-variant bg-surface-container-low p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-on-surface">{item.day}</p>
                    <p className="text-xs text-on-surface-variant">{item.date}</p>
                  </div>
                  <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-medium text-on-primary-container">
                    {item.workingHour}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-surface px-3 py-2">
                    <p className="text-xs text-on-surface-variant">Clock In</p>
                    <p className="font-medium text-on-surface">{item.clockInTime}</p>
                  </div>
                  <div className="rounded-lg bg-surface px-3 py-2">
                    <p className="text-xs text-on-surface-variant">Clock Out</p>
                    <p className="font-medium text-on-surface">{item.clockOutTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
