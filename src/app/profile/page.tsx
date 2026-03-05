"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAppSelector } from "@/lib/redux/hooks";

export default function ProfilePage() {
  const router = useRouter();
  const {
    username,
    firstName,
    lastName,
    birthDate,
    jobTitle,
    email,
    phoneNumber,
    profilePhotoUrl,
  } = useAppSelector((state) => state.auth);

  return (
    <section className="p-8">
      <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-on-surface">
                Profile Summary
              </h2>
              <Button
                type="button"
                variant="outlined"
                onClick={() => router.push("/profile/edit")}
              >
                Edit Profile
              </Button>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <img
                src={profilePhotoUrl || "https://i.pravatar.cc/100?img=12"}
                alt="Profile photo"
                className="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <p className="text-base font-semibold text-on-surface">
                  {`${firstName} ${lastName}`.trim() || username || "User"}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {jobTitle || "No job title"}
                </p>
                <p className="text-sm text-on-surface-variant">{email || "-"}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
              <p>
                <span className="font-medium text-on-surface">First Name:</span>{" "}
                {firstName || "-"}
              </p>
              <p>
                <span className="font-medium text-on-surface">Last Name:</span>{" "}
                {lastName || "-"}
              </p>
              <p>
                <span className="font-medium text-on-surface">Birth Date:</span>{" "}
                {birthDate || "-"}
              </p>
              <p>
                <span className="font-medium text-on-surface">Job Title:</span>{" "}
                {jobTitle || "-"}
              </p>
              <p>
                <span className="font-medium text-on-surface">Email:</span>{" "}
                {email || "-"}
              </p>
              <p>
                <span className="font-medium text-on-surface">Phone:</span>{" "}
                {phoneNumber || "-"}
              </p>
            </div>
      </Card>
    </section>
  );
}
