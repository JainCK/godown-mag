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

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
  const pathname = usePathname();

  // Close the sidebar when navigating on mobile
  React.useEffect(() => {
    onClose();
  }, [pathname]);

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#f3f4f2] border-r border-[#1B263B] flex flex-col select-none
        transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-between items-center p-3 border-b border-[#1B263B]/20 bg-[#E0E1DD]/30">
          <span className="font-mono text-xs font-bold text-[#cc0000] uppercase tracking-wider">Navigation</span>
          <button 
            onClick={onClose}
            className="w-6 h-6 border border-[#1B263B] bg-white text-[#0D1B2A] flex items-center justify-center font-bold text-xs hover:bg-[#cc0000] hover:text-white cursor-pointer active:translate-y-0.5"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

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
                        onClick={() => {
                          item.action?.();
                          onClose();
                        }}
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
                      onClick={onClose}
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
    </>
  );
}
