import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateBookingId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "HAM-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getRowLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

export function getSeatId(row: number, col: number): string {
  return `${getRowLabel(row)}${col + 1}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function getGenreColor(genre: string): string {
  const colors: Record<string, string> = {
    Action: "bg-red-500/20 text-red-400 border-red-500/30",
    Comedy: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Drama: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Horror: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    Romance: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    Thriller: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    "Sci-Fi": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    Animation: "bg-green-500/20 text-green-400 border-green-500/30",
    Adventure: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Fantasy: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  };
  return colors[genre] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export function getRatingBadge(rating: string): string {
  const badges: Record<string, string> = {
    U: "bg-green-500/20 text-green-400 border-green-500/30",
    UA: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    A: "bg-red-500/20 text-red-400 border-red-500/30",
    S: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };
  return badges[rating] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}
