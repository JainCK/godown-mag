import { getTransactions } from "./storage";

export function exportToCSV() {
  const transactions = getTransactions();
  if (transactions.length === 0) return;

  const headers = [
    "Date",
    "Godown",
    "Quantity",
    "Funds Received",
    "Funds Paid",
    "Service Fee",
    "Base Price",
    "Savings",
    "GST Amount",
    "Net Profit",
  ];

  const csvRows = [
    headers.join(","),
    ...transactions.map((tx) =>
      [
        tx.date,
        `"${tx.godown}"`,
        tx.quantity,
        tx.fundsReceived,
        tx.fundsPaid,
        tx.serviceFee,
        tx.basePrice,
        tx.savings,
        tx.gstAmount,
        tx.netProfit,
      ].join(",")
    ),
  ];

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ledger_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
