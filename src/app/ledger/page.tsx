"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTransactions, saveTransaction, getGodowns, type Transaction, type Godown } from "@/lib/storage";

export default function LedgerPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [godownsList, setGodownsList] = useState<Godown[]>([]);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [godown, setGodown] = useState("");
  const [quantity, setQuantity] = useState("");
  const [fundsReceived, setFundsReceived] = useState("");
  const [fundsPaid, setFundsPaid] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [basePrice, setBasePrice] = useState("");

  useEffect(() => {
    const txs = getTransactions();
    const activeGodowns = getGodowns().filter((g) => g.status === "Active");
    setTransactions(txs);
    setGodownsList(activeGodowns);
    if (activeGodowns.length > 0) {
      setGodown(activeGodowns[0].name);
    }
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx = saveTransaction({
      date,
      godown,
      quantity: Number(quantity),
      fundsReceived: Number(fundsReceived),
      fundsPaid: Number(fundsPaid),
      serviceFee: Number(serviceFee),
      basePrice: Number(basePrice),
    });
    setTransactions([newTx, ...transactions]);
    
    // Reset Form
    setQuantity("");
    setFundsReceived("");
    setFundsPaid("");
    setServiceFee("");
    setBasePrice("");
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 font-mono select-none">
      
      {/* Title Header */}
      <div className="border-b border-[#1B263B] pb-2">
        <h1 className="text-xl font-bold text-[#0D1B2A]">Inventory Voucher Entry</h1>
        <p className="text-xs text-muted-foreground">Gateway of Ledger &gt; Transactions &gt; Vouchers</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-5 items-start">
        
        {/* Voucher Input (Left Pane - 3 cols) */}
        <div className="xl:col-span-3 border border-[#1B263B] bg-[#f3f4f2] overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-[#0D1B2A] text-white px-3 py-1 flex items-center justify-between font-bold text-xs uppercase">
            <span>Voucher Creation</span>
            <span className="text-[#E0E1DD]">Smart Ledger Systems</span>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
            
            {/* Voucher Details Sub-Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#1B263B]/30 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#cc0000] text-white px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
                  Stock Journal
                </span>
                <span className="font-bold text-[#0D1B2A] font-mono">
                  No. {transactions.length + 1}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0D1B2A]">Date:</span>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                  className="bg-white border border-[#1B263B] px-2 py-0.5 font-mono text-[#0D1B2A] focus:bg-black focus:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Voucher Body Columns (Transfer of Materials Layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-[#1B263B]/30 pb-4">
              
              {/* Left Column: Destination Info */}
              <div className="space-y-3">
                <span className="font-bold text-[#cc0000] block border-b border-[#1B263B]/20 pb-0.5 mb-1 uppercase tracking-wider text-[9px]">
                  Location & Destination Details
                </span>

                <div className="space-y-1">
                  <label className="block font-bold text-[#0D1B2A]">Destination Godown</label>
                  <select 
                    value={godown} 
                    onChange={(e) => setGodown(e.target.value)}
                    className="w-full bg-white border border-[#1B263B] px-2 py-1 font-mono text-[#0D1B2A] focus:bg-black focus:text-white focus:outline-none cursor-pointer"
                  >
                    {godownsList.map((g) => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                  <div className="pt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (godown) {
                          router.push(`/ledger/godown-vouchers?godown=${encodeURIComponent(godown)}`);
                        }
                      }}
                      className="text-[#cc0000] hover:text-white hover:bg-[#cc0000] border border-[#cc0000] px-2 py-1 font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 w-full justify-center"
                    >
                      🔍 View Complete Godown Ledger
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-[#0D1B2A]">Material Quantity (Bags/Load)</label>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    placeholder="e.g. 150"
                    required 
                    className="w-full bg-white border border-[#1B263B] px-2 py-1 font-mono text-[#0D1B2A] focus:bg-black focus:text-white placeholder:text-gray-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-[#0D1B2A]">Base Material Value (₹)</label>
                  <input 
                    type="number" 
                    value={basePrice} 
                    onChange={(e) => setBasePrice(e.target.value)} 
                    placeholder="e.g. 75000"
                    required 
                    className="w-full bg-white border border-[#1B263B] px-2 py-1 font-mono text-[#0D1B2A] focus:bg-black focus:text-white placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Right Column: Financial Flows */}
              <div className="space-y-3">
                <span className="font-bold text-[#cc0000] block border-b border-[#1B263B]/20 pb-0.5 mb-1 uppercase tracking-wider text-[9px]">
                  Consolidated Accounts Flow
                </span>

                <div className="space-y-1">
                  <label className="block font-bold text-[#0D1B2A]">Funds Received / Freight Inward (₹)</label>
                  <input 
                    type="number" 
                    value={fundsReceived} 
                    onChange={(e) => setFundsReceived(e.target.value)} 
                    placeholder="e.g. 95000"
                    required 
                    className="w-full bg-white border border-[#1B263B] px-2 py-1 font-mono text-[#0D1B2A] focus:bg-black focus:text-white placeholder:text-gray-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-[#0D1B2A]">Funds Paid / Handling Outward (₹)</label>
                  <input 
                    type="number" 
                    value={fundsPaid} 
                    onChange={(e) => setFundsPaid(e.target.value)} 
                    placeholder="e.g. 88000"
                    required 
                    className="w-full bg-white border border-[#1B263B] px-2 py-1 font-mono text-[#0D1B2A] focus:bg-black focus:text-white placeholder:text-gray-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-[#0D1B2A]">Logistics Service Charge (₹)</label>
                  <input 
                    type="number" 
                    value={serviceFee} 
                    onChange={(e) => setServiceFee(e.target.value)} 
                    placeholder="e.g. 5000"
                    required 
                    className="w-full bg-white border border-[#1B263B] px-2 py-1 font-mono text-[#0D1B2A] focus:bg-black focus:text-white placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Voucher Footer Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-muted-foreground">
                * GST and Net Margins will calculate automatically.
              </span>
              <button 
                type="submit" 
                className="bg-[#415A77] hover:bg-[#1B263B] text-white font-bold px-4 py-1.5 border border-[#1B263B] cursor-pointer text-xs transition-colors active:translate-y-0.5"
              >
                Accept Voucher
              </button>
            </div>

          </form>
        </div>

        {/* Tally Day Book Registry (Right Pane - 2 cols) */}
        <div className="xl:col-span-2 border border-[#1B263B] bg-[#f3f4f2] overflow-hidden">
          <div className="bg-[#0D1B2A] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider text-center">
            Day Book (Voucher Log)
          </div>
          
          <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1B263B] bg-[#E0E1DD]/40">
                  <th className="px-3 py-2 border-r border-[#1B263B] font-bold text-[#0D1B2A]">Date</th>
                  <th className="px-3 py-2 border-r border-[#1B263B] font-bold text-[#0D1B2A]">Godown</th>
                  <th className="px-3 py-2 font-bold text-[#0D1B2A] text-right">Received</th>
                  <th className="px-3 py-2 font-bold text-[#0D1B2A] text-right">Paid</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground font-sans">
                      No vouchers found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#E0E1DD] border-b border-[#1B263B]/15 last:border-b-0">
                      <td className="px-3 py-2 border-r border-[#1B263B] whitespace-nowrap">{tx.date}</td>
                      <td className="px-3 py-2 border-r border-[#1B263B] font-bold">{tx.godown.split(" - ")[0]}</td>
                      <td className="px-3 py-2 text-right text-[#415A77] font-bold">₹{tx.fundsReceived}</td>
                      <td className="px-3 py-2 text-right text-[#cc0000] font-bold">₹{tx.fundsPaid}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
