import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQueryStore } from "@/stores/queryStore";
import { useToast } from "@/hooks/use-toast";
import { Send, MessageSquare, User, Mail, Phone, School, Info } from "lucide-react";

const QueryForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showRequiredHint, setShowRequiredHint] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    school: "",
    queryType: "",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (showRequiredHint) {
      const next = { ...form, [field]: value };
      const hasMissingRequired = !next.name.trim() || !next.phone.trim() || !next.queryType.trim() || !next.message.trim();
      if (!hasMissingRequired) {
        setShowRequiredHint(false);
      }
    }
  };

  const submitQuery = useQueryStore((s) => s.submitQuery);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.queryType || !form.message.trim()) {
      setShowRequiredHint(true);
      return;
    }

    setLoading(true);
    try {
      await submitQuery({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        school: form.school.trim(),
        queryType: form.queryType.trim(),
        message: form.message.trim(),
      });

      toast({ title: "Query Submitted!", description: "We'll get back to you shortly." });
      setForm({ name: "", email: "", phone: "", school: "", queryType: "", message: "" });
      setShowRequiredHint(false);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Unable to submit query",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="query-form" className="py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <MessageSquare className="w-4 h-4" />
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Send Us Your <span className="text-primary">Query</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm">
            Have a question about our platform, pricing, or features? Fill out the form below and our team will respond within 24 hours.
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    maxLength={100}
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    maxLength={255}
                    className="h-10"
                  />
                </div>
              </div>

              {/* Row 2: Phone + School */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone Number <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="03XX-XXXXXXX"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    maxLength={15}
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5" /> School Name
                  </label>
                  <Input
                    placeholder="Your school name"
                    value={form.school}
                    onChange={(e) => handleChange("school", e.target.value)}
                    maxLength={150}
                    className="h-10"
                  />
                </div>
              </div>

              {/* Row 3: Query Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Query Type <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. Pricing, Technical Support, Demo..."
                  value={form.queryType}
                  onChange={(e) => handleChange("queryType", e.target.value)}
                  maxLength={100}
                  className="h-10"
                />
              </div>

              {/* Row 4: Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Your Message <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Write your query here..."
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  maxLength={1000}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-[11px] text-muted-foreground text-right">{form.message.length}/1000</p>
              </div>

              {/* Submit */}
              {showRequiredHint && (
                <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
                  <Info className="w-4 h-4 mt-0.5 shrink-0" />
                  <p className="text-xs">Please complete all required fields marked with * before submitting.</p>
                </div>
              )}

              <Button type="submit" className="w-full h-11 gap-2 text-sm font-semibold" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Query
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QueryForm;
