"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getGodowns, saveGodown, getTransactions, type Godown, type Transaction } from "@/lib/storage";

const getNextId = (list: Godown[]) => {
  const ids = list.map((g) => {
    const num = parseInt(g.id.replace("GD-", ""), 10);
    return isNaN(num) ? 0 : num;
  });
  const max = Math.max(0, ...ids);
  return `GD-${String(max + 1).padStart(3, "0")}`;
};

export default function GodownsPage() {
  const router = useRouter();
  const [godowns, setGodowns] = useState<Godown[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mounted, setMounted] = useState(false);

  // Edit / Add Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingGodown, setEditingGodown] = useState<Godown | null>(null); // if null, we are adding
  const [name, setName] = useState("");
  const [manager, setManager] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  // History State
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyGodown, setHistoryGodown] = useState<Godown | null>(null);

  useEffect(() => {
    setGodowns(getGodowns());
    setTransactions(getTransactions());
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = editingGodown ? editingGodown.id : getNextId(godowns);
    const updatedGodown: Godown = {
      id: targetId,
      name: name.trim(),
      manager: manager.trim(),
      phone: phone.trim(),
      status: status,
    };
    saveGodown(updatedGodown);
    
    // Refresh list
    const updatedList = getGodowns();
    setGodowns(updatedList);
    
    // Close form
    setFormOpen(false);
    setEditingGodown(null);
    setName("");
    setManager("");
    setPhone("");
    setStatus("Active");
  };

  const handleOpenEdit = (g: Godown) => {
    setEditingGodown(g);
    setName(g.name);
    setManager(g.manager);
    setPhone(g.phone);
    setStatus(g.status);
    setFormOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingGodown(null);
    setName("");
    setManager("");
    setPhone("");
    setStatus("Active");
    setFormOpen(true);
  };

  const handleViewHistory = (g: Godown) => {
    setHistoryGodown(g);
    setHistoryOpen(true);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 font-mono select-none">
      
      {/* Title Header & Actions */}
      <div className="border-b border-[#1B263B] pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-[#0D1B2A]">Godown Master Directory</h1>
          <p className="text-xs text-muted-foreground">Gateway of Ledger &gt; Masters &gt; Godowns Directory</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="self-start md:self-auto bg-[#415A77] hover:bg-[#1B263B] text-white font-bold px-4 py-1.5 border border-[#1B263B] text-xs cursor-pointer transition-colors active:translate-y-0.5"
        >
          ➕ Add New Godown
        </button>
      </div>

      {/* Godown Master Registry List */}
      <div className="border border-[#1B263B] bg-[#f3f4f2] overflow-hidden">
        <div className="bg-[#0D1B2A] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider text-center">
          List of Godowns / Warehouses
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1B263B] bg-[#E0E1DD]/40">
                <th className="px-4 py-2 border-r border-[#1B263B] font-bold text-[#0D1B2A]">Godown ID</th>
                <th className="px-4 py-2 border-r border-[#1B263B] font-bold text-[#0D1B2A]">Location / Name</th>
                <th className="px-4 py-2 border-r border-[#1B263B] font-bold text-[#0D1B2A]">Warehouse Manager</th>
                <th className="px-4 py-2 border-r border-[#1B263B] font-bold text-[#0D1B2A]">Contact Details</th>
                <th className="px-4 py-2 border-r border-[#1B263B] font-bold text-[#0D1B2A] text-center">Status</th>
                <th className="px-4 py-2 font-bold text-[#0D1B2A] text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {godowns.map((godown) => (
                <tr key={godown.id} className="hover:bg-[#E0E1DD] border-b border-[#1B263B]/15 last:border-b-0">
                  <td className="px-4 py-2.5 border-r border-[#1B263B] font-bold text-[#cc0000]">{godown.id}</td>
                  <td className="px-4 py-2.5 border-r border-[#1B263B] font-semibold text-[#0D1B2A]">{godown.name}</td>
                  <td className="px-4 py-2.5 border-r border-[#1B263B]">{godown.manager}</td>
                  <td className="px-4 py-2.5 border-r border-[#1B263B]">{godown.phone}</td>
                  <td className="px-4 py-2.5 border-r border-[#1B263B] text-center">
                    <span className={`inline-block text-white px-1.5 py-0.5 font-bold text-[9px] uppercase tracking-wide ${
                      godown.status === "Active" ? "bg-[#1B263B]" : "bg-[#cc0000]"
                    }`}>
                      {godown.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => handleOpenEdit(godown)}
                        className="bg-white border border-[#1B263B] text-[#0D1B2A] hover:bg-[#1B263B] hover:text-white px-2 py-0.5 font-bold text-[10px] cursor-pointer"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleViewHistory(godown)}
                        className="bg-[#415A77] text-white hover:bg-[#1B263B] border border-[#1B263B] px-2 py-0.5 font-bold text-[10px] cursor-pointer"
                      >
                        History
                      </button>
                      <button 
                        onClick={() => router.push(`/ledger/godown-vouchers?godown=${encodeURIComponent(godown.name)}`)}
                        className="bg-[#0D1B2A] text-white hover:bg-black border border-[#0D1B2A] px-2 py-0.5 font-bold text-[10px] cursor-pointer"
                      >
                        Ledger
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal Dialog */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-md border border-[#1B263B] bg-[#f3f4f2] shadow-xl overflow-hidden font-mono text-xs">
            <div className="bg-[#0D1B2A] text-white px-3 py-1.5 flex items-center justify-between font-bold uppercase">
              <span>{editingGodown ? "Edit Godown Hub" : "Add Godown Hub"}</span>
              <button onClick={() => setFormOpen(false)} className="hover:bg-red-700 px-1.5 font-bold cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#0D1B2A]">Godown Location Name</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nagpur Terminal"
                    required
                    className="bg-white border border-[#1B263B] px-2 py-1 font-mono text-[#0D1B2A] focus:bg-black focus:text-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#0D1B2A]">Warehouse Manager</label>
                  <input 
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    placeholder="e.g. Devendra F"
                    required
                    className="bg-white border border-[#1B263B] px-2 py-1 font-mono text-[#0D1B2A] focus:bg-black focus:text-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#0D1B2A]">Contact Details (Phone)</label>
                  <input 
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43228"
                    required
                    className="bg-white border border-[#1B263B] px-2 py-1 font-mono text-[#0D1B2A] focus:bg-black focus:text-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#0D1B2A]">Operational Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                    className="bg-white border border-[#1B263B] px-2 py-1 font-mono text-[#0D1B2A] focus:bg-black focus:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E0E1DD]">
                <button 
                  type="button" 
                  onClick={() => setFormOpen(false)}
                  className="bg-[#cc0000] hover:bg-red-800 text-white font-bold px-3 py-1 border border-[#1B263B] cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#415A77] hover:bg-[#1B263B] text-white font-bold px-4 py-1 border border-[#1B263B] cursor-pointer"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick History Modal */}
      {historyOpen && historyGodown && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-2xl border border-[#1B263B] bg-[#E0E1DD] shadow-xl overflow-hidden font-mono text-xs">
            <div className="bg-[#0D1B2A] text-white px-3 py-1.5 flex items-center justify-between font-bold uppercase">
              <span>Quick History: {historyGodown.name} ({historyGodown.id})</span>
              <button onClick={() => setHistoryOpen(false)} className="hover:bg-red-700 px-1.5 font-bold cursor-pointer">✕</button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Aggregated Quick Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border border-[#1B263B]/20 p-2 bg-[#f3f4f2]/60">
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#cc0000] uppercase font-bold">Total Loads Logged</span>
                  <span className="font-bold text-[#0D1B2A] text-sm">
                    {transactions.filter((t) => t.godown === historyGodown.name).length} Vouchers
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#cc0000] uppercase font-bold">Total Bags/Quantity</span>
                  <span className="font-bold text-[#0D1B2A] text-sm">
                    {transactions.filter((t) => t.godown === historyGodown.name).reduce((sum, t) => sum + t.quantity, 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#cc0000] uppercase font-bold">Total Inward Funds</span>
                  <span className="font-bold text-[#415A77] text-sm">
                    ₹{transactions.filter((t) => t.godown === historyGodown.name).reduce((sum, t) => sum + t.fundsReceived, 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#cc0000] uppercase font-bold">Total Net Profit</span>
                  <span className="font-bold text-[#0D1B2A] text-sm">
                    ₹{transactions.filter((t) => t.godown === historyGodown.name).reduce((sum, t) => sum + t.netProfit, 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="border border-[#1B263B] bg-[#f3f4f2]/60 overflow-hidden max-h-[300px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-[#0D1B2A] text-white font-bold border-b border-[#1B263B]">
                      <th className="px-2 py-1.5 border-r border-white/20">Date</th>
                      <th className="px-2 py-1.5 border-r border-white/20 text-right">Qty</th>
                      <th className="px-2 py-1.5 border-r border-white/20 text-right">Inward</th>
                      <th className="px-2 py-1.5 border-r border-white/20 text-right">Outward</th>
                      <th className="px-2 py-1.5 border-r border-white/20 text-right">GST (18%)</th>
                      <th className="px-2 py-1.5 text-right">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.filter((t) => t.godown === historyGodown.name).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-2 py-6 text-center text-muted-foreground font-sans">
                          No transactions recorded for this godown yet.
                        </td>
                      </tr>
                    ) : (
                      transactions.filter((t) => t.godown === historyGodown.name).map((t) => (
                        <tr key={t.id} className="border-b border-[#1B263B]/15 last:border-b-0 hover:bg-[#E0E1DD]">
                          <td className="px-2 py-1 border-r border-[#1B263B] whitespace-nowrap">{t.date}</td>
                          <td className="px-2 py-1 border-r border-[#1B263B] text-right font-bold">{t.quantity}</td>
                          <td className="px-2 py-1 border-r border-[#1B263B] text-right text-[#415A77]">₹{t.fundsReceived.toLocaleString("en-IN")}</td>
                          <td className="px-2 py-1 border-r border-[#1B263B] text-right text-[#cc0000]">₹{t.fundsPaid.toLocaleString("en-IN")}</td>
                          <td className="px-2 py-1 border-r border-[#1B263B] text-right">₹{t.gstAmount.toLocaleString("en-IN")}</td>
                          <td className="px-2 py-1 text-right font-bold text-[#0D1B2A]">₹{t.netProfit.toLocaleString("en-IN")}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E0E1DD]">
                <button 
                  onClick={() => router.push(`/ledger/godown-vouchers?godown=${encodeURIComponent(historyGodown.name)}`)}
                  className="bg-[#0D1B2A] hover:bg-black text-white font-bold px-4 py-1 border border-[#0D1B2A] cursor-pointer"
                >
                  🔍 View Complete Ledger
                </button>
                <button 
                  onClick={() => setHistoryOpen(false)}
                  className="bg-[#415A77] hover:bg-[#1B263B] text-white font-bold px-5 py-1 border border-[#1B263B] cursor-pointer"
                >
                  Close History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info Box */}
      <div className="p-3 border border-dashed border-[#1B263B] bg-[#f3f4f2]/60 text-xs leading-relaxed text-[#1B263B]">
        <span className="font-bold">Note on Masters:</span> These locations represent verified hub centers of <span className="font-bold">Smart Ledger Logistics</span>. 
        Each Godown coordinates stock entries, freight values, and agent commissions. To add or update a master terminal, use the actions listed above.
      </div>
      
    </div>
  );
}
