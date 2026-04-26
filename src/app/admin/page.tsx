import { getDashboardStats, getRecentBookings } from "@/actions/bookings";
import { DashboardContent } from "./dashboard-content";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  let stats, recentBookings;
  try {
    [stats, recentBookings] = await Promise.all([
      getDashboardStats(),
      getRecentBookings(10),
    ]);
  } catch {
    stats = { totalMovies: 0, totalBookings: 0, todayBookings: 0, totalRevenue: 0 };
    recentBookings = [];
  }

  return <DashboardContent stats={stats} recentBookings={recentBookings} />;
}
