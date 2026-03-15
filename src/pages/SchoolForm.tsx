import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  const [name, setName] = useState(existing?.name || "");
  const [principalName, setPrincipalName] = useState(existing?.principalName || "");
  const [city, setCity] = useState(existing?.city || "");
  const [address, setAddress] = useState(existing?.address || "");
  const [phonePrimary, setPhonePrimary] = useState(existing?.phonePrimary || "");
  const [phoneSecondary, setPhoneSecondary] = useState(existing?.phoneSecondary || "");
  const [email, setEmail] = useState(existing?.email || "");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState(existing?.plan || "Basic");
  const [status, setStatus] = useState(existing?.status || "Pending");
  const [subscriptionDate, setSubscriptionDate] = useState(existing?.subscriptionDate || new Date().toISOString().slice(0, 10));
  const [lastPaymentDate, setLastPaymentDate] = useState(existing?.lastPaymentDate || "");

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  useEffect(() => {
    if (existing) {
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
    }
  }, [existing]);

  const amount = planAmounts[plan] || 5000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !principalName.trim() || !city.trim() || !address.trim() || !phonePrimary.trim() || !email.trim()) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    if (mode === "add" && !password.trim()) {
      toast({ title: "Error", description: "Password is required for new institute account.", variant: "destructive" });
      return;
    }

    const data = {
      name: name.trim(), principalName: principalName.trim(), city: city.trim(), address: address.trim(), phonePrimary: phonePrimary.trim(), phoneSecondary: phoneSecondary.trim(), email: email.trim(), plan, amount, status,
      subscriptionDate, lastPaymentDate: lastPaymentDate || subscriptionDate,
      ...(password.trim() ? { password: password.trim() } : {}),
    };

    try {
      if (mode === "edit" && schoolId) {
        await updateSchool(schoolId, data);
        toast({ title: "School Updated", description: `${data.name} has been updated.` });
        navigate(`/portal-x9k7m/school/${schoolId}`);
      } else {
        await addSchool(data);
        toast({ title: "School Added", description: `${data.name} has been added.` });
        navigate("/portal-x9k7m/dashboard");
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
            <Button onClick={() => navigate("/portal-x9k7m/dashboard")}>
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
            onClick={() => navigate(mode === "edit" && schoolId ? `/portal-x9k7m/school/${schoolId}` : "/portal-x9k7m/dashboard")}
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
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="institute@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-medium">Password {mode === "add" ? "*" : ""}</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "add" ? "Set institute password" : "Leave blank to keep current"} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Plan</Label>
                  <Select value={plan} onValueChange={setPlan}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic — Rs 5,000</SelectItem>
                      <SelectItem value="Standard">Standard — Rs 8,000</SelectItem>
                      <SelectItem value="Premium">Premium — Rs 15,000</SelectItem>
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
