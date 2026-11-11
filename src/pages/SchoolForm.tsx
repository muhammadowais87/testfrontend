import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminRoute } from "@/lib/adminRoute";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSchoolStore } from "@/stores/schoolStore";
import { planAmounts } from "@/data/schoolData";
import AdminLayout from "@/components/AdminLayout";

interface SchoolFormProps {
  mode: "add" | "edit";
  schoolId?: number;
}

const SchoolForm = ({ mode, schoolId }: SchoolFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { schools, isLoading, fetchSchools, addSchool, updateSchool } = useSchoolStore();

  const existing = mode === "edit" ? schools.find((s) => s.id === schoolId) : null;

  const hydratedIdRef = useRef<number | null>(null);

  const [name, setName] = useState(existing?.name || "");
  const [principalName, setPrincipalName] = useState(existing?.principalName || "");
  const [city, setCity] = useState(existing?.city || "");
  const [address, setAddress] = useState(existing?.address || "");
  const [phonePrimary, setPhonePrimary] = useState(existing?.phonePrimary || "");
  const [phoneSecondary, setPhoneSecondary] = useState(existing?.phoneSecondary || "");
  const [email, setEmail] = useState(existing?.email || "");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState(existing?.plan || "Package-1");
  const [status, setStatus] = useState(existing?.status || "Pending");
  const [subscriptionDate, setSubscriptionDate] = useState(existing?.subscriptionDate || new Date().toISOString().slice(0, 10));
  const [lastPaymentDate, setLastPaymentDate] = useState(existing?.lastPaymentDate || "");

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  useEffect(() => {
    if (!existing) return;

    // Hydrate the fields once per school. Re-running this on every store change
    // could overwrite an email the user just typed but has not submitted yet.
    if (hydratedIdRef.current === existing.id) return;
    hydratedIdRef.current = existing.id;

    setName(existing.name);
    setPrincipalName(existing.principalName || "");
    setCity(existing.city);
    setAddress(existing.address || "");
    setPhonePrimary(existing.phonePrimary || "");
    setPhoneSecondary(existing.phoneSecondary || "");
    setEmail(existing.email || "");
    setPlan(existing.plan);
    setStatus(existing.status);
    setSubscriptionDate(existing.subscriptionDate);
    setLastPaymentDate(existing.lastPaymentDate);
  }, [existing]);

  const amount = planAmounts[plan] || existing?.amount || 2000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Read the current values straight from the form fields. Browser autofill and
    // some password managers can fill an input without firing React's onChange, so
    // relying on state alone silently submitted the previous email address.
    const form = e.currentTarget as HTMLFormElement;
    const fieldValue = (id: string, fallback: string) => {
      const field = form.querySelector<HTMLInputElement>(`#${id}`);
      return field ? field.value : fallback;
    };

    const nextName = fieldValue("name", name);
    const nextPrincipalName = fieldValue("principalName", principalName);
    const nextCity = fieldValue("city", city);
    const nextAddress = fieldValue("address", address);
    const nextPhonePrimary = fieldValue("phonePrimary", phonePrimary);
    const nextPhoneSecondary = fieldValue("phoneSecondary", phoneSecondary);
    const nextEmail = fieldValue("email", email);
    const nextPassword = fieldValue("password", password);
    const nextSubscriptionDate = fieldValue("subscriptionDate", subscriptionDate);
    const nextLastPaymentDate = fieldValue("lastPaymentDate", lastPaymentDate);

    if (!nextName.trim() || !nextPrincipalName.trim() || !nextCity.trim() || !nextAddress.trim() || !nextPhonePrimary.trim() || !nextEmail.trim()) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    if (mode === "add" && !nextPassword.trim()) {
      toast({ title: "Error", description: "Password is required for new institute account.", variant: "destructive" });
      return;
    }

    const data = {
      name: nextName.trim(), principalName: nextPrincipalName.trim(), city: nextCity.trim(), address: nextAddress.trim(), phonePrimary: nextPhonePrimary.trim(), phoneSecondary: nextPhoneSecondary.trim(), email: nextEmail.trim(), plan, amount, status,
      subscriptionDate: nextSubscriptionDate, lastPaymentDate: nextLastPaymentDate || nextSubscriptionDate,
      ...(nextPassword.trim() ? { password: nextPassword.trim() } : {}),
    };

    try {
      if (mode === "edit" && schoolId) {
        await updateSchool(schoolId, data);
        toast({ title: "School Updated", description: `${data.name} has been updated.` });
        navigate(`/${getAdminRoute()}/school/${schoolId}`);
      } else {
        await addSchool(data);
        toast({ title: "School Added", description: `${data.name} has been added.` });
        navigate(`/${getAdminRoute()}/dashboard`);
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Could not save school",
        variant: "destructive",
      });
    }
  };

  if (mode === "edit" && isLoading) {
    return (
      <AdminLayout title="Loading School">
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading school...</p>
        </div>
      </AdminLayout>
    );
  }

  if (mode === "edit" && !existing) {
    return (
      <AdminLayout title="School Not Found">
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">School not found</p>
            <Button onClick={() => navigate(`/${getAdminRoute()}/dashboard`)}>
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
            onClick={() => navigate(mode === "edit" && schoolId ? `/${getAdminRoute()}/school/${schoolId}` : `/${getAdminRoute()}/dashboard`)}
            className="h-9 w-9"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">
            {mode === "edit" ? "Edit School" : "Add New School"}
          </h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-medium">School Name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Punjab Public School" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs font-medium">City *</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Lahore" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="principalName" className="text-xs font-medium">Principal Name *</Label>
                  <Input id="principalName" value={principalName} onChange={(e) => setPrincipalName(e.target.value)} placeholder="e.g. Muhammad Ahmad" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address" className="text-xs font-medium">School Address *</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 247-E-1, Johar Town, Lahore" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phonePrimary" className="text-xs font-medium">Phone Number 1 *</Label>
                  <Input id="phonePrimary" value={phonePrimary} onChange={(e) => setPhonePrimary(e.target.value)} placeholder="e.g. 0300-8194789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneSecondary" className="text-xs font-medium">Phone Number 2</Label>
                  <Input id="phoneSecondary" value={phoneSecondary} onChange={(e) => setPhoneSecondary(e.target.value)} placeholder="e.g. 0322-4157001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium">Institute Email *</Label>
                  <Input id="email" type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="institute@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-medium">Password {mode === "add" ? "*" : ""}</Label>
                  <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "add" ? "Set institute password" : "Leave blank to keep current"} />
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
                {mode === "edit" ? "Update School" : "Add School"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export const AddSchool = () => <SchoolForm mode="add" />;
export const EditSchool = () => {
  const { id } = useParams();
  return <SchoolForm mode="edit" schoolId={Number(id)} />;
};
export default SchoolForm;
