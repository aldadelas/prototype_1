"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BellIcon,
  ChevronDownIcon,
  MenuIcon,
} from "@/components/icon";
import Card from "@/components/ui/Card";

interface TopbarProps {
  title?: string;
  userDisplayName: string;
  userEmail: string;
  profilePhotoUrl?: string;
  onOpenSidebar: () => void;
  onLogout: () => void;
  profileHref?: string;
}

export default function Topbar({
  title = "Home",
  userDisplayName,
  userEmail,
  profilePhotoUrl,
  onOpenSidebar,
  onLogout,
  profileHref = "/profile",
}: TopbarProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between gap-4 border-b border-outline-variant bg-surface px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <span className="text-sm font-medium text-on-surface-variant">{title}</span>
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          aria-label="Notifications"
        >
          <BellIcon className="h-6 w-6" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl px-2 py-1 transition-colors hover:bg-surface-container-high"
          >
            <img
              src={profilePhotoUrl || "https://i.pravatar.cc/100?img=12"}
              alt="Profile photo"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-on-surface">
              {userDisplayName}
            </span>
            <ChevronDownIcon className="h-5 w-5 text-on-surface-variant" />
          </button>

          {isProfileMenuOpen && (
            <Card className="absolute top-14 right-0 w-56 p-3">
              <div className="flex items-center gap-3 border-b border-outline-variant px-3 py-3">
                <img
                  src={profilePhotoUrl || "https://i.pravatar.cc/100?img=12"}
                  alt="Profile photo"
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-on-surface">
                    {userDisplayName}
                  </p>
                  <p className="text-xs text-on-surface-variant">{userEmail}</p>
                </div>
              </div>
              <div className="mt-2 flex flex-col gap-1">
              <Link
                href={profileHref}
                onClick={() => setIsProfileMenuOpen(false)}
                className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-on-surface hover:bg-surface-container-high"
              >
                User Profile
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-error hover:bg-error-container"
              >
                Logout
              </button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </header>
  );
}
