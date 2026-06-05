"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getTransactions, getGodowns, type Transaction, type Godown } from "@/lib/storage";
import { exportToCSV, exportToTallyXML } from "@/lib/export";

function GodownVouchersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedGodown, setSelectedGodown] = useState("");
  const [godownsList, setGodownsList] = useState<Godown[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const godownParam = searchParams.get("godown");
    const activeGodowns = getGodowns().filter((g) => g.status === "Active");
    const txs = getTransactions();
    
    setGodownsList(activeGodowns);
    setAllTransactions(txs);

    if (godownParam) {
      setSelectedGodown(godownParam);
    } else if (activeGodowns.length > 0) {
      setSelectedGodown(activeGodowns[0].name);
    }
    setMounted(true);
  }, [searchParams]);

  if (!mounted) return null;

  // Filter transactions for the selected godown
  const filteredTxs = allTransactions.filter(
    (tx) => tx.godown.toLowerCase() === selectedGodown.toLowerCase()
  );

  // Compute totals
  const totalQty = filteredTxs.reduce((sum, tx) => sum + tx.quantity, 0);
  const totalBasePrice = filteredTxs.reduce((sum, tx) => sum + tx.basePrice, 0);
  const totalReceived = filteredTxs.reduce((sum, tx) => sum + tx.fundsReceived, 0);
  const totalPaid = filteredTxs.reduce((sum, tx) => sum + tx.fundsPaid, 0);
  const totalServiceFee = filteredTxs.reduce((sum, tx) => sum + tx.serviceFee, 0);
  const totalSavings = filteredTxs.reduce((sum, tx) => sum + tx.savings, 0);
  const totalGST = filteredTxs.reduce((sum, tx) => sum + tx.gstAmount, 0);
  const totalProfit = filteredTxs.reduce((sum, tx) => sum + tx.netProfit, 0);



  const handleExport = () => {
    exportToCSV(filteredTxs);
  };

  const handleExportTallyXML = () => {
    exportToTallyXML(filteredTxs);
  };

  return (
    <div className="space-y-6 font-mono select-none">
      {/* Title Header */}
      <div className="border-b border-[#1B263B] pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0D1B2A]">Godown Vouchers Ledger</h1>
          <p className="text-xs text-muted-foreground">
            Gateway of Ledger &gt; Reports &gt; Godown Ledger
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={() => router.push("/ledger")}
            className="bg-[#415A77] hover:bg-[#1B263B] text-white font-bold px-3 py-1.5 border border-[#1B263B] cursor-pointer text-xs transition-colors"
          >
            ← Back to Voucher Entry
          </button>
        </div>
      </div>

      {/* Selector and Actions Bar */}
      <div className="border border-[#1B263B] bg-[#f3f4f2] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <label className="font-bold text-[#0D1B2A]">Select Godown:</label>
          <select
            value={selectedGodown}
            onChange={(e) => setSelectedGodown(e.target.value)}
            className="bg-white border border-[#1B263B] px-3 py-1.5 font-mono text-[#0D1B2A] focus:bg-black focus:text-white focus:outline-none cursor-pointer min-w-[200px]"
          >
            {godownsList.map((g) => (
              <option key={g.id} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="bg-[#415A77] hover:bg-[#1B263B] text-white font-bold px-3 py-1.5 border border-[#1B263B] cursor-pointer transition-colors"
            disabled={filteredTxs.length === 0}
          >
            📊 Export CSV
          </button>
          <button
            onClick={handleExportTallyXML}
            className="bg-[#0D1B2A] hover:bg-black text-white font-bold px-3 py-1.5 border border-[#0D1B2A] cursor-pointer transition-colors"
            disabled={filteredTxs.length === 0}
          >
            🧱 Export Tally XML
          </button>
        </div>
      </div>

      {/* Main Ledger Book */}
      <div className="border border-[#1B263B] bg-[#f3f4f2] overflow-hidden">
        {/* Header Banner */}
        <div className="bg-[#0D1B2A] text-white px-4 py-1.5 flex items-center justify-between font-bold text-xs uppercase">
          <span>Ledger Statement: {selectedGodown || "No Godown Selected"}</span>
          <span className="text-[#E0E1DD]">{filteredTxs.length} Vouchers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[#1B263B] bg-[#E0E1DD]/60 text-[#0D1B2A]">
                <th className="px-3 py-2.5 border-r border-[#1B263B] font-bold">Voucher ID</th>
                <th className="px-3 py-2.5 border-r border-[#1B263B] font-bold">Date</th>
                <th className="px-3 py-2.5 border-r border-[#1B263B] font-bold text-right">Quantity (Bags)</th>
                <th className="px-3 py-2.5 border-r border-[#1B263B] font-bold text-right">Base Price</th>
                <th className="px-3 py-2.5 border-r border-[#1B263B] font-bold text-right">Inward Funds</th>
                <th className="px-3 py-2.5 border-r border-[#1B263B] font-bold text-right">Outward Funds</th>
                <th className="px-3 py-2.5 border-r border-[#1B263B] font-bold text-right">Savings</th>
                <th className="px-3 py-2.5 border-r border-[#1B263B] font-bold text-right">GST (18%)</th>
                <th className="px-3 py-2.5 font-bold text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground font-sans">
                    No vouchers found for this godown.
                  </td>
                </tr>
              ) : (
                filteredTxs.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#E0E1DD] border-b border-[#1B263B]/15 last:border-0">
                    <td className="px-3 py-2 border-r border-[#1B263B] font-mono text-[10px] text-gray-600">
                      {tx.id.toUpperCase()}
                    </td>
                    <td className="px-3 py-2 border-r border-[#1B263B] whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="px-3 py-2 border-r border-[#1B263B] text-right font-semibold">
                      {tx.quantity}
                    </td>
                    <td className="px-3 py-2 border-r border-[#1B263B] text-right">
                      ₹{tx.basePrice.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 border-r border-[#1B263B] text-right text-[#415A77] font-semibold">
                      ₹{tx.fundsReceived.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 border-r border-[#1B263B] text-right text-[#cc0000]">
                      ₹{tx.fundsPaid.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 border-r border-[#1B263B] text-right">
                      ₹{tx.savings.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 border-r border-[#1B263B] text-right text-gray-500">
                      ₹{tx.gstAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-[#0D1B2A]">
                      ₹{tx.netProfit.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              )}

              {/* Total Row */}
              {filteredTxs.length > 0 && (
                <tr className="border-t-2 border-[#1B263B] bg-[#E0E1DD]/40 font-bold">
                  <td colSpan={2} className="px-3 py-2.5 border-r border-[#1B263B] text-[#0D1B2A] uppercase text-[10px] tracking-wider">
                    Total
                  </td>
                  <td className="px-3 py-2.5 border-r border-[#1B263B] text-right text-[#0D1B2A]">
                    {totalQty}
                  </td>
                  <td className="px-3 py-2.5 border-r border-[#1B263B] text-right text-[#0D1B2A]">
                    ₹{totalBasePrice.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2.5 border-r border-[#1B263B] text-right text-[#415A77]">
                    ₹{totalReceived.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2.5 border-r border-[#1B263B] text-right text-[#cc0000]">
                    ₹{totalPaid.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2.5 border-r border-[#1B263B] text-right text-[#0D1B2A]">
                    ₹{totalSavings.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2.5 border-r border-[#1B263B] text-right text-gray-500">
                    ₹{totalGST.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2.5 text-right text-[#0D1B2A] text-sm">
                    ₹{totalProfit.toLocaleString("en-IN")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function GodownVouchersPage() {
  return (
    <Suspense fallback={<div className="p-6 font-mono text-xs">Loading ledger view...</div>}>
      <GodownVouchersContent />
    </Suspense>
  );
}
