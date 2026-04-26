"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PageTransition } from "@/components/shared/page-transition";
import { getPromoCodes, createPromoCode, updatePromoCode, deletePromoCode } from "@/actions/promos";
import type { PromoCode } from "@/lib/types";
import { toast } from "sonner";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PromoCode | null>(null);
  const [form, setForm] = useState({
    code: "", discount_type: "percentage" as "percentage" | "fixed",
    discount_value: "10", usage_limit: "0", expiry_date: "", is_active: true,
  });

  const fetchPromos = async () => {
    try { setPromos(await getPromoCodes()); } catch { toast.error("Failed to load promo codes"); }
    setLoading(false);
  };

  useEffect(() => { fetchPromos(); }, []);

  const resetForm = () => {
    setForm({ code: "", discount_type: "percentage", discount_value: "10", usage_limit: "0", expiry_date: "", is_active: true });
    setEditing(null);
  };

  const openEdit = (p: PromoCode) => {
    setEditing(p);
    setForm({
      code: p.code, discount_type: p.discount_type,
      discount_value: String(p.discount_value), usage_limit: String(p.usage_limit),
      expiry_date: p.expiry_date || "", is_active: p.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) { toast.error("Code is required"); return; }
    try {
      const payload = {
        code: form.code, discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value), usage_limit: parseInt(form.usage_limit),
        expiry_date: form.expiry_date || null, is_active: form.is_active,
      };
      if (editing) {
        await updatePromoCode(editing.id, payload);
        toast.success("Promo code updated!");
      } else {
        await createPromoCode(payload);
        toast.success("Promo code created!");
      }
      setDialogOpen(false);
      resetForm();
      fetchPromos();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo code?")) return;
    try { await deletePromoCode(id); setPromos((p) => p.filter((x) => x.id !== id)); toast.success("Deleted"); } catch { toast.error("Failed"); }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Promo Codes</h1>
            <p className="text-muted text-sm mt-1">{promos.length} promo codes</p>
          </div>
          <Button className="gap-2" onClick={() => { resetForm(); setDialogOpen(true); }}>
            <Plus className="w-4 h-4" /> Add Promo Code
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <Card className="bg-surface border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted font-medium">Code</th>
                      <th className="text-left py-3 px-4 text-muted font-medium">Discount</th>
                      <th className="text-left py-3 px-4 text-muted font-medium hidden sm:table-cell">Usage</th>
                      <th className="text-left py-3 px-4 text-muted font-medium hidden md:table-cell">Expiry</th>
                      <th className="text-left py-3 px-4 text-muted font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-muted font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promos.map((p) => (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-surface-light/50">
                        <td className="py-3 px-4 font-mono font-bold text-accent">{p.code}</td>
                        <td className="py-3 px-4">
                          <Badge variant="gold">
                            {p.discount_type === "percentage" ? `${p.discount_value}%` : `₹${p.discount_value}`}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell text-muted">
                          {p.times_used}/{p.usage_limit || "∞"}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell text-muted">
                          {p.expiry_date || "No expiry"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={p.is_active ? "success" : "secondary"}>
                            {p.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-danger" onClick={() => handleDelete(p.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit" : "Add"} Promo Code</DialogTitle>
              <DialogDescription>
                {editing ? "Update promo code details" : "Create a new promo code"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Code *</Label><Input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="e.g. SUMMER50" className="uppercase" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select value={form.discount_type} onValueChange={(v) => setForm((p) => ({ ...p, discount_type: v as any }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Value</Label><Input type="number" value={form.discount_value} onChange={(e) => setForm((p) => ({ ...p, discount_value: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Usage Limit (0 = unlimited)</Label><Input type="number" value={form.usage_limit} onChange={(e) => setForm((p) => ({ ...p, usage_limit: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Expiry Date</Label><Input type="date" value={form.expiry_date} onChange={(e) => setForm((p) => ({ ...p, expiry_date: e.target.value }))} /></div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
