"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { PageTransition } from "@/components/shared/page-transition";
import { getAllMoviesAdmin, toggleMovieActive, toggleMovieFeatured, deleteMovie } from "@/actions/movies";
import { formatDate } from "@/lib/utils";
import type { Movie } from "@/lib/types";
import { toast } from "sonner";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const data = await getAllMoviesAdmin();
      setMovies(data);
    } catch {
      toast.error("Failed to load movies");
    }
    setLoading(false);
  };

  useEffect(() => { fetchMovies(); }, []);

  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = async (id: string, current: boolean) => {
    await toggleMovieActive(id, !current);
    setMovies((prev) => prev.map((m) => m.id === id ? { ...m, is_active: !current } : m));
    toast.success(!current ? "Movie activated" : "Movie deactivated");
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    await toggleMovieFeatured(id, !current);
    setMovies((prev) => prev.map((m) => m.id === id ? { ...m, is_featured: !current } : m));
    toast.success(!current ? "Added to featured" : "Removed from featured");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this movie? This will also delete all its showtimes.")) return;
    try {
      await deleteMovie(id);
      setMovies((prev) => prev.filter((m) => m.id !== id));
      toast.success("Movie deleted");
    } catch {
      toast.error("Failed to delete movie");
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Movies</h1>
            <p className="text-muted text-sm mt-1">{movies.length} movies total</p>
          </div>
          <Link href="/admin/movies/new">
            <Button className="gap-2"><Plus className="w-4 h-4" /> Add Movie</Button>
          </Link>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input placeholder="Search movies..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="bg-surface border-border">
            <CardContent className="py-12 text-center text-muted">
              No movies found. Add your first movie!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((movie) => (
              <Card key={movie.id} className="bg-surface border-border hover:border-border/80 transition-colors">
                <CardContent className="p-4">
                  <div className="flex gap-4 items-start">
                    {/* Poster Thumbnail */}
                    <div className="relative w-16 h-24 rounded-lg overflow-hidden shrink-0 bg-surface-light">
                      {movie.poster_url ? (
                        <Image src={movie.poster_url} alt={movie.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted text-xs">No img</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-sm">{movie.title}</h3>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {movie.genre?.map((g) => (
                              <Badge key={g} variant="outline" className="text-[10px]">{g}</Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted mt-1">
                            {movie.language} • {movie.duration} min • {movie.rating} • {formatDate(movie.release_date)}
                          </p>
                        </div>
                      </div>

                      {/* Toggles and Actions */}
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Switch checked={movie.is_active} onCheckedChange={() => handleToggleActive(movie.id, movie.is_active)} />
                          <span className="text-xs text-muted">{movie.is_active ? "Active" : "Hidden"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleFeatured(movie.id, movie.is_featured)}
                            className={`p-1 rounded ${movie.is_featured ? "text-gold" : "text-muted-dark hover:text-gold"}`}
                          >
                            <Star className={`w-4 h-4 ${movie.is_featured ? "fill-current" : ""}`} />
                          </button>
                          <span className="text-xs text-muted">{movie.is_featured ? "Featured" : ""}</span>
                        </div>
                        <div className="flex gap-1 ml-auto">
                          <Link href={`/admin/movies/${movie.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-danger hover:text-danger" onClick={() => handleDelete(movie.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
