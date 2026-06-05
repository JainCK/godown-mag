"use client";

import { useEffect, useState } from "react";
import { getTransactions, getGodowns, type Transaction, type Godown } from "@/lib/storage";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [godownsList, setGodownsList] = useState<Godown[]>([]);
  const [selectedGodown, setSelectedGodown] = useState("All Godowns");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTransactions(getTransactions());
    setGodownsList(getGodowns());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedGodown !== "All Godowns" && tx.godown !== selectedGodown) {
      return false;
    }
    if (startDate && tx.date < startDate) {
      return false;
    }
    if (endDate && tx.date > endDate) {
      return false;
    }
    return true;
  });

  const totalServiceFees = filteredTransactions.reduce((acc, curr) => acc + curr.serviceFee, 0);
  const totalSavings = filteredTransactions.reduce((acc, curr) => acc + curr.savings, 0);
  const totalReceived = filteredTransactions.reduce((acc, curr) => acc + curr.fundsReceived, 0);
  const totalPaid = filteredTransactions.reduce((acc, curr) => acc + curr.fundsPaid, 0);
  const netProfit = filteredTransactions.reduce((acc, curr) => acc + curr.netProfit, 0);

  return (
    <div className="space-y-6 font-mono select-none">
      
      {/* Title Header */}
      <div className="border-b border-[#1B263B] pb-2">
        <h1 className="text-xl font-bold text-[#0D1B2A]">Overview Dashboard</h1>
        <p className="text-xs text-muted-foreground">Gateway of Ledger &gt; Dashboard Summary</p>
      </div>

      {/* Filters Toolbar */}
      <div className="border border-[#1B263B] bg-[#E0E1DD]/30 p-3 flex flex-wrap items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#0D1B2A]">Filter Godown:</span>
          <select 
            value={selectedGodown}
            onChange={(e) => setSelectedGodown(e.target.value)}
            className="bg-white border border-[#1B263B] px-2 py-1 font-mono text-[#0D1B2A] focus:bg-black focus:text-white focus:outline-none cursor-pointer"
          >
            <option value="All Godowns">All Godowns</option>
            {godownsList.map((g) => (
              <option key={g.id} value={g.name}>{g.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-[#0D1B2A]">Period From:</span>
          <input 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white border border-[#1B263B] px-2 py-0.5 font-mono text-[#0D1B2A] focus:bg-black focus:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-[#0D1B2A]">To:</span>
          <input 
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white border border-[#1B263B] px-2 py-0.5 font-mono text-[#0D1B2A] focus:bg-black focus:text-white focus:outline-none"
          />
        </div>

        <button 
          onClick={() => {
            setSelectedGodown("All Godowns");
            setStartDate("");
            setEndDate("");
          }}
          className="bg-[#cc0000] hover:bg-red-800 text-white font-bold px-3 py-1 border border-[#1B263B] cursor-pointer transition-colors active:translate-y-0.5"
        >
          Reset Filters
        </button>
      </div>

      {/* Main Financials in Tally Trial Balance Style */}
      <div className="border border-[#1B263B] bg-[#f3f4f2] overflow-hidden">
        <div className="bg-[#0D1B2A] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider text-center">
          Profit &amp; Loss Statement (Financial Year 2026-27)
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1B263B] bg-[#E0E1DD]/40">
                <th className="px-4 py-2 border-r border-[#1B263B] font-bold text-[#0D1B2A]">Particulars</th>
                <th className="px-4 py-2 border-r border-[#1B263B] font-bold text-[#0D1B2A] text-right">Debit (Paid)</th>
                <th className="px-4 py-2 font-bold text-[#0D1B2A] text-right">Credit (Received)</th>
              </tr>
            </thead>
            <tbody>
              {/* Direct Incomes & Expenses */}
              <tr className="hover:bg-[#E0E1DD]">
                <td className="px-4 py-2 border-r border-[#1B263B] font-semibold text-[#0D1B2A]">Direct Inward Funds (Received)</td>
                <td className="px-4 py-2 border-r border-[#1B263B] text-right text-muted-foreground">-</td>
                <td className="px-4 py-2 text-right font-bold text-[#0D1B2A]">₹{totalReceived.toLocaleString("en-IN")}</td>
              </tr>
              <tr className="hover:bg-[#E0E1DD]">
                <td className="px-4 py-2 border-r border-[#1B263B] font-semibold text-[#0D1B2A]">Direct Outward Funds (Paid)</td>
                <td className="px-4 py-2 border-r border-[#1B263B] text-right font-bold text-[#cc0000]">₹{totalPaid.toLocaleString("en-IN")}</td>
                <td className="px-4 py-2 text-right text-muted-foreground">-</td>
              </tr>
              
              {/* Service Fees */}
              <tr className="hover:bg-[#E0E1DD] border-t border-[#1B263B]/20">
                <td className="px-4 py-2 border-r border-[#1B263B] font-semibold text-[#0D1B2A] pl-6">Service Fees Earned</td>
                <td className="px-4 py-2 border-r border-[#1B263B] text-right text-muted-foreground">-</td>
                <td className="px-4 py-2 text-right font-bold text-[#0D1B2A]">₹{totalServiceFees.toLocaleString("en-IN")}</td>
              </tr>

              {/* Savings */}
              <tr className="hover:bg-[#E0E1DD]">
                <td className="px-4 py-2 border-r border-[#1B263B] font-semibold text-[#0D1B2A] pl-6">Godown Margin/Savings</td>
                <td className="px-4 py-2 border-r border-[#1B263B] text-right text-muted-foreground">-</td>
                <td className="px-4 py-2 text-right font-bold text-[#415A77]">₹{totalSavings.toLocaleString("en-IN")}</td>
              </tr>

              {/* Total & Profit/Loss */}
              <tr className="bg-[#E0E1DD]/40 border-t border-[#1B263B] font-bold">
                <td className="px-4 py-2 border-r border-[#1B263B] text-[#0D1B2A]">Total Operating Turnover</td>
                <td className="px-4 py-2 border-r border-[#1B263B] text-right text-[#cc0000]">₹{totalPaid.toLocaleString("en-IN")}</td>
                <td className="px-4 py-2 text-right text-[#0D1B2A]">₹{(totalReceived + totalServiceFees).toLocaleString("en-IN")}</td>
              </tr>
              
              <tr className="bg-[#1B263B] text-white font-bold">
                <td className="px-4 py-2 border-r border-white/20">Net Operating Profit</td>
                <td className="px-4 py-2 border-r border-white/20 text-right">-</td>
                <td className="px-4 py-2 text-right text-[#E0E1DD]">₹{netProfit.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Voucher Entries Table */}
      <div className="border border-[#1B263B] bg-[#f3f4f2] overflow-hidden">
        <div className="bg-[#0D1B2A] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider text-center">
          Day Book (Recent Vouchers)
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1B263B] bg-[#E0E1DD]/40">
                <th className="px-4 py-2 border-r border-[#1B263B] font-bold text-[#0D1B2A]">Date</th>
                <th className="px-4 py-2 border-r border-[#1B263B] font-bold text-[#0D1B2A]">Godown Name</th>
                <th className="px-4 py-2 border-r border-[#1B263B] font-bold text-[#0D1B2A] text-right">Net Profit</th>
                <th className="px-4 py-2 font-bold text-[#0D1B2A] text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground font-sans">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.slice(0, 8).map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#E0E1DD] border-b border-[#1B263B]/15 last:border-b-0">
                    <td className="px-4 py-2 border-r border-[#1B263B]">{tx.date}</td>
                    <td className="px-4 py-2 border-r border-[#1B263B] font-semibold">{tx.godown}</td>
                    <td className="px-4 py-2 border-r border-[#1B263B] text-right font-bold text-[#0D1B2A]">
                      ₹{tx.netProfit.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <span className="text-[10px] bg-[#1B263B]/10 text-[#1B263B] px-1 font-bold">Entered</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
