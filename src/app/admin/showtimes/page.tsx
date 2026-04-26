"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PageTransition } from "@/components/shared/page-transition";
import { getAllShowtimes, createShowtime, deleteShowtime } from "@/actions/showtimes";
import { getAllMoviesAdmin } from "@/actions/movies";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";
import { SCREENS } from "@/lib/constants";
import { toast } from "sonner";
import type { Movie, Showtime } from "@/lib/types";

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState<(Showtime & { movie: { title: string } })[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    movie_id: "", screen_name: "Screen 1",
    show_date: new Date().toISOString().split("T")[0],
    show_time: "14:00", price: "200", total_seats: "100",
  });

  const fetchData = async () => {
    try {
      const [st, mv] = await Promise.all([getAllShowtimes(), getAllMoviesAdmin()]);
      setShowtimes(st);
      setMovies(mv);
    } catch { toast.error("Failed to load data"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!form.movie_id) { toast.error("Select a movie"); return; }
    try {
      await createShowtime({
        movie_id: form.movie_id, screen_name: form.screen_name,
        show_date: form.show_date, show_time: form.show_time,
        price: parseFloat(form.price), total_seats: parseInt(form.total_seats),
      });
      toast.success("Showtime created!");
      setDialogOpen(false);
      fetchData();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this showtime?")) return;
    try {
      await deleteShowtime(id);
      setShowtimes((prev) => prev.filter((s) => s.id !== id));
      toast.success("Showtime deleted");
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Showtimes</h1>
            <p className="text-muted text-sm mt-1">{showtimes.length} showtimes total</p>
          </div>
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" /> Add Showtime
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
                      <th className="text-left py-3 px-4 text-muted font-medium">Movie</th>
                      <th className="text-left py-3 px-4 text-muted font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-muted font-medium">Time</th>
                      <th className="text-left py-3 px-4 text-muted font-medium">Screen</th>
                      <th className="text-left py-3 px-4 text-muted font-medium">Price</th>
                      <th className="text-left py-3 px-4 text-muted font-medium">Booked</th>
                      <th className="text-left py-3 px-4 text-muted font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showtimes.map((st) => {
                      const bookedCount = (st.booked_seats as any)?.length || 0;
                      return (
                        <tr key={st.id} className="border-b border-border/50 hover:bg-surface-light/50">
                          <td className="py-3 px-4 font-medium">{st.movie?.title || "N/A"}</td>
                          <td className="py-3 px-4 text-muted">{formatDate(st.show_date)}</td>
                          <td className="py-3 px-4">{formatTime(st.show_time)}</td>
                          <td className="py-3 px-4 text-muted">{st.screen_name}</td>
                          <td className="py-3 px-4 text-gold">{formatCurrency(st.price)}</td>
                          <td className="py-3 px-4">
                            <Badge variant={bookedCount >= st.total_seats ? "destructive" : "secondary"}>
                              {bookedCount}/{st.total_seats}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-danger" onClick={() => handleDelete(st.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Showtime Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Showtime</DialogTitle>
              <DialogDescription>Create a new showtime for a movie</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Movie *</Label>
                <Select value={form.movie_id} onValueChange={(v) => setForm((p) => ({ ...p, movie_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select movie" /></SelectTrigger>
                  <SelectContent>
                    {movies.filter((m) => m.is_active).map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.show_date} onChange={(e) => setForm((p) => ({ ...p, show_date: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Time</Label><Input type="time" value={form.show_time} onChange={(e) => setForm((p) => ({ ...p, show_time: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Screen</Label>
                  <Select value={form.screen_name} onValueChange={(v) => setForm((p) => ({ ...p, screen_name: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{SCREENS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} /></div>
              </div>
              <div className="space-y-2"><Label>Total Seats</Label><Input type="number" value={form.total_seats} onChange={(e) => setForm((p) => ({ ...p, total_seats: e.target.value }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create Showtime</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
