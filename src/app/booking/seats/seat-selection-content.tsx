"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageTransition } from "@/components/shared/page-transition";
import { useBookingStore } from "@/hooks/use-booking-store";
import { formatCurrency, formatDate, formatTime, getSeatId, getRowLabel } from "@/lib/utils";
import { ROWS, COLS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { Showtime } from "@/lib/types";

export function SeatSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const showtimeId = searchParams.get("showtime");

  const {
    movieTitle, moviePoster, selectedSeats, price,
    showDate, showTime, screenName,
    toggleSeat, setMovie, setShowtime: setStoreShowtime,
  } = useBookingStore();

  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShowtime() {
      if (!showtimeId) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("showtimes")
        .select("*, movie:movies(*)")
        .eq("id", showtimeId)
        .single();

      if (data) {
        const st = data as Showtime & { movie: any };
        setBookedSeats((st.booked_seats as string[]) || []);

        // Set store if navigated directly
        if (!movieTitle && st.movie) {
          setMovie({ id: st.movie.id, title: st.movie.title, poster_url: st.movie.poster_url });
          setStoreShowtime(st);
        }
      }
      setLoading(false);
    }
    fetchShowtime();
  }, [showtimeId, movieTitle, setMovie, setStoreShowtime]);

  if (loading) {
    return (
      <div className="container-app py-12">
        <div className="flex items-center justify-center h-[400px]">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!showtimeId) {
    return (
      <div className="container-app py-12 text-center">
        <p className="text-muted mb-4">No showtime selected.</p>
        <Link href="/"><Button>Back to Home</Button></Link>
      </div>
    );
  }

  const subtotal = selectedSeats.length * price;

  return (
    <PageTransition>
      <div className="container-app py-8">
        {/* Back button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map - takes 2 cols */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-2xl font-bold mb-2">Select Your Seats</h1>
            <p className="text-muted text-sm mb-8">
              {movieTitle} • {showDate && formatDate(showDate)} • {showTime && formatTime(showTime)} • {screenName}
            </p>

            {/* Screen Indicator */}
            <div className="text-center mb-8">
              <div className="screen-curve" />
              <div className="flex items-center justify-center gap-2 text-xs text-muted">
                <Monitor className="w-4 h-4" />
                <span>SCREEN THIS WAY</span>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="flex flex-col items-center gap-2 mb-8 overflow-x-auto px-4">
              {Array.from({ length: ROWS }).map((_, row) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="w-6 text-xs text-muted text-right font-mono">
                    {getRowLabel(row)}
                  </span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: COLS }).map((_, col) => {
                      const seatId = getSeatId(row, col);
                      const isBooked = bookedSeats.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      let seatClass = "seat seat-available";
                      if (isBooked) seatClass = "seat seat-booked";
                      else if (isSelected) seatClass = "seat seat-selected";

                      return (
                        <motion.button
                          key={seatId}
                          className={seatClass}
                          onClick={() => !isBooked && toggleSeat(seatId)}
                          whileTap={!isBooked ? { scale: 0.9 } : undefined}
                          disabled={isBooked}
                          title={isBooked ? "Already booked" : seatId}
                        >
                          {col + 1}
                        </motion.button>
                      );
                    })}
                  </div>
                  <span className="w-6 text-xs text-muted font-mono">
                    {getRowLabel(row)}
                  </span>
                </div>
              ))}
            </div>

            {/* Seat Legend */}
            <div className="flex justify-center gap-6 text-xs text-muted">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded seat-available border border-border" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-accent border border-accent" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded seat-booked" />
                <span>Booked</span>
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-6 sticky top-24">
              <h3 className="font-display font-bold text-lg mb-4">Booking Summary</h3>
              <Separator className="mb-4" />

              {/* Movie info */}
              {moviePoster && (
                <div className="flex gap-3 mb-4">
                  <div className="relative w-16 h-24 rounded-lg overflow-hidden shrink-0">
                    <Image src={moviePoster} alt={movieTitle || ""} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{movieTitle}</p>
                    <p className="text-xs text-muted mt-1">{showDate && formatDate(showDate)}</p>
                    <p className="text-xs text-muted">{showTime && formatTime(showTime)}</p>
                    <p className="text-xs text-gold mt-1">{screenName}</p>
                  </div>
                </div>
              )}

              <Separator className="mb-4" />

              {/* Selected seats */}
              <div className="mb-4">
                <p className="text-sm text-muted mb-2">Selected Seats ({selectedSeats.length})</p>
                {selectedSeats.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSeats.sort().map((seat) => (
                      <span key={seat} className="px-2 py-1 text-xs font-mono rounded bg-accent/20 text-accent border border-accent/30">
                        {seat}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-dark">No seats selected</p>
                )}
              </div>

              <Separator className="mb-4" />

              {/* Price */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Price per seat</span>
                  <span>{formatCurrency(price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Seats</span>
                  <span>× {selectedSeats.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Subtotal</span>
                  <span className="text-accent">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <Link href={selectedSeats.length > 0 ? "/booking/checkout" : "#"}>
                <Button
                  size="lg"
                  className="w-full rounded-xl"
                  disabled={selectedSeats.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
