"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Ticket, Calendar, DollarSign, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { PageTransition } from "@/components/shared/page-transition";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import type { DashboardStats, Booking } from "@/lib/types";

interface Props {
  stats: DashboardStats;
  recentBookings: Booking[];
}

const kpiCards = [
  { label: "Total Movies", icon: Film, color: "text-accent", bg: "bg-accent/10", key: "totalMovies" as const },
  { label: "Total Bookings", icon: Ticket, color: "text-gold", bg: "bg-gold/10", key: "totalBookings" as const },
  { label: "Today's Bookings", icon: Calendar, color: "text-success", bg: "bg-success/10", key: "todayBookings" as const },
  { label: "Revenue", icon: DollarSign, color: "text-blue-400", bg: "bg-blue-400/10", key: "totalRevenue" as const, isCurrency: true },
];

export function DashboardContent({ stats, recentBookings }: Props) {
  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted text-sm mt-1">Welcome to Harsh A Movie admin panel</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/movies/new">
              <Button size="sm" className="gap-2 rounded-lg">
                <Plus className="w-4 h-4" /> Add Movie
              </Button>
            </Link>
            <Link href="/admin/showtimes">
              <Button size="sm" variant="outline" className="gap-2 rounded-lg">
                <Clock className="w-4 h-4" /> Showtimes
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, i) => (
            <motion.div
              key={kpi.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-surface border-border hover:border-accent/20 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider font-medium">{kpi.label}</p>
                      <div className="mt-2">
                        <AnimatedCounter
                          value={stats[kpi.key]}
                          prefix={kpi.isCurrency ? "₹" : ""}
                          className={`font-display text-3xl font-black ${kpi.color}`}
                        />
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                      <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Bookings */}
        <Card className="bg-surface border-border">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm">View All →</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-muted text-center py-8">No bookings yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-muted font-medium">Booking ID</th>
                      <th className="text-left py-3 px-2 text-muted font-medium">Customer</th>
                      <th className="text-left py-3 px-2 text-muted font-medium hidden md:table-cell">Movie</th>
                      <th className="text-left py-3 px-2 text-muted font-medium hidden sm:table-cell">Seats</th>
                      <th className="text-left py-3 px-2 text-muted font-medium">Amount</th>
                      <th className="text-left py-3 px-2 text-muted font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-border/50 hover:bg-surface-light/50 transition-colors">
                        <td className="py-3 px-2 font-mono text-xs text-accent">{booking.booking_id}</td>
                        <td className="py-3 px-2">{booking.customer_name}</td>
                        <td className="py-3 px-2 hidden md:table-cell text-muted">
                          {(booking.showtime as any)?.movie?.title || "N/A"}
                        </td>
                        <td className="py-3 px-2 hidden sm:table-cell">
                          {(booking.selected_seats as string[])?.length || 0}
                        </td>
                        <td className="py-3 px-2 font-medium">{formatCurrency(booking.final_amount)}</td>
                        <td className="py-3 px-2">
                          <Badge variant={booking.booking_status === "confirmed" ? "success" : "destructive"}>
                            {booking.booking_status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
