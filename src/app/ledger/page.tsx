"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { getTransactions, saveTransaction, type Transaction } from "@/lib/storage";

export default function LedgerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [godown, setGodown] = useState("Godown A - Mumbai");
  const [quantity, setQuantity] = useState("");
  const [fundsReceived, setFundsReceived] = useState("");
  const [fundsPaid, setFundsPaid] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [basePrice, setBasePrice] = useState("");

  useEffect(() => {
    setTransactions(getTransactions());
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Transaction Ledger</h1>
        <p className="text-muted-foreground mt-2">Log daily activities and automatically calculate savings and profits.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>New Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Godown</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={godown} 
                  onChange={(e) => setGodown(e.target.value)}
                >
                  <option>Godown A - Mumbai</option>
                  <option>Godown B - Delhi</option>
                  <option>Godown C - Bangalore</option>
                  <option>Godown D - Chennai</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity (Bags/Load)</label>
                <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Funds Received (₹)</label>
                <Input type="number" value={fundsReceived} onChange={(e) => setFundsReceived(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Funds Paid (₹)</label>
                <Input type="number" value={fundsPaid} onChange={(e) => setFundsPaid(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Service Fee (₹)</label>
                <Input type="number" value={serviceFee} onChange={(e) => setServiceFee(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Price (₹)</label>
                <Input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Save Transaction</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Godown</th>
                    <th className="px-4 py-3 font-medium text-right">Received</th>
                    <th className="px-4 py-3 font-medium text-right">Paid</th>
                    <th className="px-4 py-3 font-medium text-right">Net Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No transactions found</td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">{tx.date}</td>
                        <td className="px-4 py-3 font-medium">{tx.godown}</td>
                        <td className="px-4 py-3 text-right">₹{tx.fundsReceived.toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3 text-right">₹{tx.fundsPaid.toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3 text-right font-bold text-primary">₹{tx.netProfit.toLocaleString("en-IN")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
