"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  name: string;
  label: string;
  href: string;
  action?: () => void;
}

interface MenuGroup {
  category: string;
  items: MenuItem[];
}

const menuItems: MenuGroup[] = [
  { category: "Masters", items: [
    { name: "Dashboard", label: "Dashboard", href: "/" },
    { name: "Godowns", label: "Godowns Directory", href: "/godowns" }
  ]},
  { category: "Transactions", items: [
    { name: "Ledger", label: "Ledger Vouchers", href: "/ledger" }
  ]},
  { category: "Reports", items: [
    { name: "Reports", label: "Reports & Exports", href: "/reports" }
  ]},
  /* Sign out option disabled for now but code kept in place
  { category: "System", items: [
    { 
      name: "SignOut", 
      label: "Sign Out", 
      href: "#", 
      action: () => {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("smart_ledger_auth");
          window.location.reload();
        }
      }
    }
  ]}
  */
];

export function RightSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full md:w-64 shrink-0 bg-[#f3f4f2] border-r border-[#1B263B] flex flex-col select-none">
      {/* Menu Items */}
      <div className="p-4 space-y-4 font-mono text-[12px] text-[#000000] flex-1 overflow-y-auto">
        {menuItems.map((group) => (
          <div key={group.category} className="space-y-1.5">
            <span className="text-[#cc0000] font-bold block border-b border-[#E0E1DD] pb-1 mb-1.5 text-[10px] uppercase tracking-wider">
              {group.category}
            </span>
            
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;

                if (item.action) {
                  return (
                    <button
                      key={item.name}
                      onClick={item.action}
                      className="w-full text-left px-2.5 py-1 block hover:bg-[#1B263B] hover:text-white transition-colors cursor-pointer rounded"
                    >
                      {item.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`w-full px-2.5 py-1 block transition-colors rounded ${
                      isActive
                        ? "bg-[#1B263B] text-white font-bold"
                        : "hover:bg-[#1B263B] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
