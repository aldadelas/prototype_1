"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import PhoneNumberField from "@/components/ui/PhoneNumberField";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout, updateProfile } from "@/lib/redux/features/auth/authSlice";

const sideNavMenus = [
  { label: "Dashboard", href: "/home" },
  { label: "Attendance" },
  { label: "Leave" },
  { label: "Employee Management" },
];

export default function EditProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    username,
    firstName,
    lastName,
    birthDate,
    jobTitle,
    email,
    phoneNumber,
    profilePhotoUrl,
    isAuthenticated,
    hydrated,
  } = useAppSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editFirstName, setEditFirstName] = useState(firstName || "");
  const [editLastName, setEditLastName] = useState(lastName || "");
  const [editBirthDate, setEditBirthDate] = useState(birthDate || "");
  const [editJobTitle, setEditJobTitle] = useState(jobTitle || "");
  const [editEmail, setEditEmail] = useState(email || "");
  const [editPhone, setEditPhone] = useState<string | undefined>(
    phoneNumber || undefined,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/");
    }
  }, [hydrated, isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

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

  if (!hydrated) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface text-on-surface-variant">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-surface">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        menus={sideNavMenus}
        activeMenu="Dashboard"
      />

      <main className="w-full">
        <Topbar
          title="Edit Profile"
          userDisplayName={`${firstName} ${lastName}`.trim() || username || "User"}
          userEmail={email || "Logged in user"}
          profilePhotoUrl={profilePhotoUrl}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onLogout={handleLogout}
          profileHref="/profile"
        />

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
                <InputField
                  id="profile-birth-date"
                  label="Birth Date"
                  type="date"
                  value={editBirthDate}
                  onChange={(e) => setEditBirthDate(e.target.value)}
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
      </main>
    </div>
  );
}
