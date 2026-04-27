import { getDashboardStats, getRecentBookings } from "@/actions/bookings";
import { DashboardContent } from "./dashboard-content";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  let stats: Awaited<ReturnType<typeof getDashboardStats>>;
  let recentBookings: Awaited<ReturnType<typeof getRecentBookings>>;

  try {
    [stats, recentBookings] = await Promise.all([
      getDashboardStats(),
      getRecentBookings(10),
    ]);
  } catch {
    stats = {
      totalMovies: 0,
      totalBookings: 0,
      todayBookings: 0,
      totalRevenue: 0,
    };
    recentBookings = [];
  }

  return <DashboardContent stats={stats} recentBookings={recentBookings} />;
}