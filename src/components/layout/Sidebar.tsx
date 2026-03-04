"use client";

import Link from "next/link";
import { CloseIcon } from "@/components/icon";

export interface SidebarMenuItem {
  label: string;
  href?: string;
}

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isDesktopCollapsed: boolean;
  onToggleDesktop: () => void;
  brand?: string;
  menus: SidebarMenuItem[];
  activeMenu?: string;
}

export default function Sidebar({
  isMobileOpen,
  onCloseMobile,
  isDesktopCollapsed,
  onToggleDesktop,
  brand = "HR Portal",
  menus,
  activeMenu,
}: SidebarProps) {
  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onCloseMobile}
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 min-h-svh border-r border-outline-variant bg-surface-container-low p-4 transition-all duration-200 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } w-72 lg:translate-x-0 ${
          isDesktopCollapsed ? "lg:w-20" : "lg:w-72"
        }`}
      >
        <div
          className={`mb-8 flex items-center ${
            isDesktopCollapsed ? "justify-center lg:justify-between" : "justify-between"
          }`}
        >
          <h1
            className={`text-xl font-semibold text-primary ${
              isDesktopCollapsed ? "lg:hidden" : ""
            }`}
          >
            {brand}
          </h1>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onCloseMobile}
            className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface lg:hidden"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Collapse sidebar"
            onClick={onToggleDesktop}
            className="hidden rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface lg:block"
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
                  <Link
                    href={menu.href}
                    onClick={onCloseMobile}
                    className={`${className} ${
                      isDesktopCollapsed ? "lg:flex lg:justify-center lg:px-2" : ""
                    }`}
                  >
                    <span className={isDesktopCollapsed ? "lg:hidden" : ""}>
                      {menu.label}
                    </span>
                    <span className={isDesktopCollapsed ? "hidden lg:inline" : "hidden"}>
                      {menu.label.charAt(0)}
                    </span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={`${className} ${
                      isDesktopCollapsed ? "lg:flex lg:justify-center lg:px-2" : ""
                    }`}
                  >
                    <span className={isDesktopCollapsed ? "lg:hidden" : ""}>
                      {menu.label}
                    </span>
                    <span className={isDesktopCollapsed ? "hidden lg:inline" : "hidden"}>
                      {menu.label.charAt(0)}
                    </span>
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
