"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DatePickerField from "@/components/ui/DatePickerField";
import InputField from "@/components/ui/InputField";
import PhoneNumberField from "@/components/ui/PhoneNumberField";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateProfile } from "@/lib/redux/features/auth/authSlice";

export default function EditProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    firstName,
    lastName,
    birthDate,
    jobTitle,
    email,
    phoneNumber,
  } = useAppSelector((state) => state.auth);
  const [editFirstName, setEditFirstName] = useState(firstName || "");
  const [editLastName, setEditLastName] = useState(lastName || "");
  const [editBirthDate, setEditBirthDate] = useState(birthDate || "");
  const [editJobTitle, setEditJobTitle] = useState(jobTitle || "");
  const [editEmail, setEditEmail] = useState(email || "");
  const [editPhone, setEditPhone] = useState<string | undefined>(
    phoneNumber || undefined,
  );

  const handleSave = () => {
    dispatch(
      updateProfile({
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
        birthDate: editBirthDate,
        jobTitle: editJobTitle.trim(),
        email: editEmail.trim(),
        phoneNumber: editPhone ?? "",
      }),
    );
    router.push("/profile");
  };

  return (
    <section className="p-8">
      <Card className="p-6">
            <h2 className="text-lg font-semibold text-on-surface">Edit Profile</h2>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  id="profile-first-name"
                  label="First Name"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                />
                <InputField
                  id="profile-last-name"
                  label="Last Name"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DatePickerField
                  id="profile-birth-date"
                  label="Birth Date"
                  value={editBirthDate}
                  onChange={setEditBirthDate}
                />
                <InputField
                  id="profile-job-title"
                  label="Job Title"
                  value={editJobTitle}
                  onChange={(e) => setEditJobTitle(e.target.value)}
                />
              </div>
              <InputField
                id="profile-email"
                label="Email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
              <PhoneNumberField
                id="profile-phone"
                label="Phone Number"
                value={editPhone}
                onChange={setEditPhone}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="text"
                onClick={() => router.push("/profile")}
              >
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
