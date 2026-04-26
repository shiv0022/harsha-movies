"use client";

import { useEffect, useState } from "react";
import { Search, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PageTransition } from "@/components/shared/page-transition";
import { getBookings, cancelBooking } from "@/actions/bookings";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import type { Booking } from "@/lib/types";
import { toast } from "sonner";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try { setBookings(await getBookings()); } catch { toast.error("Failed to load bookings"); }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const filtered = bookings.filter((b) => {
    const matchSearch = !search || b.booking_id.toLowerCase().includes(search.toLowerCase()) || b.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.booking_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this booking? Seats will be freed.")) return;
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, booking_status: "cancelled" as const } : b));
      setSelected(null);
      toast.success("Booking cancelled");
    } catch { toast.error("Failed to cancel"); }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Bookings</h1>
          <p className="text-muted text-sm mt-1">{bookings.length} total bookings</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input placeholder="Search by ID or customer..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {["all", "confirmed", "cancelled"].map((s) => (
              <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)} className="capitalize">
                {s}
              </Button>
            ))}
          </div>
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
                      <th className="text-left py-3 px-4 text-muted font-medium">Booking ID</th>
                      <th className="text-left py-3 px-4 text-muted font-medium">Customer</th>
                      <th className="text-left py-3 px-4 text-muted font-medium hidden md:table-cell">Movie</th>
                      <th className="text-left py-3 px-4 text-muted font-medium hidden sm:table-cell">Seats</th>
                      <th className="text-left py-3 px-4 text-muted font-medium">Amount</th>
                      <th className="text-left py-3 px-4 text-muted font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-muted font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b) => (
                      <tr key={b.id} className="border-b border-border/50 hover:bg-surface-light/50">
                        <td className="py-3 px-4 font-mono text-xs text-accent">{b.booking_id}</td>
                        <td className="py-3 px-4">{b.customer_name}</td>
                        <td className="py-3 px-4 hidden md:table-cell text-muted">{(b.showtime as any)?.movie?.title || "N/A"}</td>
                        <td className="py-3 px-4 hidden sm:table-cell">{(b.selected_seats as string[])?.length || 0}</td>
                        <td className="py-3 px-4 font-medium">{formatCurrency(b.final_amount)}</td>
                        <td className="py-3 px-4">
                          <Badge variant={b.booking_status === "confirmed" ? "success" : "destructive"}>{b.booking_status}</Badge>
                        </td>
                        <td className="py-3 px-4 flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(b)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {b.booking_status === "confirmed" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-danger" onClick={() => handleCancel(b.id)}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Detail Dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>{selected?.booking_id}</DialogDescription>
            </DialogHeader>
            {selected && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted">Customer</span><span className="font-medium">{selected.customer_name}</span></div>
                <div className="flex justify-between"><span className="text-muted">Phone</span><span>{selected.phone}</span></div>
                <div className="flex justify-between"><span className="text-muted">Email</span><span>{selected.email || "N/A"}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-muted">Movie</span><span>{(selected.showtime as any)?.movie?.title || "N/A"}</span></div>
                <div className="flex justify-between"><span className="text-muted">Date</span><span>{selected.showtime?.show_date ? formatDate(selected.showtime.show_date) : "N/A"}</span></div>
                <div className="flex justify-between"><span className="text-muted">Time</span><span>{selected.showtime?.show_time ? formatTime(selected.showtime.show_time) : "N/A"}</span></div>
                <div className="flex justify-between"><span className="text-muted">Seats</span><span>{(selected.selected_seats as string[]).join(", ")}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatCurrency(selected.subtotal)}</span></div>
                {selected.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{formatCurrency(selected.discount)}</span></div>}
                <div className="flex justify-between font-bold"><span>Total</span><span className="text-gold">{formatCurrency(selected.final_amount)}</span></div>
                <div className="flex justify-between"><span className="text-muted">Payment</span><span className="capitalize">{selected.payment_mode}</span></div>
                <div className="flex justify-between"><span className="text-muted">Status</span><Badge variant={selected.booking_status === "confirmed" ? "success" : "destructive"}>{selected.booking_status}</Badge></div>
                {selected.booking_status === "confirmed" && (
                  <Button variant="destructive" className="w-full mt-4" onClick={() => handleCancel(selected.id)}>Cancel Booking</Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
