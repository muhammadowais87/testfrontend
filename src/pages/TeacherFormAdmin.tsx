import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminRoute } from "@/lib/adminRoute";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Info, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTeacherStore } from "@/stores/teacherStore";
import { planAmounts } from "@/data/schoolData";
import { allBoardSubjectOptions } from "@/data/subjectData";
import { Checkbox } from "@/components/ui/checkbox";
import AdminLayout from "@/components/AdminLayout";

interface TeacherFormProps {
  mode: "add" | "edit";
  teacherId?: number;
}

const TeacherFormPage = ({ mode, teacherId }: TeacherFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { teachers, isLoading, fetchTeachers, addTeacher, updateTeacher } = useTeacherStore();

  const existing = mode === "edit" ? teachers.find((t) => t.id === teacherId) : null;

  const [name, setName] = useState(existing?.name || "");
  const [city, setCity] = useState(existing?.city || "");
  const [phone, setPhone] = useState(existing?.phone || "");
  const [email, setEmail] = useState(existing?.email || "");
  const [password, setPassword] = useState(existing?.password || "");
  const [subject, setSubject] = useState(existing?.subject || "");
  const [plan, setPlan] = useState(existing?.plan || "Package-1");
  const [status, setStatus] = useState(existing?.status || "Pending");
  const [assignedSubjects, setAssignedSubjects] = useState<string[]>(
    existing?.assignedSubjects?.length ? existing.assignedSubjects : (existing?.subject ? [existing.subject] : [])
  );
  const [subjectSearch, setSubjectSearch] = useState("");
  const [subscriptionDate, setSubscriptionDate] = useState(existing?.subscriptionDate || new Date().toISOString().slice(0, 10));
  const [lastPaymentDate, setLastPaymentDate] = useState(existing?.lastPaymentDate || "");
  const [formError, setFormError] = useState("");
  // Browser autofill / password managers write straight into the DOM without firing React's onChange.
  // Reading these refs on submit keeps the visible value authoritative.
  const nameRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setCity(existing.city);
      setPhone(existing.phone);
      setEmail(existing.email);
      setPassword(existing.password || "");
      setSubject(existing.subject);
      setPlan(existing.plan);
      setStatus(existing.status);
      setAssignedSubjects(existing.assignedSubjects?.length ? existing.assignedSubjects : [existing.subject]);
      setSubscriptionDate(existing.subscriptionDate);
      setLastPaymentDate(existing.lastPaymentDate);
    }
  }, [existing]);

  const amount = planAmounts[plan] || existing?.amount || 2000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !city.trim() || !phone.trim() || !email.trim() || !subject.trim()) {
      setFormError("Please complete all required fields marked with *.");
      return;
    }

    if (mode === "add" && !password.trim()) {
      setFormError("Password is required for a new teacher account.");
      return;
    }

    setFormError("");

    // Read values directly from the form fields (DOM) so that browser autofill values—which do not
    // fire React's onChange—are captured instead of the stale React state.
    const trimmedName = nameRef.current?.value?.trim() ?? name.trim();
    const trimmedCity = cityRef.current?.value?.trim() ?? city.trim();
    const trimmedPhone = phoneRef.current?.value?.trim() ?? phone.trim();
    const trimmedEmail = emailRef.current?.value?.trim() ?? email.trim();
    const trimmedSubject = subjectRef.current?.value?.trim() ?? subject.trim();
    const trimmedPassword = passwordRef.current?.value?.trim() ?? password.trim();

    if (!trimmedName || !trimmedCity || !trimmedPhone || !trimmedEmail || !trimmedSubject) {
      setFormError("Please complete all required fields marked with *.");
      return;
    }

    const data = {
      name: trimmedName,
      city: trimmedCity,
      phone: trimmedPhone,
      email: trimmedEmail,
      subject: trimmedSubject,
      plan,
      amount,
      status,
      assignedSubjects,
      subscriptionDate,
      lastPaymentDate: lastPaymentDate || subscriptionDate,
      ...(trimmedPassword ? { password: trimmedPassword } : {}),
    };
    try {
      if (mode === "edit" && teacherId) {
        await updateTeacher(teacherId, data);
        toast({ title: "Teacher Updated", description: `${data.name} has been updated.` });
        navigate(`/${getAdminRoute()}/teacher/${teacherId}`);
      } else {
        await addTeacher(data);
        toast({ title: "Teacher Added", description: `${data.name} has been added.` });
        navigate(`/${getAdminRoute()}/teachers`);
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to save teacher");
    }
  };

  if (mode === "edit" && isLoading) {
    return (
      <AdminLayout title="Loading Teacher">
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading teacher...</p>
        </div>
      </AdminLayout>
    );
  }

  if (mode === "edit" && !existing) {
    return (
      <AdminLayout title="Teacher Not Found">
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Teacher not found</p>
            <Button onClick={() => navigate(`/${getAdminRoute()}/teachers`)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost" size="icon"
            onClick={() => navigate(mode === "edit" && teacherId ? `/${getAdminRoute()}/teacher/${teacherId}` : `/${getAdminRoute()}/teachers`)}
            className="h-9 w-9"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">
            {mode === "edit" ? "Edit Teacher" : "Add Individual Teacher"}
          </h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {formError && (
                <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
                  <Info className="w-4 h-4 mt-0.5 shrink-0" />
                  <p className="text-xs">{formError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-medium">Full Name *</Label>
                  <Input id="name" ref={nameRef} autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ahmed Khan" maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-medium">Phone *</Label>
                  <Input id="phone" ref={phoneRef} autoComplete="off" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03XX-XXXXXXX" maxLength={15} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    ref={emailRef}
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    maxLength={255}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-medium">
                    Password {mode === "add" ? "*" : ""}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    ref={passwordRef}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    maxLength={128}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs font-medium">City *</Label>
                  <Input id="city" ref={cityRef} autoComplete="off" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Lahore" maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-xs font-medium">Subject *</Label>
                  <Input id="subject" ref={subjectRef} autoComplete="off" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Mathematics" maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Plan</Label>
                  <Select value={plan} onValueChange={setPlan}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Package-1">Package-1 — Rs 2,000 (1 month)</SelectItem>
                      <SelectItem value="Package-2">Package-2 — Rs 3,000 (3 months)</SelectItem>
                      <SelectItem value="Package-3">Package-3 — Rs 6,000 (6 months)</SelectItem>
                      <SelectItem value="Package-4">Package-4 — Rs 12,000 (1 year)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Payment Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-xs font-medium">Assign Subjects</Label>
                  <Input
                    placeholder="Search subject..."
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                    className="h-9"
                  />
                  <div className="max-h-48 overflow-y-auto rounded-md border border-border p-3 space-y-1.5">
                    {allBoardSubjectOptions
                      .filter((opt) => opt.label.toLowerCase().includes(subjectSearch.toLowerCase()))
                      .map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox
                            checked={assignedSubjects.includes(opt.value)}
                            onCheckedChange={(checked) => {
                              setAssignedSubjects((prev) =>
                                checked
                                  ? Array.from(new Set([...prev, opt.value]))
                                  : prev.filter((s) => s !== opt.value)
                              );
                            }}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Selected: {assignedSubjects.length}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subscriptionDate" className="text-xs font-medium">Subscription Date</Label>
                  <Input id="subscriptionDate" type="date" value={subscriptionDate} onChange={(e) => setSubscriptionDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastPaymentDate" className="text-xs font-medium">Last Payment Date</Label>
                  <Input id="lastPaymentDate" type="date" value={lastPaymentDate} onChange={(e) => setLastPaymentDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Monthly Amount</Label>
                  <div className="h-10 px-3 flex items-center rounded-md border border-input bg-muted/50 text-sm font-semibold text-foreground">
                    Rs {amount.toLocaleString()}
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full gap-2">
                <Save className="w-4 h-4" />
                {mode === "edit" ? "Update Teacher" : "Add Teacher"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export const AddTeacher = () => <TeacherFormPage mode="add" />;
export const EditTeacher = () => {
  const { id } = useParams();
  return <TeacherFormPage mode="edit" teacherId={Number(id)} />;
};
export default TeacherFormPage;
