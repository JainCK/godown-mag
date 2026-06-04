"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { exportToCSV } from "@/lib/export";
import { getTransactions, type Transaction } from "@/lib/storage";
import { FileSpreadsheet, Download } from "lucide-react";

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTransactions(getTransactions());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports & Exports</h1>
        <p className="text-muted-foreground mt-2">Download your financial data for official book-keeping.</p>
      </div>

      <Card>
        <CardHeader className="border-b border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
              Full Export
            </CardTitle>
            <Button onClick={exportToCSV} disabled={transactions.length === 0} className="font-semibold">
              <Download className="mr-2 h-4 w-4" /> Download CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-secondary p-4 mb-4">
              <FileSpreadsheet className="h-10 w-10 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-bold">Export All Records</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Download a clean, structured CSV spreadsheet containing all {transactions.length} transaction entries currently logged in the system. Perfect for sending to your CA during tax season.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
