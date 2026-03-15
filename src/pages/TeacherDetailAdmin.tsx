import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft, CheckCircle, Clock, Trash2, Calendar, CreditCard, Pencil, FileText, Hash, Phone, Mail, BookOpen,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTeacherStore } from "@/stores/teacherStore";
import AdminLayout from "@/components/AdminLayout";
import type { MonthlyPayment } from "@/data/schoolData";

const statusColors: Record<string, string> = {
  Paid: "bg-primary/10 text-primary",
  Pending: "bg-amber-50 text-amber-600",
};
const statusDots: Record<string, string> = {
  Paid: "bg-primary", Pending: "bg-amber-500",
};

const TeacherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { teachers, isLoading, fetchTeachers, deleteTeacher, updateTeacherPlan, updateTeacherStatus, deletePayment } = useTeacherStore();
  const [selectedPayment, setSelectedPayment] = useState<MonthlyPayment | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const teacher = teachers.find((t) => t.id === Number(id));

  if (isLoading) {
    return (
      <AdminLayout title="Loading Teacher">
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading teacher...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!teacher) {
    return (
      <AdminLayout title="Teacher Not Found">
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Teacher not found</p>
            <Button onClick={() => navigate("/portal-x9k7m/teachers")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteTeacher(teacher.id);
      toast({ title: "Teacher Deleted", description: `${teacher.name} has been removed.` });
      navigate("/portal-x9k7m/teachers");
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Could not delete teacher",
        variant: "destructive",
      });
    }
  };

  const totalPaid = teacher.monthlyPayments.filter((p) => p.status === "Paid").reduce((a, b) => a + b.amount, 0);
  const totalPending = teacher.monthlyPayments.filter((p) => p.status !== "Paid").reduce((a, b) => a + b.amount, 0);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/portal-x9k7m/teachers")} className="h-9 w-9 shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground leading-tight">{teacher.name}</h1>
              <p className="text-sm text-muted-foreground">{teacher.city} · {teacher.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-12 sm:pl-0">
            <Button variant="outline" size="sm" className="gap-2 h-9" onClick={() => navigate(`/portal-x9k7m/teacher/${teacher.id}/edit`)}>
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Button>
            <Button variant="destructive" size="sm" className="gap-2 h-9" onClick={handleDelete}>
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </Button>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Plan", content: <Badge variant={teacher.plan === "Premium" ? "default" : "secondary"} className="text-xs">{teacher.plan}</Badge> },
            { label: "Monthly Fee", content: <span className="text-lg font-bold text-foreground">Rs {teacher.amount.toLocaleString()}</span> },
            { label: "Phone", content: <span className="text-sm font-bold text-foreground flex items-center gap-1.5"><Phone className="w-4 h-4 text-muted-foreground" />{teacher.phone}</span> },
            { label: "Since", content: <span className="text-sm font-bold text-foreground">{teacher.subscriptionDate}</span> },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="p-4">
                <p className="text-[11px] text-muted-foreground mb-1.5 uppercase tracking-wider font-medium">{item.label}</p>
                {item.content}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue + Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Paid</p>
                <p className="text-xl font-bold text-foreground">Rs {totalPaid.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-foreground">Rs {totalPending.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-muted-foreground">Plan</p>
                <Select value={teacher.plan} onValueChange={async (v) => {
                  try {
                    await updateTeacherPlan(teacher.id, v);
                    toast({ title: "Plan Updated" });
                  } catch (error) {
                    toast({
                      title: "Update Failed",
                      description: error instanceof Error ? error.message : "Could not update plan",
                      variant: "destructive",
                    });
                  }
                }}>
                  <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-muted-foreground">Status</p>
                <Select value={teacher.status} onValueChange={async (v) => {
                  try {
                    await updateTeacherStatus(teacher.id, v);
                    toast({ title: "Status Updated" });
                  } catch (error) {
                    toast({
                      title: "Update Failed",
                      description: error instanceof Error ? error.message : "Could not update status",
                      variant: "destructive",
                    });
                  }
                }}>
                  <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <div className="flex items-center gap-2 p-5 pb-4 border-b border-border">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Payment History</h2>
            <Badge variant="secondary" className="text-[10px] ml-auto">{teacher.monthlyPayments.length} months</Badge>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-10 text-xs font-semibold">#</TableHead>
                  <TableHead className="text-xs font-semibold">Month</TableHead>
                  <TableHead className="text-xs font-semibold">Plan</TableHead>
                  <TableHead className="text-xs font-semibold">Amount</TableHead>
                  <TableHead className="text-xs font-semibold">Payment Date</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...teacher.monthlyPayments].reverse().map((payment, i) => (
                  <TableRow
                    key={payment.month}
                    className="cursor-pointer group hover:bg-muted/30 transition-colors"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-semibold text-sm text-foreground">{payment.monthLabel}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[11px]">{payment.plan}</Badge></TableCell>
                    <TableCell className="text-sm font-medium text-foreground">Rs {payment.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{payment.paymentDate || "—"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${statusColors[payment.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDots[payment.status]}`} />
                        {payment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost" size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await deletePayment(teacher.id, payment.month);
                            toast({ title: "Payment Deleted" });
                          } catch (error) {
                            toast({
                              title: "Delete Failed",
                              description: error instanceof Error ? error.message : "Could not delete payment",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Payment Detail Modal */}
        <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
          <DialogContent className="max-w-md w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {selectedPayment?.monthLabel}
              </DialogTitle>
            </DialogHeader>
            {selectedPayment && (() => {
              const p = selectedPayment;
              const daysInMonth = new Date(Number(p.month.split("-")[0]), Number(p.month.split("-")[1]), 0).getDate();
              const dueDate = `${p.month}-${String(daysInMonth).padStart(2, "0")}`;
              const daysLate = p.paymentDate && p.status === "Paid"
                ? Math.max(0, Math.floor((new Date(p.paymentDate).getTime() - new Date(`${p.month}-01`).getTime()) / 86400000))
                : null;
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { icon: FileText, iconBg: "bg-primary/10", iconColor: "text-primary", label: "Plan", value: p.plan },
                    { icon: CreditCard, iconBg: "bg-primary/10", iconColor: "text-primary", label: "Amount", value: `Rs ${p.amount.toLocaleString()}` },
                    { icon: Calendar, iconBg: "bg-amber-50", iconColor: "text-amber-600", label: "Due Date", value: dueDate },
                    { icon: Hash, iconBg: p.status === "Paid" ? "bg-primary/10" : "bg-destructive/10", iconColor: p.status === "Paid" ? "text-primary" : "text-destructive", label: p.status === "Paid" ? "Paid On Day" : "Status", value: p.status === "Paid" && daysLate !== null ? `Day ${daysLate}` : p.status },
                  ].map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/30">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${detail.iconBg} flex items-center justify-center shrink-0`}>
                        <detail.icon className={`w-4 h-4 ${detail.iconColor}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{detail.label}</p>
                        <p className="text-sm font-bold text-foreground truncate">{detail.value}</p>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-1 sm:col-span-2 flex items-center justify-between pt-2 border-t border-border">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDots[p.status]}`} />
                      {p.status}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {p.paymentDate ? `Paid on ${p.paymentDate}` : "Not yet paid"}
                    </p>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default TeacherDetail;
