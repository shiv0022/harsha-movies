"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyAdmin, createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, DEMO_SHOWTIMES, DEMO_MOVIES } from "@/lib/demo-data";
import type { Showtime } from "@/lib/types";

export async function getShowtimesByMovie(movieId: string): Promise<Showtime[]> {
  if (!isSupabaseConfigured()) {
    const today = new Date().toISOString().split("T")[0];
    return DEMO_SHOWTIMES
      .filter((st) => st.movie_id === movieId && st.show_date >= today)
      .sort((a, b) => a.show_date.localeCompare(b.show_date) || a.show_time.localeCompare(b.show_time));
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("showtimes")
    .select("*")
    .eq("movie_id", movieId)
    .gte("show_date", new Date().toISOString().split("T")[0])
    .order("show_date", { ascending: true })
    .order("show_time", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getShowtimeById(id: string): Promise<Showtime | null> {
  if (!isSupabaseConfigured()) {
    const st = DEMO_SHOWTIMES.find((s) => s.id === id);
    if (!st) return null;
    const movie = DEMO_MOVIES.find((m) => m.id === st.movie_id);
    return { ...st, movie } as any;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("showtimes")
    .select("*, movie:movies(*)")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getAllShowtimes(): Promise<(Showtime & { movie: { title: string } })[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_SHOWTIMES.map((st) => {
      const movie = DEMO_MOVIES.find((m) => m.id === st.movie_id);
      return { ...st, movie: { title: movie?.title || "Unknown" } };
    }).sort((a, b) => a.show_date.localeCompare(b.show_date) || a.show_time.localeCompare(b.show_time));
  }
  await verifyAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("showtimes")
    .select("*, movie:movies(title)")
    .order("show_date", { ascending: true })
    .order("show_time", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createShowtime(showtime: Partial<Showtime>): Promise<Showtime> {
  if (!isSupabaseConfigured()) throw new Error("Connect Supabase to create showtimes");
  await verifyAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("showtimes")
    .insert([showtime])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateShowtime(id: string, updates: Partial<Showtime>): Promise<Showtime> {
  if (!isSupabaseConfigured()) throw new Error("Connect Supabase to update showtimes");
  await verifyAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("showtimes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteShowtime(id: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Connect Supabase to delete showtimes");
  await verifyAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("showtimes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateBookedSeats(id: string, seats: string[]): Promise<void> {
  if (!isSupabaseConfigured()) return; // Demo mode — no-op
  const supabase = await createClient();
  const { data: showtime } = await supabase
    .from("showtimes")
    .select("booked_seats")
    .eq("id", id)
    .single();

  if (!showtime) throw new Error("Showtime not found");

  const currentBooked = (showtime.booked_seats as string[]) || [];
  const updatedSeats = [...new Set([...currentBooked, ...seats])];

  const { error } = await supabase
    .from("showtimes")
    .update({ booked_seats: updatedSeats })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function freeSeats(showtimeId: string, seatsToFree: string[]): Promise<void> {
  if (!isSupabaseConfigured()) return; // Demo mode — no-op
  const supabase = await createClient();
  const { data: showtime } = await supabase
    .from("showtimes")
    .select("booked_seats")
    .eq("id", showtimeId)
    .single();

  if (!showtime) throw new Error("Showtime not found");

  const currentBooked = (showtime.booked_seats as string[]) || [];
  const updatedSeats = currentBooked.filter((s) => !seatsToFree.includes(s));

  const { error } = await supabase
    .from("showtimes")
    .update({ booked_seats: updatedSeats })
    .eq("id", showtimeId);
  if (error) throw new Error(error.message);
}
