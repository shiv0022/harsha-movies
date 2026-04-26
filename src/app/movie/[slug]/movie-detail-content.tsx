"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Globe, Star, Calendar, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PageTransition } from "@/components/shared/page-transition";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { useBookingStore } from "@/hooks/use-booking-store";
import { formatDate, formatTime, formatCurrency, getGenreColor, getRatingBadge } from "@/lib/utils";
import type { Movie, Showtime } from "@/lib/types";

interface Props {
  movie: Movie;
  showtimes: Showtime[];
}

export function MovieDetailContent({ movie, showtimes }: Props) {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { setMovie, setShowtime } = useBookingStore();

  // Group showtimes by date
  const dateGroups = showtimes.reduce((acc, st) => {
    const date = st.show_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(st);
    return acc;
  }, {} as Record<string, Showtime[]>);

  const dates = Object.keys(dateGroups).sort();
  const activeDate = selectedDate || dates[0] || null;

  const handleSelectShowtime = (st: Showtime) => {
    setMovie({ id: movie.id, title: movie.title, poster_url: movie.poster_url });
    setShowtime(st);
  };

  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&\s?]+)/);
    return match?.[1];
  };

  return (
    <PageTransition>
      {/* Banner Hero */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src={movie.banner_url || movie.poster_url || "/images/placeholder-banner.jpg"}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      {/* Movie Info */}
      <div className="container-app -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-48 md:w-64 shrink-0"
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-border">
              <Image
                src={movie.poster_url || "/images/placeholder-poster.jpg"}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 pt-4"
          >
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-black mb-4">
              {movie.title}
            </h1>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={getRatingBadge(movie.rating)}>{movie.rating}</Badge>
              <span className="flex items-center gap-1.5 text-sm text-muted">
                <Clock className="w-4 h-4" /> {movie.duration} min
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted">
                <Globe className="w-4 h-4" /> {movie.language}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted">
                <Calendar className="w-4 h-4" /> {formatDate(movie.release_date)}
              </span>
            </div>

            {/* Genre chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre?.map((g) => (
                <Badge key={g} variant="outline" className={getGenreColor(g)}>
                  {g}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <p className="text-muted leading-relaxed mb-6 max-w-2xl">
              {movie.description}
            </p>

            {/* Trailer Button */}
            {movie.trailer_url && (
              <Button
                variant="outline"
                size="lg"
                className="rounded-full gap-2 mb-6"
                onClick={() => setTrailerOpen(true)}
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Trailer
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Showtimes Section */}
      <ScrollReveal>
        <div className="container-app py-12">
          <Separator className="mb-8" />
          <h2 className="font-display text-xl md:text-2xl font-bold mb-6">
            <Star className="w-5 h-5 inline text-gold mr-2" />
            Select Showtime
          </h2>

          {dates.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center">
              <p className="text-muted">No showtimes available for this movie.</p>
            </div>
          ) : (
            <>
              {/* Date Selector */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {dates.map((date) => {
                  const d = new Date(date);
                  const isActive = date === activeDate;
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`shrink-0 flex flex-col items-center px-5 py-3 rounded-xl border transition-all ${
                        isActive
                          ? "bg-accent/20 border-accent text-foreground"
                          : "bg-surface border-border text-muted hover:border-accent/50"
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider">
                        {d.toLocaleDateString("en-IN", { weekday: "short" })}
                      </span>
                      <span className="text-lg font-bold">{d.getDate()}</span>
                      <span className="text-[10px]">
                        {d.toLocaleDateString("en-IN", { month: "short" })}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots */}
              {activeDate && dateGroups[activeDate] && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {dateGroups[activeDate].map((st) => {
                    const bookedCount = (st.booked_seats as string[])?.length || 0;
                    const availableSeats = st.total_seats - bookedCount;
                    const isFull = availableSeats <= 0;

                    return (
                      <Link
                        key={st.id}
                        href={isFull ? "#" : `/booking/seats?showtime=${st.id}`}
                        onClick={() => !isFull && handleSelectShowtime(st)}
                        className={`group relative glass rounded-xl p-4 border transition-all ${
                          isFull
                            ? "opacity-50 cursor-not-allowed border-border"
                            : "border-border hover:border-accent cursor-pointer card-hover"
                        }`}
                      >
                        <div className="text-center">
                          <p className="font-bold text-lg">{formatTime(st.show_time)}</p>
                          <p className="text-xs text-muted mt-1">{st.screen_name}</p>
                          <p className="text-xs text-gold mt-1">{formatCurrency(st.price)}</p>
                          <p className={`text-[10px] mt-2 ${isFull ? "text-danger" : "text-success"}`}>
                            {isFull ? "Housefull" : `${availableSeats} seats left`}
                          </p>
                        </div>
                        {!isFull && (
                          <div className="absolute inset-0 rounded-xl bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollReveal>

      {/* Trailer Modal */}
      <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black border-border">
          <DialogTitle className="sr-only">Trailer - {movie.title}</DialogTitle>
          <div className="aspect-video">
            {movie.trailer_url && getYouTubeId(movie.trailer_url) ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(movie.trailer_url)}?autoplay=1`}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">
                Trailer not available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
