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

export interface Godown {
  id: string;
  name: string;
  manager: string;
  phone: string;
  status: "Active" | "Inactive";
}

const DEFAULT_GODOWNS: Godown[] = [
  { id: "GD-001", name: "Mumbai Hub", manager: "Rahul Sharma", phone: "+91 98765 43210", status: "Active" },
  { id: "GD-002", name: "Delhi Cargo Terminal", manager: "Amit Singh", phone: "+91 98765 43211", status: "Active" },
  { id: "GD-003", name: "Bangalore Depot", manager: "Priya Patel", phone: "+91 98765 43212", status: "Active" },
  { id: "GD-004", name: "Chennai Port Yard", manager: "Karthik N", phone: "+91 98765 43213", status: "Active" },
  { id: "GD-005", name: "Kolkata Dockyard", manager: "Subhash Bose", phone: "+91 98765 43214", status: "Active" },
  { id: "GD-006", name: "Hyderabad Terminal", manager: "Venkatesh K", phone: "+91 98765 43215", status: "Active" },
  { id: "GD-007", name: "Ahmedabad Yard", manager: "Hardik Patel", phone: "+91 98765 43216", status: "Active" },
  { id: "GD-008", name: "Pune Logistics Hub", manager: "Sachin T", phone: "+91 98765 43217", status: "Active" },
  { id: "GD-009", name: "Cochin Harbour Depot", manager: "Mathew Thomas", phone: "+91 98765 43218", status: "Active" },
  { id: "GD-010", name: "Jaipur Freight Terminal", manager: "Rajendra S", phone: "+91 98765 43219", status: "Active" },
  { id: "GD-011", name: "Lucknow Depot", manager: "Akhilesh Y", phone: "+91 98765 43220", status: "Active" },
  { id: "GD-012", name: "Patna Cargo Hub", manager: "Nitish K", phone: "+91 98765 43221", status: "Active" },
  { id: "GD-013", name: "Bhopal Hub", manager: "Shivraj C", phone: "+91 98765 43222", status: "Active" },
  { id: "GD-014", name: "Indore Yard", manager: "Kailash V", phone: "+91 98765 43223", status: "Active" },
  { id: "GD-015", name: "Chandigarh Depot", manager: "Bhagwant M", phone: "+91 98765 43224", status: "Active" },
  { id: "GD-016", name: "Guwahati Freight Hub", manager: "Himanta S", phone: "+91 98765 43225", status: "Active" },
  { id: "GD-017", name: "Surat Yard", manager: "C.R. Patil", phone: "+91 98765 43226", status: "Active" },
  { id: "GD-018", name: "Vadodara Depot", manager: "Vijay R", phone: "+91 98765 43227", status: "Active" },
  { id: "GD-019", name: "Nagpur Terminal", manager: "Devendra F", phone: "+91 98765 43228", status: "Active" },
  { id: "GD-020", name: "Visakhapatnam Port Yard", manager: "Jagan M", phone: "+91 98765 43229", status: "Active" },
  { id: "GD-021", name: "Goa Cargo Terminal", manager: "Pramod S", phone: "+91 98765 43230", status: "Active" },
  { id: "GD-022", name: "Ludhiana Freight Yard", manager: "Charanjit C", phone: "+91 98765 43231", status: "Active" },
  { id: "GD-023", name: "Raipur Depot", manager: "Bhupesh B", phone: "+91 98765 43232", status: "Active" },
  { id: "GD-024", name: "Ranchi Hub", manager: "Hemant S", phone: "+91 98765 43233", status: "Active" },
  { id: "GD-025", name: "Jammu Yard", manager: "Manoj S", phone: "+91 98765 43234", status: "Active" },
  { id: "GD-026", name: "Shimla Depot", manager: "Sukhvinder S", phone: "+91 98765 43235", status: "Active" },
  { id: "GD-027", name: "Dehradun Hub", manager: "Pushkar D", phone: "+91 98765 43236", status: "Active" },
  { id: "GD-028", name: "Bhubaneswar Yard", manager: "Naveen P", phone: "+91 98765 43237", status: "Active" },
  { id: "GD-029", name: "Coimbatore Depot", manager: "Annamalai K", phone: "+91 98765 43238", status: "Active" },
  { id: "GD-030", name: "Madurai Hub", manager: "Stalin M", phone: "+91 98765 43239", status: "Active" },
];

