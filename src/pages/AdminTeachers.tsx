import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Search, UserCheck, TrendingUp, CheckCircle, Clock, Plus, ArrowUpRight,
} from "lucide-react";
import { useTeacherStore } from "@/stores/teacherStore";
import AdminLayout from "@/components/AdminLayout";

const statusConfig: Record<string, { color: string; dotColor: string }> = {
  Paid: { color: "bg-primary/10 text-primary", dotColor: "bg-primary" },
  Pending: { color: "bg-amber-50 text-amber-600", dotColor: "bg-amber-500" },
};

const AdminTeachers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { teachers, isLoading, fetchTeachers, toggleTeacherActive } = useTeacherStore();

  useEffect(() => {
    if (localStorage.getItem("admin_logged_in") !== "true") {
      navigate("/portal-x9k7m/login");
      return;
    }

    fetchTeachers();
  }, [navigate, fetchTeachers]);

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = teachers.filter((t) => t.status === "Paid").reduce((a, b) => a + b.amount, 0);
  const totalPending = teachers.filter((t) => t.status === "Pending").reduce((a, b) => a + b.amount, 0);

  const stats = [
    { label: "Total Teachers", value: teachers.length, icon: UserCheck, accent: "bg-primary/10 text-primary" },
    { label: "Revenue (Paid)", value: `Rs ${totalRevenue.toLocaleString()}`, icon: TrendingUp, accent: "bg-emerald-50 text-emerald-600" },
    { label: "Pending", value: `Rs ${totalPending.toLocaleString()}`, icon: Clock, accent: "bg-amber-50 text-amber-600" },
  ];

  return (
    <AdminLayout title="Individual Teachers" subtitle={`${teachers.length} teachers`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.accent} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 pb-4 border-b border-border">
            <div>
              <h2 className="text-base font-semibold text-foreground">All Individual Teachers</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} results</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
              <Button size="sm" className="gap-1.5 h-9 shrink-0" onClick={() => navigate("/portal-x9k7m/teacher/add")}>
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-10 text-xs font-semibold">#</TableHead>
                  <TableHead className="text-xs font-semibold">Teacher</TableHead>
                  <TableHead className="text-xs font-semibold">Subject</TableHead>
                  <TableHead className="text-xs font-semibold">City</TableHead>
                  <TableHead className="text-xs font-semibold">Plan</TableHead>
                  <TableHead className="text-xs font-semibold">Amount</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold">Account</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((teacher, i) => {
                  const cfg = statusConfig[teacher.status];
                  return (
                    <TableRow
                      key={teacher.id}
                      className="cursor-pointer group hover:bg-muted/30 transition-colors"
                      onClick={() => navigate(`/portal-x9k7m/teacher/${teacher.id}`)}
                    >
                      <TableCell className="font-medium text-muted-foreground text-xs">{i + 1}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{teacher.name}</p>
                          <p className="text-[11px] text-muted-foreground">{teacher.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{teacher.subject}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{teacher.city}</TableCell>
                      <TableCell>
                        <Badge variant={teacher.plan === "Premium" ? "default" : "secondary"} className="text-[11px] font-medium">
                          {teacher.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-foreground">Rs {teacher.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${cfg?.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg?.dotColor}`} />
                          {teacher.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Switch
                            checked={teacher.isActive ?? true}
                            onCheckedChange={(checked) => {
                              toggleTeacherActive(teacher.id, checked);
                            }}
                            aria-label={`Toggle ${teacher.name} status`}
                          />
                          <span className={`text-xs font-medium ${(teacher.isActive ?? true) ? "text-primary" : "text-muted-foreground"}`}>
                            {(teacher.isActive ?? true) ? "Active" : "Non-Active"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors"
                            onClick={() => navigate(`/portal-x9k7m/teacher/${teacher.id}`)}
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      {isLoading ? "Loading teachers..." : "No teachers found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

      </div>
    </AdminLayout>
  );
};

export default AdminTeachers;
