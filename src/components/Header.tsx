"use client";
import React from 'react';

export function Header() {
  return (
    <div className="w-full flex flex-col shrink-0 text-xs">
      {/* Top Ribbon in Prussian Blue */}
      <div className="bg-[#1B263B] text-white px-3 py-1.5 flex items-center justify-between border-b border-[#0D1B2A] select-none">
        <div className="flex items-center gap-1.5 font-sans font-medium text-[11px]">
          <span className="w-3.5 h-3.5 bg-white text-[#1B263B] flex items-center justify-center font-bold text-[9px] rounded-sm">S</span>
          <span>Smart Ledger</span>
        </div>
        <div className="text-[10px] text-[#E0E1DD] font-sans font-medium">
          Smart Ledger & Operations Tracker
        </div>
      </div>
    </div>
  );
}

