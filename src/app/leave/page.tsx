"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DataTable, { type DataTableColumn } from "@/components/ui/DataTable";

interface LeaveHistoryRow {
  id: string;
  leaveType: "Annual Leave" | "Sick Leave";
  startDate: string;
  endDate: string;
  totalDays: number;
  status: "Approved" | "Pending" | "Rejected";
}

const leaveHistoryRows: LeaveHistoryRow[] = [
  {
    id: "leave-1",
    leaveType: "Annual Leave",
    startDate: "05/03/2026",
    endDate: "06/03/2026",
    totalDays: 2,
    status: "Approved",
  },
  {
    id: "leave-2",
    leaveType: "Sick Leave",
    startDate: "12/03/2026",
    endDate: "12/03/2026",
    totalDays: 1,
    status: "Pending",
  },
  {
    id: "leave-3",
    leaveType: "Annual Leave",
    startDate: "20/02/2026",
    endDate: "22/02/2026",
    totalDays: 3,
    status: "Approved",
  },
  {
    id: "leave-4",
    leaveType: "Sick Leave",
    startDate: "01/02/2026",
    endDate: "01/02/2026",
    totalDays: 1,
    status: "Rejected",
  },
];

const leaveHistoryColumns: DataTableColumn<LeaveHistoryRow>[] = [
  {
    key: "leaveType",
    header: "Leave Type",
    headerClassName: "whitespace-nowrap",
    cellClassName: "whitespace-nowrap",
    renderCell: (row) => row.leaveType,
  },
  {
    key: "startDate",
    header: "Start Date",
    headerClassName: "whitespace-nowrap",
    cellClassName: "whitespace-nowrap",
    renderCell: (row) => row.startDate,
  },
  {
    key: "endDate",
    header: "End Date",
    headerClassName: "whitespace-nowrap",
    cellClassName: "whitespace-nowrap",
    renderCell: (row) => row.endDate,
  },
  {
    key: "totalDays",
    header: "Total Days",
    headerClassName: "whitespace-nowrap",
    cellClassName: "whitespace-nowrap",
    renderCell: (row) => row.totalDays,
  },
  {
    key: "status",
    header: "Status",
    headerClassName: "whitespace-nowrap",
    cellClassName: "whitespace-nowrap",
    renderCell: (row) => row.status,
  },
];

export default function LeavePage() {
  const pendingRequestCount = leaveHistoryRows.filter((row) => row.status === "Pending").length;
  const annualLeaveTaken = leaveHistoryRows
    .filter((row) => row.leaveType === "Annual Leave" && row.status === "Approved")
    .reduce((sum, row) => sum + row.totalDays, 0);
  const sickLeaveTaken = leaveHistoryRows
    .filter((row) => row.leaveType === "Sick Leave" && row.status === "Approved")
    .reduce((sum, row) => sum + row.totalDays, 0);

  return (
    <section className="max-w-full space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-on-surface-variant">Pending Request</p>
          <p className="mt-2 text-3xl font-semibold text-on-surface">{pendingRequestCount}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-on-surface-variant">Annual Leave Taken</p>
          <p className="mt-2 text-3xl font-semibold text-on-surface">{annualLeaveTaken} Days</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-on-surface-variant">Sick Leave Taken</p>
          <p className="mt-2 text-3xl font-semibold text-on-surface">{sickLeaveTaken} Days</p>
        </Card>
      </div>

      <Card className="min-w-0 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-on-surface">Leave History</h2>
          <Link href="/leave/request" className="w-full sm:w-auto">
            <Button type="button" className="h-9 w-full px-4 sm:w-auto">
              Request Leave
            </Button>
          </Link>
        </div>
        <DataTable
          columns={leaveHistoryColumns}
          rows={leaveHistoryRows}
          getRowKey={(row) => row.id}
          emptyState="Belum ada history leave."
          className="mt-4 w-full max-w-full overflow-x-auto"
          tableClassName="min-w-[680px] w-full table-auto text-left text-xs text-on-surface-variant sm:text-sm"
        />
      </Card>
    </section>
  );
}
