"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DatePickerField from "@/components/ui/DatePickerField";
import InputField from "@/components/ui/InputField";

type LeaveType = "Annual" | "Sick";

export default function LeaveRequestPage() {
  const router = useRouter();
  const [leaveType, setLeaveType] = useState<LeaveType>("Annual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [formError, setFormError] = useState("");

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAttachments(Array.from(event.target.files ?? []));
  };

  const handleSubmit = () => {
    if (!startDate || !endDate || !message.trim()) {
      setFormError("Leave type, date range, dan message wajib diisi.");
      return;
    }

    setFormError("");
    router.push("/leave");
  };

  return (
    <section className="max-w-full p-4 sm:p-6 lg:p-8">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-on-surface">Leave Request Form</h2>

        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="leave-type" className="px-1 text-sm text-on-surface-variant">
              Leave Type
            </label>
            <select
              id="leave-type"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="w-full rounded-xl border border-outline bg-transparent px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-2 focus:border-primary"
            >
              <option value="Annual">Annual</option>
              <option value="Sick">Sick</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DatePickerField
              id="leave-start-date"
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
            />
            <DatePickerField
              id="leave-end-date"
              label="End Date"
              value={endDate}
              onChange={setEndDate}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="leave-attachments" className="px-1 text-sm text-on-surface-variant">
              Attachments
            </label>
            <input
              id="leave-attachments"
              type="file"
              multiple
              onChange={handleAttachmentChange}
              className="w-full rounded-xl border border-outline bg-transparent px-4 py-3 text-sm text-on-surface outline-none transition-colors file:mr-3 file:rounded-lg file:border-0 file:bg-primary-container file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-on-primary-container hover:file:bg-primary-container/80 focus:border-2 focus:border-primary"
            />
            {attachments.length > 0 && (
              <p className="px-1 text-xs text-on-surface-variant">
                {attachments.length} file dipilih
              </p>
            )}
          </div>

          <InputField
            id="leave-message"
            label="Message"
            type="textarea"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {formError && <p className="text-sm text-error">{formError}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="text" onClick={() => router.push("/leave")}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Submit Leave Request
          </Button>
        </div>
      </Card>
    </section>
  );
}
