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
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft, CheckCircle, Clock, Trash2, Calendar, CreditCard, Pencil, FileText, Hash, Users,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useSchoolStore } from "@/stores/schoolStore";
import AdminLayout from "@/components/AdminLayout";
import type { MonthlyPayment } from "@/data/schoolData";

const statusIcons: Record<string, React.ElementType> = {
  Paid: CheckCircle, Pending: Clock,
};
const statusColors: Record<string, string> = {
  Paid: "bg-primary/10 text-primary",
  Pending: "bg-amber-50 text-amber-600",
};
const statusDots: Record<string, string> = {
  Paid: "bg-primary", Pending: "bg-amber-500",
};

const SchoolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { schools, isLoading, fetchSchools, deleteSchool, updateSchoolPlan, updateSchoolStatus, deletePayment } = useSchoolStore();
  const [selectedPayment, setSelectedPayment] = useState<MonthlyPayment | null>(null);
  const [subUsers, setSubUsers] = useState<Array<{ id: string; name: string; email: string; phone: string; subject: string; isActive: boolean }>>([]);
  const [isLoadingSubUsers, setIsLoadingSubUsers] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  useEffect(() => {
    if (!id) return;
    setIsLoadingSubUsers(true);
    fetch(`${API_BASE_URL}/schools/${id}/sub-users`)
      .then((r) => r.json())
      .then((data) => setSubUsers(Array.isArray(data?.subUsers) ? data.subUsers : []))
      .catch(() => {})
      .finally(() => setIsLoadingSubUsers(false));
  }, [id]);

  const school = schools.find((s) => s.id === Number(id));

  if (isLoading) {
    return (
      <AdminLayout title="Loading School">
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading school...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!school) {
    return (
      <AdminLayout title="School Not Found">
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">School not found</p>
            <Button onClick={() => navigate("/portal-x9k7m/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteSchool(school.id);
      toast({ title: "School Deleted", description: `${school.name} has been removed.` });
      navigate("/portal-x9k7m/dashboard");
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Could not delete school",
        variant: "destructive",
      });
    }
  };

  const handlePlanChange = async (newPlan: string) => {
    try {
      await updateSchoolPlan(school.id, newPlan);
      toast({ title: "Plan Updated", description: `Plan changed to ${newPlan}.` });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Could not update plan",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateSchoolStatus(school.id, newStatus);
      toast({ title: "Status Updated", description: `Status changed to ${newStatus}.` });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Could not update status",
        variant: "destructive",
      });
    }
  };

  const totalPaid = school.monthlyPayments.filter((p) => p.status === "Paid").reduce((a, b) => a + b.amount, 0);
  const totalPending = school.monthlyPayments.filter((p) => p.status !== "Paid").reduce((a, b) => a + b.amount, 0);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/portal-x9k7m/dashboard")} className="h-9 w-9 shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground leading-tight">{school.name}</h1>
              <p className="text-sm text-muted-foreground">{school.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-12 sm:pl-0">
            <Button variant="outline" size="sm" className="gap-2 h-9" onClick={() => navigate(`/portal-x9k7m/school/${school.id}/edit`)}>
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
            { label: "Plan", content: <Badge variant={school.plan === "Premium" ? "default" : "secondary"} className="text-xs">{school.plan}</Badge> },
            { label: "Monthly Fee", content: <span className="text-lg font-bold text-foreground">Rs {school.amount.toLocaleString()}</span> },
            { label: "Since", content: <span className="text-sm font-bold text-foreground">{school.subscriptionDate}</span> },
            { label: "Teachers", content: <span className="text-lg font-bold text-foreground flex items-center gap-1.5"><Users className="w-4 h-4 text-muted-foreground" />{school.teachers}</span> },
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
                <Select value={school.plan} onValueChange={handlePlanChange}>
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
                <Select value={school.status} onValueChange={handleStatusChange}>
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
            <Badge variant="secondary" className="text-[10px] ml-auto">{school.monthlyPayments.length} months</Badge>
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
                {[...school.monthlyPayments].reverse().map((payment, i) => (
                  <TableRow
                    key={payment.month}
                    className="cursor-pointer group hover:bg-muted/30 transition-colors"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-semibold text-sm text-foreground">{payment.monthLabel}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[11px]">{payment.plan}</Badge>
                    </TableCell>
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
                            await deletePayment(school.id, payment.month);
                            toast({ title: "Payment Deleted", description: `${payment.monthLabel} record removed.` });
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

        {/* Sub-Users (Teachers) */}
        <Card>
          <div className="flex items-center gap-2 p-5 pb-4 border-b border-border">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Teachers (Sub-Users)</h2>
            <Badge variant="secondary" className="text-[10px] ml-auto">{subUsers.length} registered</Badge>
          </div>
          <div className="overflow-x-auto">
            {isLoadingSubUsers ? (
              <p className="text-sm text-muted-foreground p-5">Loading...</p>
            ) : subUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground p-5">No teachers added yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-10 text-xs font-semibold">#</TableHead>
                    <TableHead className="text-xs font-semibold">Name</TableHead>
                    <TableHead className="text-xs font-semibold">Email</TableHead>
                    <TableHead className="text-xs font-semibold">Phone</TableHead>
                    <TableHead className="text-xs font-semibold">Subject</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subUsers.map((u, i) => (
                    <TableRow key={u.id}>
                      <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-semibold text-sm text-foreground">{u.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.phone || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.subject || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={u.isActive ?? true} disabled aria-label={`${u.name} status`} />
                          <span className={`text-xs font-medium ${(u.isActive ?? true) ? "text-primary" : "text-muted-foreground"}`}>
                            {(u.isActive ?? true) ? "Active" : "Non-Active"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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

export default SchoolDetail;
