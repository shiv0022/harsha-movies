"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Download, MessageCircle, Home, Ticket, Calendar, Clock, MapPin, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageTransition } from "@/components/shared/page-transition";
import { useBookingStore } from "@/hooks/use-booking-store";
import { getBookingById } from "@/actions/bookings";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { BUSINESS } from "@/lib/constants";
import type { Booking } from "@/lib/types";

export function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const { reset } = useBookingStore();

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) { setLoading(false); return; }
      const data = await getBookingById(bookingId);
      setBooking(data);
      setLoading(false);
      reset(); // Clear booking store after confirmation
    }
    fetchBooking();
  }, [bookingId, reset]);

  if (loading) {
    return (
      <div className="container-app py-20 flex justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container-app py-20 text-center">
        <p className="text-muted mb-4">Booking not found.</p>
        <Link href="/"><Button>Back to Home</Button></Link>
      </div>
    );
  }

  const showtime = booking.showtime;
  const movie = showtime?.movie;

  return (
    <PageTransition>
      <div className="container-app py-12 max-w-2xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-success/20 mx-auto flex items-center justify-center mb-4"
          >
            <CheckCircle className="w-12 h-12 text-success" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-3xl font-black mb-2"
          >
            Booking Confirmed! 🎬
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted"
          >
            Your tickets have been booked successfully
          </motion.p>
        </motion.div>

        {/* Booking Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="gradient-accent p-6 text-center">
            <p className="text-white/80 text-sm mb-1">Booking ID</p>
            <p className="text-white font-display text-2xl font-black tracking-wider">{booking.booking_id}</p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            {/* Movie */}
            <div className="flex items-center gap-3">
              <Ticket className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="font-semibold">{movie?.title || "Movie"}</p>
                <p className="text-xs text-muted">{movie?.language} • {movie?.rating}</p>
              </div>
            </div>

            <Separator />

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-accent shrink-0" />
                <div>
                  <p className="text-xs text-muted">Date</p>
                  <p className="text-sm font-medium">{showtime?.show_date ? formatDate(showtime.show_date) : "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <div>
                  <p className="text-xs text-muted">Time</p>
                  <p className="text-sm font-medium">{showtime?.show_time ? formatTime(showtime.show_time) : "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Screen */}
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <div>
                <p className="text-xs text-muted">Screen</p>
                <p className="text-sm font-medium">{showtime?.screen_name || "Screen 1"}</p>
              </div>
            </div>

            {/* Seats */}
            <div>
              <p className="text-xs text-muted mb-2">Seats</p>
              <div className="flex flex-wrap gap-1.5">
                {(booking.selected_seats as string[]).sort().map((seat) => (
                  <span key={seat} className="px-3 py-1 text-sm font-mono rounded-lg bg-accent/20 text-accent border border-accent/30 font-semibold">
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            <Separator />

            {/* Guest Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted shrink-0" />
                <div>
                  <p className="text-xs text-muted">Name</p>
                  <p className="text-sm font-medium">{booking.customer_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted shrink-0" />
                <div>
                  <p className="text-xs text-muted">Phone</p>
                  <p className="text-sm font-medium">{booking.phone}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span>{formatCurrency(booking.subtotal)}</span>
              </div>
              {booking.discount > 0 && (
                <div className="flex justify-between text-sm text-success">
                  <span>Discount {booking.promo_code_used && `(${booking.promo_code_used})`}</span>
                  <span>-{formatCurrency(booking.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                <span>Amount Paid</span>
                <span className="text-gold">{formatCurrency(booking.final_amount)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 mt-8"
        >
          <Button variant="outline" size="lg" className="flex-1 rounded-xl gap-2">
            <Download className="w-4 h-4" /> Download Ticket
          </Button>
          <a
            href={`https://wa.me/${BUSINESS.whatsapp}?text=Hi, I have a booking query. My Booking ID: ${booking.booking_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="secondary" size="lg" className="w-full rounded-xl gap-2">
              <MessageCircle className="w-4 h-4" /> WhatsApp Support
            </Button>
          </a>
          <Link href="/" className="flex-1">
            <Button variant="ghost" size="lg" className="w-full rounded-xl gap-2">
              <Home className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}
