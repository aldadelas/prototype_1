"use client";

import Link from "next/link";
import { CloseIcon } from "@/components/icon";

export interface SidebarMenuItem {
  label: string;
  href?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  brand?: string;
  menus: SidebarMenuItem[];
  activeMenu?: string;
}

export default function Sidebar({
  isOpen,
  onClose,
  brand = "HR Portal",
  menus,
  activeMenu,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 min-h-svh w-72 border-r border-outline-variant bg-surface-container-low p-6 transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-primary">{brand}</h1>
          <button
            type="button"
            aria-label="Collapse sidebar"
            onClick={onClose}
            className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {menus.map((menu) => {
            const isActive = activeMenu === menu.label;
            const className = `block w-full rounded-xl px-4 py-3 text-left text-sm transition-colors ${
              isActive
                ? "bg-primary-container font-medium text-on-primary-container"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            }`;

            return (
              <div key={menu.label}>
                {menu.href ? (
                  <Link href={menu.href} onClick={onClose} className={className}>
                    {menu.label}
                  </Link>
                ) : (
                  <button type="button" className={className}>
                    {menu.label}
                  </button>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