const MOCK_DATA: Transaction[] = [
  {
    id: "tx-1",
    date: new Date().toISOString().split("T")[0],
    godown: "Mumbai Hub",
    quantity: 150,
    fundsReceived: 75000,
    fundsPaid: 69000,
    serviceFee: 3000,
    basePrice: 60000,
    savings: 6000,
    gstAmount: 10800,
    netProfit: 9000,
  },
  {
    id: "tx-2",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    godown: "Delhi Cargo Terminal",
    quantity: 220,
    fundsReceived: 110000,
    fundsPaid: 102000,
    serviceFee: 4400,
    basePrice: 90000,
    savings: 8000,
    gstAmount: 16200,
    netProfit: 12400,
  },
  {
    id: "tx-3",
    date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    godown: "Bangalore Depot",
    quantity: 180,
    fundsReceived: 90000,
    fundsPaid: 83000,
    serviceFee: 3600,
    basePrice: 75000,
    savings: 7000,
    gstAmount: 13500,
    netProfit: 10600,
  },
  {
    id: "tx-4",
    date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    godown: "Chennai Port Yard",
    quantity: 120,
    fundsReceived: 60000,
    fundsPaid: 55000,
    serviceFee: 2400,
    basePrice: 50000,
    savings: 5000,
    gstAmount: 9000,
    netProfit: 7400,
  },
  {
    id: "tx-5",
    date: new Date(Date.now() - 4 * 86400000).toISOString().split("T")[0],
    godown: "Kolkata Dockyard",
    quantity: 250,
    fundsReceived: 125000,
    fundsPaid: 115000,
    serviceFee: 5000,
    basePrice: 100000,
    savings: 10000,
    gstAmount: 18000,
    netProfit: 15000,
  },
  {
    id: "tx-6",
    date: new Date(Date.now() - 6 * 86400000).toISOString().split("T")[0],
    godown: "Hyderabad Terminal",
    quantity: 140,
    fundsReceived: 70000,
    fundsPaid: 65000,
    serviceFee: 2800,
    basePrice: 58000,
    savings: 5000,
    gstAmount: 10440,
    netProfit: 7800,
  },
  {
    id: "tx-7",
    date: new Date(Date.now() - 8 * 86400000).toISOString().split("T")[0],
    godown: "Ahmedabad Yard",
    quantity: 300,
    fundsReceived: 150000,
    fundsPaid: 138000,
    serviceFee: 6000,
    basePrice: 120000,
    savings: 12000,
    gstAmount: 21600,
    netProfit: 18000,
  },
  {
    id: "tx-8",
    date: new Date(Date.now() - 12 * 86400000).toISOString().split("T")[0],
    godown: "Pune Logistics Hub",
    quantity: 160,
    fundsReceived: 80000,
    fundsPaid: 74000,
    serviceFee: 3200,
    basePrice: 65000,
    savings: 6000,
    gstAmount: 11700,
    netProfit: 9200,
  },
  {
    id: "tx-9",
    date: new Date(Date.now() - 15 * 86400000).toISOString().split("T")[0],
    godown: "Cochin Harbour Depot",
    quantity: 210,
    fundsReceived: 105000,
    fundsPaid: 97000,
    serviceFee: 4200,
    basePrice: 85000,
    savings: 8000,
    gstAmount: 15300,
    netProfit: 12200,
  },
  {
    id: "tx-10",
    date: new Date(Date.now() - 18 * 86400000).toISOString().split("T")[0],
    godown: "Jaipur Freight Terminal",
    quantity: 170,
    fundsReceived: 85000,
    fundsPaid: 78000,
    serviceFee: 3400,
    basePrice: 70000,
    savings: 7000,
    gstAmount: 12600,
    netProfit: 10400,
  },
  {
    id: "tx-11",
    date: new Date(Date.now() - 22 * 86400000).toISOString().split("T")[0],
    godown: "Lucknow Depot",
    quantity: 130,
    fundsReceived: 65000,
    fundsPaid: 60000,
    serviceFee: 2600,
    basePrice: 52000,
    savings: 5000,
    gstAmount: 9360,
    netProfit: 7600,
  },
  {
    id: "tx-12",
    date: new Date(Date.now() - 28 * 86400000).toISOString().split("T")[0],
    godown: "Patna Cargo Hub",
    quantity: 240,
    fundsReceived: 120000,
    fundsPaid: 111000,
    serviceFee: 4800,
    basePrice: 96000,
    savings: 9000,
    gstAmount: 17280,
    netProfit: 13800,
  },
  {
    id: "tx-13",
    date: new Date(Date.now() - 35 * 86400000).toISOString().split("T")[0],
    godown: "Mumbai Hub",
    quantity: 190,
    fundsReceived: 95000,
    fundsPaid: 88000,
    serviceFee: 3800,
    basePrice: 78000,
    savings: 7000,
    gstAmount: 14040,
    netProfit: 10800,
  },
  {
    id: "tx-14",
    date: new Date(Date.now() - 45 * 86400000).toISOString().split("T")[0],
    godown: "Delhi Cargo Terminal",
    quantity: 150,
    fundsReceived: 75000,
    fundsPaid: 69000,
    serviceFee: 3000,
    basePrice: 60000,
    savings: 6000,
    gstAmount: 10800,
    netProfit: 9000,
  },
  {
    id: "tx-15",
    date: new Date(Date.now() - 60 * 86400000).toISOString().split("T")[0],
    godown: "Bangalore Depot",
    quantity: 200,
    fundsReceived: 100000,
    fundsPaid: 92000,
    serviceFee: 4000,
    basePrice: 80000,
    savings: 8000,
    gstAmount: 14400,
    netProfit: 12000,
  },
];

const STORAGE_KEY = "smart_ledger_transactions";
const GODOWNS_STORAGE_KEY = "smart_ledger_godowns";

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data || JSON.parse(data).length <= 2) {
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

export function getGodowns(): Godown[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(GODOWNS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(GODOWNS_STORAGE_KEY, JSON.stringify(DEFAULT_GODOWNS));
    return DEFAULT_GODOWNS;
  }
  return JSON.parse(data);
}

export function saveGodown(godown: Godown): Godown {
  const godowns = getGodowns();
  const index = godowns.findIndex((g) => g.id === godown.id);
  if (index >= 0) {
    godowns[index] = godown;
  } else {
    godowns.push(godown);
  }
  localStorage.setItem(GODOWNS_STORAGE_KEY, JSON.stringify(godowns));
  return godown;
}
