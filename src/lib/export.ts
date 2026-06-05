import { getTransactions, type Transaction } from "./storage";

export function exportToCSV(transactionsToExport?: Transaction[]) {
  const transactions = transactionsToExport || getTransactions();
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

export function exportToTallyXML(transactionsToExport?: Transaction[]) {
  const transactions = transactionsToExport || getTransactions();
  if (transactions.length === 0) return;

  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "&": return "&amp;";
        case "'": return "&apos;";
        case "\"": return "&quot;";
        default: return c;
      }
    });
  };

  const vouchersXml = transactions.map((tx, idx) => {
    const formattedDate = tx.date.replace(/-/g, ""); // YYYYMMDD
    const godownNameEscaped = escapeXml(tx.godown);
    const voucherNo = idx + 1;
    const narration = escapeXml(
      `Smart Ledger Import - Godown: ${tx.godown}. Qty: ${tx.quantity} bags. Base Price: ₹${tx.basePrice}. GST (18%): ₹${tx.gstAmount}. Service Fee: ₹${tx.serviceFee}. Net Profit: ₹${tx.netProfit}.`
    );

    return `
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER ACTION="Create">
            <DATE>${formattedDate}</DATE>
            <VOUCHERTYPENAME>Journal</VOUCHERTYPENAME>
            <VOUCHERNUMBER>${voucherNo}</VOUCHERNUMBER>
            <NARRATION>${narration}</NARRATION>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${godownNameEscaped} - Inward Flow</LEDGERNAME>
              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
              <AMOUNT>-${tx.fundsReceived.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${godownNameEscaped} - Outward Handling</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>${tx.fundsPaid.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Logistics Service Fee Income</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>${tx.serviceFee.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Net Operational Surplus</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>${(tx.savings - tx.serviceFee).toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
          </VOUCHER>
        </TALLYMESSAGE>`;
  }).join("\n");

  const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
      </REQUESTDESC>
      <REQUESTDATA>${vouchersXml}
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;

  const blob = new Blob([xmlString], { type: "application/xml;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tally_import_${new Date().toISOString().split("T")[0]}.xml`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

