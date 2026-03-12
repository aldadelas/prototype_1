"use client";

import {
  Button,
  DataTable,
  InputField,
  Modal,
  TimePickerField,
  type DataTableColumn,
} from "@/components/ui";
import type { AttendanceRow } from "@/components/attendance/attendanceTypes";

interface AttendanceTableProps {
  paginatedRows: AttendanceRow[];
  pageStartIndex: number;
  rowsCount: number;
  pageSize: number;
  safePage: number;
  totalPages: number;
  isCurrentMonth: boolean;
  editingIndex: number | null;
  editClockIn: string;
  editClockOut: string;
  editReason: string;
  editError: string;
  editingRow: AttendanceRow | null;
  calculateWorkingHour: (clockIn: string, clockOut: string) => string;
  onEditClockInChange: (value: string) => void;
  onEditClockOutChange: (value: string) => void;
  onEditReasonChange: (value: string) => void;
  onStartEdit: (index: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export default function AttendanceTable({
  paginatedRows,
  pageStartIndex,
  rowsCount,
  pageSize,
  safePage,
  totalPages,
  isCurrentMonth,
  editingIndex,
  editClockIn,
  editClockOut,
  editReason,
  editError,
  editingRow,
  calculateWorkingHour,
  onEditClockInChange,
  onEditClockOutChange,
  onEditReasonChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onPrevPage,
  onNextPage,
}: AttendanceTableProps) {
  const isEditModalOpen = editingIndex !== null;

  const columns: DataTableColumn<AttendanceRow>[] = [
    {
      key: "day",
      header: "Day",
      renderCell: (row) => row.day,
    },
    {
      key: "date",
      header: "Date",
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      renderCell: (row) => row.date,
    },
    {
      key: "clockIn",
      header: "Clock In",
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      renderCell: (row) => row.clockIn,
    },
    {
      key: "clockOut",
      header: "Clock Out",
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      renderCell: (row) => row.clockOut,
    },
    {
      key: "workingHour",
      header: "Working Hour",
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      renderCell: (row) => calculateWorkingHour(row.clockIn, row.clockOut),
    },
    {
      key: "action",
      header: "Action",
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      renderCell: (_row, rowOffset) => {
        const index = pageStartIndex + rowOffset;

        if (!isCurrentMonth) {
          return <span className="text-xs text-on-surface-variant">Read only</span>;
        }

        return (
          <Button
            type="button"
            variant="outlined"
            className="h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm"
            onClick={() => onStartEdit(index)}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={paginatedRows}
        getRowKey={(row) => row.id}
        emptyState="Belum ada data attendance untuk bulan ini."
        className="mt-4 w-full max-w-full overflow-x-auto"
        tableClassName="min-w-[700px] w-full table-auto text-left text-xs text-on-surface-variant sm:text-sm"
        pagination={{
          page: safePage,
          totalPages,
          pageSize,
          totalRows: rowsCount,
          pageStartIndex,
          onPrevPage,
          onNextPage,
        }}
      />

      <Modal
        open={isEditModalOpen}
        onClose={onCancelEdit}
        title="Edit Attendance"
        description={editingRow ? `${editingRow.day}, ${editingRow.date}` : undefined}
        footer={
          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="text" className="h-9 px-4" onClick={onCancelEdit}>
              Cancel
            </Button>
            <Button type="button" onClick={onSaveEdit} className="h-9 px-4">
              Save
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TimePickerField
            id="modal-clock-in"
            label="Clock In"
            value={editClockIn}
            onChange={onEditClockInChange}
          />
          <TimePickerField
            id="modal-clock-out"
            label="Clock Out"
            value={editClockOut}
            onChange={onEditClockOutChange}
          />
        </div>
        <InputField
          id="modal-reason"
          label="Reason"
          type="textarea"
          rows={3}
          value={editReason}
          onChange={(e) => onEditReasonChange(e.target.value)}
          className="mt-3"
        />

        {editError && <p className="mt-3 text-sm text-error">{editError}</p>}
      </Modal>
    </>
  );
}
