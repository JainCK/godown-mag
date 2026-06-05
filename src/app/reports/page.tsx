"use client";

import { useState, useEffect } from "react";
import { exportToCSV, exportToTallyXML } from "@/lib/export";
import { getTransactions, type Transaction } from "@/lib/storage";

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mounted, setMounted] = useState(false);

  // Filter state
  const [selectedRange, setSelectedRange] = useState<"week" | "month" | "fy" | "all" | "custom">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setTransactions(getTransactions());
    setMounted(true);
  }, []);

  const setPreset = (preset: "week" | "month" | "fy" | "all") => {
    setSelectedRange(preset);
    const today = new Date().toISOString().split("T")[0];
    if (preset === "week") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      setStartDate(d.toISOString().split("T")[0]);
      setEndDate(today);
    } else if (preset === "month") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      setStartDate(d.toISOString().split("T")[0]);
      setEndDate(today);
    } else if (preset === "fy") {
      setStartDate("2026-04-01");
      setEndDate("2027-03-31");
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleCustomDateChange = (start: string, end: string) => {
    setSelectedRange("custom");
    setStartDate(start);
    setEndDate(end);
  };

  if (!mounted) return null;

  const filteredTransactions = transactions.filter((tx) => {
    if (startDate && tx.date < startDate) return false;
    if (endDate && tx.date > endDate) return false;
    return true;
  });

  const totalRevenue = filteredTransactions.reduce((acc, curr) => acc + curr.fundsReceived, 0);
  const totalPaid = filteredTransactions.reduce((acc, curr) => acc + curr.fundsPaid, 0);
  const totalMargins = filteredTransactions.reduce((acc, curr) => acc + curr.netProfit, 0);

  const handleExport = () => {
    exportToCSV(filteredTransactions);
  };

  const handleExportTallyXML = () => {
    exportToTallyXML(filteredTransactions);
  };

  return (
    <div className="space-y-6 font-mono select-none">
      
      {/* Title Header */}
      <div className="border-b border-[#1B263B] pb-2">
        <h1 className="text-xl font-bold text-[#0D1B2A]">Reports &amp; Data Exports</h1>
        <p className="text-xs text-muted-foreground">Gateway of Ledger &gt; Reports &gt; Export Gateway</p>
      </div>

      {/* Main Export Display Box */}
      <div className="border border-[#1B263B] bg-[#f3f4f2] overflow-hidden max-w-2xl mx-auto">
        <div className="bg-[#0D1B2A] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider text-center">
          Data Export Gateway - CSV Spreadsheet
        </div>
        
        <div className="p-4 space-y-6 text-xs">
          
          {/* Custom Date Range Picker */}
          <div className="space-y-3">
            <span className="font-bold text-[#cc0000] block border-b border-[#1B263B]/20 pb-0.5 uppercase tracking-wider text-[9px]">
              Select Period Range
            </span>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              <button 
                onClick={() => setPreset("week")}
                className={`px-3 py-1 border font-bold cursor-pointer transition-colors text-[10px] ${
                  selectedRange === "week"
                    ? "bg-[#1B263B] text-white border-[#1B263B]"
                    : "bg-white text-[#1B263B] border-[#1B263B] hover:bg-[#E0E1DD]"
                }`}
              >
                Last Week
              </button>
              <button 
                onClick={() => setPreset("month")}
                className={`px-3 py-1 border font-bold cursor-pointer transition-colors text-[10px] ${
                  selectedRange === "month"
                    ? "bg-[#1B263B] text-white border-[#1B263B]"
                    : "bg-white text-[#1B263B] border-[#1B263B] hover:bg-[#E0E1DD]"
                }`}
              >
                Last Month
              </button>
              <button 
                onClick={() => setPreset("fy")}
                className={`px-3 py-1 border font-bold cursor-pointer transition-colors text-[10px] ${
                  selectedRange === "fy"
                    ? "bg-[#1B263B] text-white border-[#1B263B]"
                    : "bg-white text-[#1B263B] border-[#1B263B] hover:bg-[#E0E1DD]"
                }`}
              >
                Financial Year (2026-27)
              </button>
              <button 
                onClick={() => setPreset("all")}
                className={`px-3 py-1 border font-bold cursor-pointer transition-colors text-[10px] ${
                  selectedRange === "all"
                    ? "bg-[#1B263B] text-white border-[#1B263B]"
                    : "bg-white text-[#1B263B] border-[#1B263B] hover:bg-[#E0E1DD]"
                }`}
              >
                All Time
              </button>
            </div>

            {/* Custom Range Inputs */}
            <div className="flex flex-wrap items-center gap-3 bg-white p-2 border border-[#1B263B]/20">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0D1B2A]">From:</span>
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => handleCustomDateChange(e.target.value, endDate)}
                  className="bg-white border border-[#1B263B] px-1.5 py-0.5 font-mono text-[#0D1B2A] focus:bg-black focus:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0D1B2A]">To:</span>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => handleCustomDateChange(startDate, e.target.value)}
                  className="bg-white border border-[#1B263B] px-1.5 py-0.5 font-mono text-[#0D1B2A] focus:bg-black focus:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-[#cc0000] block border-b border-[#1B263B]/20 pb-0.5 mb-1 uppercase tracking-wider text-[9px]">
              Voucher Database Statistics (Filtered)
            </span>

            <div className="grid grid-cols-2 gap-y-2 border border-[#1B263B]/20 p-3 bg-white">
              <span className="font-bold text-[#0D1B2A]">Total Vouchers Count:</span>
              <span className="text-right font-bold font-mono text-[#0D1B2A]">{filteredTransactions.length} Entries</span>
              
              <span className="font-bold text-[#0D1B2A]">Aggregated Inward Funds:</span>
              <span className="text-right font-bold font-mono text-[#415A77]">₹{totalRevenue.toLocaleString("en-IN")}</span>

              <span className="font-bold text-[#0D1B2A]">Aggregated Outward Funds:</span>
              <span className="text-right font-bold font-mono text-[#cc0000]">₹{totalPaid.toLocaleString("en-IN")}</span>

              <span className="font-bold text-[#0D1B2A]">Net Aggregated Margin:</span>
              <span className="text-right font-bold font-mono text-[#0D1B2A]">₹{totalMargins.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="leading-relaxed text-[#0D1B2A] bg-[#E0E1DD]/30 p-2.5 border border-[#1B263B]/15">
              📥 Downloading this spreadsheet generates a standard, CA-compliant CSV file. It includes columns for Date, Godown Location, Quantities, Funds In/Out flow, calculated margins, and 18% GST audit traces. Perfect for submission during GST return filing or annual accounting audits.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 border-t border-[#1B263B]/20 pt-4">
            <button
              onClick={handleExport}
              disabled={filteredTransactions.length === 0}
              className={`font-bold px-6 py-2 border border-[#1B263B] text-xs transition-colors active:translate-y-0.5 cursor-pointer ${
                filteredTransactions.length === 0
                  ? "bg-[#E0E1DD] text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-[#415A77] hover:bg-[#1B263B] text-white"
              }`}
            >
              📊 Export Ledger Day Book (CSV)
            </button>
            <button
              onClick={handleExportTallyXML}
              disabled={filteredTransactions.length === 0}
              className={`font-bold px-6 py-2 border border-[#0D1B2A] text-xs transition-colors active:translate-y-0.5 cursor-pointer ${
                filteredTransactions.length === 0
                  ? "bg-[#E0E1DD] text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-[#0D1B2A] hover:bg-black text-white"
              }`}
            >
              🧱 Export Tally XML (Vouchers)
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
