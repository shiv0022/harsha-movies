"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/lib/types";

interface HeroCarouselProps {
  movies: Movie[];
}

export function HeroCarousel({ movies }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % movies.length);
  }, [movies.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + movies.length) % movies.length);
  }, [movies.length]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  if (!movies.length) return null;

  const movie = movies[current];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={movie.banner_url || movie.poster_url || "/images/placeholder-banner.jpg"}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Multi-layer gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full container-app flex items-end pb-16 md:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl"
          >
            {/* Genre chips */}
            <div className="flex gap-2 mb-4">
              {movie.genre?.map((g) => (
                <span key={g} className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80">
                  {g}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
              {movie.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6">
              <span className="px-2 py-0.5 rounded border border-accent/50 text-accent text-xs font-bold">
                {movie.rating}
              </span>
              <span>{movie.duration} min</span>
              <span>•</span>
              <span>{movie.language}</span>
            </div>

            {/* Description */}
            <p className="text-muted text-sm md:text-base leading-relaxed line-clamp-2 mb-8">
              {movie.description}
            </p>

            {/* CTAs */}
            <div className="flex gap-4">
              <Link href={`/movie/${movie.slug}`}>
                <Button size="xl" className="rounded-full shadow-xl shadow-accent/30">
                  🎬 Book Tickets
                </Button>
              </Link>
              <Link href={`/movie/${movie.slug}`}>
                <Button variant="outline" size="xl" className="rounded-full backdrop-blur-sm">
                  View Details
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-6 bottom-8 md:right-10 md:bottom-20 flex gap-3 z-20">
        <button
          onClick={prev}
          className="w-11 h-11 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="w-11 h-11 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-accent" : "w-4 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Radial glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] gradient-radial pointer-events-none" />
    </div>
  );
}
