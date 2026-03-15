import { MonthlyPayment } from "./schoolData";

export interface IndividualTeacher {
  id: number;
  name: string;
  city: string;
  phone: string;
  email: string;
  password?: string;
  subject: string;
  assignedSubjects?: string[];
  isActive?: boolean;
  plan: string;
  amount: number;
  status: string;
  subscriptionDate: string;
  lastPaymentDate: string;
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

export const initialTeachers: IndividualTeacher[] = [
  { id: 1, name: "Ahmed Khan", city: "Lahore", phone: "0301-1234567", email: "ahmed@gmail.com", subject: "Mathematics", plan: "Basic", amount: 5000, status: "Paid", subscriptionDate: "2025-10-01", lastPaymentDate: "2026-03-02", monthlyPayments: [] },
  { id: 2, name: "Fatima Noor", city: "Karachi", phone: "0321-9876543", email: "fatima@gmail.com", subject: "English", plan: "Standard", amount: 8000, status: "Paid", subscriptionDate: "2025-11-15", lastPaymentDate: "2026-03-05", monthlyPayments: [] },
  { id: 3, name: "Usman Ali", city: "Islamabad", phone: "0333-5556677", email: "usman@gmail.com", subject: "Physics", plan: "Premium", amount: 15000, status: "Pending", subscriptionDate: "2026-01-01", lastPaymentDate: "2026-02-10", monthlyPayments: [] },
  { id: 4, name: "Ayesha Siddiqui", city: "Rawalpindi", phone: "0345-1112233", email: "ayesha@gmail.com", subject: "Chemistry", plan: "Basic", amount: 5000, status: "Pending", subscriptionDate: "2025-09-20", lastPaymentDate: "2026-01-15", monthlyPayments: [] },
  { id: 5, name: "Hassan Raza", city: "Faisalabad", phone: "0312-4445566", email: "hassan@gmail.com", subject: "Biology", plan: "Standard", amount: 8000, status: "Paid", subscriptionDate: "2025-12-01", lastPaymentDate: "2026-03-01", monthlyPayments: [] },
].map((t) => ({
  ...t,
  isActive: t.isActive ?? true,
  assignedSubjects: t.assignedSubjects ?? [t.subject],
  monthlyPayments: generateMonthlyPayments(t.subscriptionDate, t.plan, t.amount, t.status, t.lastPaymentDate),
}));
