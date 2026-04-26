"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyAdmin, createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, DEMO_MOVIES } from "@/lib/demo-data";
import type { Movie } from "@/lib/types";

export async function getMovies(): Promise<Movie[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_MOVIES.filter((m) => m.is_active);
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getFeaturedMovies(): Promise<Movie[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_MOVIES.filter((m) => m.is_active && m.is_featured);
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getMovieBySlug(slug: string): Promise<Movie | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_MOVIES.find((m) => m.slug === slug) || null;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getMovieById(id: string): Promise<Movie | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_MOVIES.find((m) => m.id === id) || null;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getAllMoviesAdmin(): Promise<Movie[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_MOVIES;
  }
  await verifyAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createMovie(movie: Partial<Movie>): Promise<Movie> {
  if (!isSupabaseConfigured()) throw new Error("Connect Supabase to create movies");
  await verifyAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("movies")
    .insert([movie])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateMovie(id: string, updates: Partial<Movie>): Promise<Movie> {
  if (!isSupabaseConfigured()) throw new Error("Connect Supabase to edit movies");
  await verifyAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("movies")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteMovie(id: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Connect Supabase to delete movies");
  await verifyAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("movies").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function toggleMovieFeatured(id: string, featured: boolean): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Connect Supabase to update movies");
  await verifyAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("movies")
    .update({ is_featured: featured })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function toggleMovieActive(id: string, active: boolean): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Connect Supabase to update movies");
  await verifyAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("movies")
    .update({ is_active: active })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
