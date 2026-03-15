export interface MonthlyPayment {
  month: string; // e.g. "2025-10"
  monthLabel: string; // e.g. "Oct 2025"
  plan: string;
  amount: number;
  status: string;
  paymentDate: string | null;
}

export interface SchoolData {
  id: number;
  name: string;
  principalName?: string;
  city: string;
  address?: string;
  phonePrimary?: string;
  phoneSecondary?: string;
  email?: string;
  plan: string;
  amount: number;
  status: string;
  subscriptionDate: string;
  lastPaymentDate: string;
  teachers: number;
  monthlyPayments: MonthlyPayment[];
}

const generateMonthlyPayments = (
  subscriptionDate: string,
  plan: string,
  amount: number,
  currentStatus: string,
  lastPaymentDate: string
): MonthlyPayment[] => {
  const start = new Date(subscriptionDate);
  const now = new Date("2026-03-08");
  const payments: MonthlyPayment[] = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);

  while (cursor <= now) {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const monthKey = `${y}-${String(m + 1).padStart(2, "0")}`;
    const label = `${monthNames[m]} ${y}`;

    const isCurrentMonth = y === now.getFullYear() && m === now.getMonth();
    const isLastMonth = y === now.getFullYear() && m === now.getMonth() - 1;

    let status: string;
    let paymentDate: string | null;

    if (isCurrentMonth) {
      status = currentStatus;
      paymentDate = currentStatus === "Paid" ? lastPaymentDate : null;
    } else {
      status = "Paid";
      const day = Math.floor(Math.random() * 10) + 1;
      paymentDate = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }

    payments.push({ month: monthKey, monthLabel: label, plan, amount, status, paymentDate });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return payments;
};

export const initialSchools: SchoolData[] = [
  { id: 1, name: "Punjab Public School", city: "Lahore", plan: "Premium", amount: 15000, status: "Paid", subscriptionDate: "2025-09-15", lastPaymentDate: "2026-03-01", teachers: 0, monthlyPayments: [] },
  { id: 2, name: "Al-Huda Academy", city: "Islamabad", plan: "Standard", amount: 8000, status: "Paid", subscriptionDate: "2025-11-01", lastPaymentDate: "2026-03-02", teachers: 0, monthlyPayments: [] },
  { id: 3, name: "City Grammar School", city: "Faisalabad", plan: "Premium", amount: 15000, status: "Pending", subscriptionDate: "2025-08-20", lastPaymentDate: "2026-02-03", teachers: 0, monthlyPayments: [] },
  { id: 4, name: "Oxford Model School", city: "Rawalpindi", plan: "Basic", amount: 5000, status: "Paid", subscriptionDate: "2026-01-10", lastPaymentDate: "2026-02-28", teachers: 0, monthlyPayments: [] },
  { id: 5, name: "The Educators", city: "Multan", plan: "Premium", amount: 15000, status: "Pending", subscriptionDate: "2025-06-01", lastPaymentDate: "2026-02-15", teachers: 0, monthlyPayments: [] },
  { id: 6, name: "Beacon House", city: "Karachi", plan: "Standard", amount: 8000, status: "Paid", subscriptionDate: "2025-10-12", lastPaymentDate: "2026-03-05", teachers: 0, monthlyPayments: [] },
  { id: 7, name: "Dar-e-Arqam", city: "Gujranwala", plan: "Basic", amount: 5000, status: "Paid", subscriptionDate: "2025-12-01", lastPaymentDate: "2026-03-04", teachers: 0, monthlyPayments: [] },
  { id: 8, name: "Allied School", city: "Sialkot", plan: "Standard", amount: 8000, status: "Pending", subscriptionDate: "2026-01-15", lastPaymentDate: "2026-02-06", teachers: 0, monthlyPayments: [] },
  { id: 9, name: "Lahore Grammar School", city: "Lahore", plan: "Premium", amount: 15000, status: "Paid", subscriptionDate: "2025-07-01", lastPaymentDate: "2026-03-01", teachers: 0, monthlyPayments: [] },
  { id: 10, name: "Crescent Model School", city: "Peshawar", plan: "Basic", amount: 5000, status: "Pending", subscriptionDate: "2025-11-20", lastPaymentDate: "2026-01-20", teachers: 0, monthlyPayments: [] },
].map((s) => ({
  ...s,
  monthlyPayments: generateMonthlyPayments(s.subscriptionDate, s.plan, s.amount, s.status, s.lastPaymentDate),
}));

export const planAmounts: Record<string, number> = { Basic: 5000, Standard: 8000, Premium: 15000 };

export const statusConfig: Record<string, { icon: string; color: string }> = {
  Paid: { icon: "CheckCircle", color: "bg-primary/10 text-primary" },
  Pending: { icon: "Clock", color: "bg-accent text-accent-foreground" },
};
