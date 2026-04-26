"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GripVertical, Eye, EyeOff, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/shared/page-transition";
import { getAllMoviesAdmin, toggleMovieFeatured } from "@/actions/movies";
import type { Movie } from "@/lib/types";
import { toast } from "sonner";

export default function AdminBannersPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getAllMoviesAdmin();
        setMovies(data);
      } catch { toast.error("Failed to load"); }
      setLoading(false);
    }
    fetch();
  }, []);

  const featuredMovies = movies.filter((m) => m.is_featured);
  const otherMovies = movies.filter((m) => !m.is_featured && m.is_active);

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await toggleMovieFeatured(id, !current);
      setMovies((prev) => prev.map((m) => m.id === id ? { ...m, is_featured: !current } : m));
      toast.success(!current ? "Added to hero banner" : "Removed from hero banner");
    } catch { toast.error("Failed to update"); }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Hero Banners</h1>
          <p className="text-muted text-sm mt-1">Manage the hero carousel on the homepage</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <>
            {/* Featured / Active Banners */}
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="w-4 h-4 text-gold" /> Active Banners ({featuredMovies.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {featuredMovies.length === 0 ? (
                  <p className="text-muted text-center py-4">No featured banners. Toggle movies below to add them.</p>
                ) : (
                  featuredMovies.map((movie) => (
                    <div key={movie.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-light border border-border">
                      <GripVertical className="w-4 h-4 text-muted-dark cursor-grab" />
                      <div className="relative w-20 h-10 rounded-lg overflow-hidden shrink-0 bg-surface">
                        {movie.banner_url ? (
                          <Image src={movie.banner_url} alt={movie.title} fill className="object-cover" />
                        ) : movie.poster_url ? (
                          <Image src={movie.poster_url} alt={movie.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-dark text-[10px]">No img</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{movie.title}</p>
                        <p className="text-xs text-muted">{movie.language} • {movie.genre?.join(", ")}</p>
                      </div>
                      <Badge variant="gold" className="shrink-0">Featured</Badge>
                      <Switch checked={true} onCheckedChange={() => handleToggle(movie.id, true)} />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Available Movies to Feature */}
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="text-base">Available Movies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {otherMovies.length === 0 ? (
                  <p className="text-muted text-center py-4">All active movies are featured</p>
                ) : (
                  otherMovies.map((movie) => (
                    <div key={movie.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-light/50 border border-border/50">
                      <div className="relative w-20 h-10 rounded-lg overflow-hidden shrink-0 bg-surface">
                        {movie.poster_url ? (
                          <Image src={movie.poster_url} alt={movie.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-dark text-[10px]">No img</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{movie.title}</p>
                        <p className="text-xs text-muted">{movie.language}</p>
                      </div>
                      <Switch checked={false} onCheckedChange={() => handleToggle(movie.id, false)} />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageTransition>
  );
}
