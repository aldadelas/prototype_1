"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DatePickerField from "@/components/ui/DatePickerField";
import InputField from "@/components/ui/InputField";
import PhoneNumberField from "@/components/ui/PhoneNumberField";

export default function AddEmployeePage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [formError, setFormError] = useState("");

  const handleSave = () => {
    if (
      !employeeId.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !birthDate ||
      !jobTitle.trim() ||
      !email.trim() ||
      !phoneNumber
    ) {
      setFormError("Semua field wajib diisi.");
      return;
    }

    setFormError("");
    router.push("/employee");
  };

  return (
    <section className="p-8">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-on-surface">Add Employee</h2>
        <div className="mt-6 space-y-4">
          <InputField
            id="employee-id"
            label="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              id="employee-first-name"
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <InputField
              id="employee-last-name"
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DatePickerField
              id="employee-birth-date"
              label="Birth Date"
              value={birthDate}
              onChange={setBirthDate}
            />
            <InputField
              id="employee-job-title"
              label="Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <InputField
            id="employee-email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PhoneNumberField
            id="employee-phone-number"
            label="Phone Number"
            value={phoneNumber}
            onChange={setPhoneNumber}
          />
          {formError && <p className="text-sm text-error">{formError}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="text" onClick={() => router.push("/employee")}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Card>
    </section>
  );
}
