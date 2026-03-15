import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Search, MessageSquare, Trash2, Eye, Mail, Phone, User, School, Calendar, FileText, ArrowUpRight,
} from "lucide-react";
import { useQueryStore, type Query } from "@/stores/queryStore";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import { useEffect } from "react";

const AdminQueries = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { queries, isLoading, fetchQueries, markAsRead, deleteQuery } = useQueryStore();
  const [search, setSearch] = useState("");
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  useEffect(() => {
    if (localStorage.getItem("admin_logged_in") !== "true") {
      navigate("/portal-x9k7m/login");
      return;
    }

    fetchQueries();
  }, [navigate, fetchQueries]);

  const filtered = queries.filter(
    (q) =>
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.queryType.toLowerCase().includes(search.toLowerCase()) ||
      q.school.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = queries.filter((q) => !q.read).length;

  const handleView = async (query: Query) => {
    setSelectedQuery(query);
    if (!query.read) {
      try {
        await markAsRead(query.id);
        setSelectedQuery((prev) => (prev ? { ...prev, read: true } : prev));
      } catch {
        toast({ title: "Error", description: "Could not mark query as read.", variant: "destructive" });
      }
    }
  };

  return (
    <AdminLayout title="Queries" subtitle={`${queries.length} total · ${unreadCount} unread`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{queries.length}</p>
                  <p className="text-xs text-muted-foreground">Total Queries</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
                  <p className="text-xs text-muted-foreground">Unread</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{queries.length - unreadCount}</p>
                  <p className="text-xs text-muted-foreground">Read</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 pb-4 border-b border-border">
            <div>
              <h2 className="text-base font-semibold text-foreground">All Queries</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} results</p>
            </div>
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-10 text-xs font-semibold">#</TableHead>
                  <TableHead className="text-xs font-semibold">Name</TableHead>
                  <TableHead className="text-xs font-semibold">Query Type</TableHead>
                  <TableHead className="text-xs font-semibold">Phone</TableHead>
                  <TableHead className="text-xs font-semibold">Date</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((query, i) => (
                  <TableRow
                    key={query.id}
                    className={`cursor-pointer group hover:bg-muted/30 transition-colors ${!query.read ? "bg-primary/[0.03]" : ""}`}
                    onClick={() => handleView(query)}
                  >
                    <TableCell className="text-xs text-muted-foreground font-medium">{i + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className={`text-sm ${!query.read ? "font-bold" : "font-semibold"} text-foreground`}>{query.name}</p>
                        {query.school && <p className="text-[11px] text-muted-foreground">{query.school}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[11px] font-medium">{query.queryType}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{query.phone}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{query.date}</TableCell>
                    <TableCell>
                      {query.read ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-muted text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                          Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          New
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await deleteQuery(query.id);
                              toast({ title: "Query Deleted" });
                              setSelectedQuery((prev) => (prev?.id === query.id ? null : prev));
                            } catch {
                              toast({ title: "Error", description: "Could not delete query.", variant: "destructive" });
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No queries found
                    </TableCell>
                  </TableRow>
                )}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      Loading queries...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Query Detail Modal */}
        <Dialog open={!!selectedQuery} onOpenChange={(open) => !open && setSelectedQuery(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Query Details
              </DialogTitle>
            </DialogHeader>
            {selectedQuery && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: User, label: "Name", value: selectedQuery.name },
                    { icon: Phone, label: "Phone", value: selectedQuery.phone },
                    { icon: Mail, label: "Email", value: selectedQuery.email || "—" },
                    { icon: School, label: "School", value: selectedQuery.school || "—" },
                    { icon: FileText, label: "Query Type", value: selectedQuery.queryType },
                    { icon: Calendar, label: "Date", value: selectedQuery.date },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{item.label}</p>
                        <p className="text-sm font-semibold text-foreground truncate">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">Message</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selectedQuery.message}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminQueries;
