"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  variant?: "poster" | "compact";
  index?: number;
}

export function MovieCard({ movie, variant = "poster", index = 0 }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/movie/${movie.slug}`} className="group block">
        <div className={cn(
          "relative overflow-hidden rounded-xl card-hover glow-border",
          variant === "poster" ? "aspect-[2/3]" : "aspect-[3/4]"
        )}>
          {/* Poster Image */}
          <Image
            src={movie.poster_url || "/images/placeholder-poster.jpg"}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {movie.is_featured && (
              <Badge variant="gold" className="text-[10px]">
                <Star className="w-3 h-3 mr-1" /> Featured
              </Badge>
            )}
            <Badge className={cn("text-[10px]", movie.rating === "A" ? "bg-red-500/30 text-red-400" : "bg-green-500/30 text-green-400")}>
              {movie.rating}
            </Badge>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-display font-bold text-base leading-tight mb-1 group-hover:text-accent transition-colors line-clamp-2">
              {movie.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {movie.duration} min
              </span>
              <span>•</span>
              <span>{movie.language}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {movie.genre?.slice(0, 2).map((g) => (
                <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Hover CTA */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-6 py-2.5 rounded-full gradient-accent text-white text-sm font-semibold shadow-lg shadow-accent/30 transform -translate-y-2 group-hover:translate-y-0 transition-transform">
              Book Now →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
