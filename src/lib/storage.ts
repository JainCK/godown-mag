export interface Transaction {
  id: string;
  date: string;
  godown: string;
  quantity: number;
  fundsReceived: number;
  fundsPaid: number;
  serviceFee: number;
  basePrice: number;
  savings: number;
  gstAmount: number;
  netProfit: number;
}

const MOCK_DATA: Transaction[] = [
  {
    id: "1",
    date: new Date().toISOString().split("T")[0],
    godown: "Godown A - Mumbai",
    quantity: 100,
    fundsReceived: 50000,
    fundsPaid: 45000,
    serviceFee: 2000,
    basePrice: 40000,
    savings: 5000,
    gstAmount: 7200,
    netProfit: 7000,
  },
  {
    id: "2",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    godown: "Godown B - Delhi",
    quantity: 200,
    fundsReceived: 100000,
    fundsPaid: 92000,
    serviceFee: 4000,
    basePrice: 85000,
    savings: 8000,
    gstAmount: 15300,
    netProfit: 12000,
  },
];

const STORAGE_KEY = "smart_ledger_transactions";

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
    return MOCK_DATA;
  }
  return JSON.parse(data);
}

export function saveTransaction(transaction: Omit<Transaction, "id" | "savings" | "gstAmount" | "netProfit">) {
  const transactions = getTransactions();
  
  const savings = transaction.fundsReceived - transaction.fundsPaid;
  const gstAmount = transaction.basePrice * 0.18;
  const netProfit = transaction.serviceFee + savings;

  const newTx: Transaction = {
    ...transaction,
    id: Math.random().toString(36).substring(7),
    savings,
    gstAmount,
    netProfit,
  };

  transactions.unshift(newTx);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  return newTx;
}
