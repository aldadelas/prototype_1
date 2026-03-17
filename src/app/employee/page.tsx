"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, DataTable, type DataTableColumn } from "@/components/ui";

type EmployeeRole = "Admin" | "Employee";

interface EmployeeRow {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  role: EmployeeRole;
  createdDate: string;
  isActive: boolean;
}

const PAGE_SIZE = 6;

const DUMMY_EMPLOYEES: EmployeeRow[] = [
  {
    id: "EMP-1001",
    firstName: "Alda",
    lastName: "Pratama",
    jobTitle: "HR Manager",
    role: "Admin",
    createdDate: "01/02/2026",
    isActive: true,
  },
  {
    id: "EMP-1002",
    firstName: "Rina",
    lastName: "Mahendra",
    jobTitle: "Frontend Developer",
    role: "Employee",
    createdDate: "03/02/2026",
    isActive: true,
  },
  {
    id: "EMP-1003",
    firstName: "Bima",
    lastName: "Saputra",
    jobTitle: "Backend Developer",
    role: "Employee",
    createdDate: "04/02/2026",
    isActive: true,
  },
  {
    id: "EMP-1004",
    firstName: "Nadia",
    lastName: "Permata",
    jobTitle: "QA Engineer",
    role: "Employee",
    createdDate: "05/02/2026",
    isActive: false,
  },
  {
    id: "EMP-1005",
    firstName: "Daffa",
    lastName: "Nugraha",
    jobTitle: "UI/UX Designer",
    role: "Employee",
    createdDate: "07/02/2026",
    isActive: true,
  },
  {
    id: "EMP-1006",
    firstName: "Putri",
    lastName: "Lestari",
    jobTitle: "People Operations",
    role: "Admin",
    createdDate: "10/02/2026",
    isActive: true,
  },
  {
    id: "EMP-1007",
    firstName: "Yoga",
    lastName: "Ramadhan",
    jobTitle: "Mobile Developer",
    role: "Employee",
    createdDate: "12/02/2026",
    isActive: false,
  },
  {
    id: "EMP-1008",
    firstName: "Sinta",
    lastName: "Wulandari",
    jobTitle: "Business Analyst",
    role: "Employee",
    createdDate: "15/02/2026",
    isActive: true,
  },
];

export default function EmployeePage() {
  const [employees, setEmployees] = useState<EmployeeRow[]>(DUMMY_EMPLOYEES);
  const [currentPage, setCurrentPage] = useState(1);

  const totalRows = employees.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedRows = useMemo(
    () => employees.slice(pageStartIndex, pageStartIndex + PAGE_SIZE),
    [employees, pageStartIndex],
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDeactivate = (id: string) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              isActive: false,
            }
          : employee,
      ),
    );
  };

  const handleActivate = (id: string) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              isActive: true,
            }
          : employee,
      ),
    );
  };

  const columns: DataTableColumn<EmployeeRow>[] = [
    {
      key: "employeeId",
      header: "Employee ID",
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      renderCell: (row) => row.id,
    },
    {
      key: "employeeName",
      header: "Employee First Last Name",
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      renderCell: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: "jobTitle",
      header: "Employee Job Title",
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      renderCell: (row) => row.jobTitle,
    },
    {
      key: "role",
      header: "Role",
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      renderCell: (row) => row.role,
    },
    {
      key: "status",
      header: "Status",
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      renderCell: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            row.isActive
              ? "bg-primary-container text-on-primary-container"
              : "bg-surface-container-high text-on-surface-variant"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdDate",
      header: "Created Date",
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      renderCell: (row) => row.createdDate,
    },
    {
      key: "action",
      header: "Action",
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      renderCell: (row) => (
        <div className="flex flex-wrap items-center gap-2">
          {row.isActive ? (
            <Button
              type="button"
              variant="outlined"
              className="h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm"
              onClick={() => handleDeactivate(row.id)}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              type="button"
              variant="outlined"
              className="h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm"
              onClick={() => handleActivate(row.id)}
            >
              Activate
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <section className="max-w-full space-y-6 p-4 sm:p-6 lg:p-8">
        <Card className="min-w-0 p-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-end">
              <Link href="/employee/add">
                <Button type="button" className="h-9 px-4">
                  Add Employee
                </Button>
              </Link>
            </div>

            <DataTable
              columns={columns}
              rows={paginatedRows}
              getRowKey={(row) => row.id}
              emptyState="Belum ada data employee."
              className="mt-1 w-full max-w-full overflow-x-auto"
              tableClassName="min-w-[1080px] w-full table-auto text-left text-xs text-on-surface-variant sm:text-sm"
              pagination={{
                page: safePage,
                totalPages,
                pageSize: PAGE_SIZE,
                totalRows,
                pageStartIndex,
                onPrevPage: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
                onNextPage: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)),
              }}
            />
          </div>
        </Card>
      </section>
    </>
  );
}
