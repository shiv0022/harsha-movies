import type { Movie, Showtime, PromoCode, Booking, DashboardStats } from "@/lib/types";

// ============================================================
// DEMO MOVIES — fully populated, realistic content
// ============================================================

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function pastDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

const now = new Date().toISOString();

export const DEMO_MOVIES: Movie[] = [
  {
    id: "m1",
    title: "Pushpa 2: The Rule",
    slug: "pushpa-2-the-rule",
    description: "Pushpa Raj returns with a vengeance in this high-octane sequel. As he rises in the smuggling syndicate, his enemies grow stronger and more dangerous. With jaw-dropping action sequences and a gripping storyline, Pushpa must navigate treacherous alliances while protecting his family and legacy. The rule of the jungle has changed — and Pushpa writes the new one.",
    poster_url: "https://image.tmdb.org/t/p/w500/iFbd98MNV3O03SVbJDMkXpXMhpH.jpg",
    banner_url: "https://image.tmdb.org/t/p/original/bQS43HSLZzMjZkcHJz4fGc7fNdz.jpg",
    trailer_url: "https://www.youtube.com/watch?v=Q1NKMPhP8PY",
    genre: ["Action", "Drama", "Thriller"],
    duration: 179,
    language: "Telugu",
    rating: "UA",
    release_date: pastDate(30),
    is_featured: true,
    is_active: true,
    created_at: now,
  },
  {
    id: "m2",
    title: "Singham Again",
    slug: "singham-again",
    description: "Bajirao Singham embarks on his most ambitious mission yet. When a global threat emerges that endangers national security, Singham assembles an elite team of officers to take on the challenge. Packed with intense action, patriotic fervor, and a stellar ensemble cast featuring the biggest names in Bollywood.",
    poster_url: "https://image.tmdb.org/t/p/w500/baCJuXFe2NjRtEKR2rLRvPxWfuG.jpg",
    banner_url: "https://image.tmdb.org/t/p/original/sRLC052ieEzkQs9dEtPMfFxYkej.jpg",
    trailer_url: "https://www.youtube.com/watch?v=RfaclNeTwWU",
    genre: ["Action", "Drama"],
    duration: 162,
    language: "Hindi",
    rating: "UA",
    release_date: pastDate(20),
    is_featured: true,
    is_active: true,
    created_at: now,
  },
  {
    id: "m3",
    title: "Interstellar",
    slug: "interstellar",
    description: "When Earth becomes uninhabitable, a team of explorers travels through a wormhole near Saturn in search of a new home for humanity. Piloting the spacecraft Endurance, former NASA pilot Cooper must decide between seeing his children again and the future of the human race. A visually stunning masterpiece that explores the depths of space and time.",
    poster_url: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    banner_url: "https://image.tmdb.org/t/p/original/xJHokMbljXjADYdit5fK1OEpXb0.jpg",
    trailer_url: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    duration: 169,
    language: "English",
    rating: "UA",
    release_date: pastDate(15),
    is_featured: true,
    is_active: true,
    created_at: now,
  },
  {
    id: "m4",
    title: "Stree 3",
    slug: "stree-3",
    description: "Chanderi is haunted once again — but this time the threat is far more terrifying than anyone imagined. The gang reunites with new allies to face an ancient evil that has awakened. Blending horror with signature humor, this sequel raises the stakes with spectacular visual effects, hilarious twists, and spine-chilling moments.",
    poster_url: "https://image.tmdb.org/t/p/w500/sWKQjTbUp3JuLfNGvjPBuyaGMnE.jpg",
    banner_url: "https://image.tmdb.org/t/p/original/7cqKGQMnNTaqdJVf3E8nEVMoOBh.jpg",
    trailer_url: "https://www.youtube.com/watch?v=aWZBTBeOpFs",
    genre: ["Horror", "Comedy"],
    duration: 145,
    language: "Hindi",
    rating: "UA",
    release_date: pastDate(10),
    is_featured: false,
    is_active: true,
    created_at: now,
  },
  {
    id: "m5",
    title: "Dune: Part Three",
    slug: "dune-part-three",
    description: "The epic conclusion to the Dune saga. Paul Atreides confronts his ultimate destiny as he leads the Fremen in a final battle for control of Arrakis and the fate of the known universe. With breathtaking visuals and an unforgettable score, this film brings Frank Herbert's vision to a spectacular close.",
    poster_url: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    banner_url: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    trailer_url: "https://www.youtube.com/watch?v=Way9Dexny3w",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    duration: 195,
    language: "English",
    rating: "UA",
    release_date: todayPlus(15),
    is_featured: true,
    is_active: true,
    created_at: now,
  },
  {
    id: "m6",
    title: "Bhool Bhulaiyaa 3",
    slug: "bhool-bhulaiyaa-3",
    description: "Rooh Baba returns for another supernatural adventure as mysterious happenings plague a grand haveli in Rajasthan. With double the scares and double the laughs, this installment brings together old favorites and new faces in an unforgettable tale of ghosts, comedy, and dance.",
    poster_url: "https://image.tmdb.org/t/p/w500/vcLHjjFzeFrqr6gqSNrjRDPSBGG.jpg",
    banner_url: "https://image.tmdb.org/t/p/original/avedvodAZUcwqevBfm8p4G2NziQ.jpg",
    trailer_url: "https://www.youtube.com/watch?v=JOVeh6JF0Go",
    genre: ["Horror", "Comedy", "Drama"],
    duration: 158,
    language: "Hindi",
    rating: "UA",
    release_date: todayPlus(30),
    is_featured: false,
    is_active: true,
    created_at: now,
  },
];

// ============================================================
// DEMO SHOWTIMES — auto-generated for all active movies
// ============================================================

function generateShowtimes(): Showtime[] {
  const showtimes: Showtime[] = [];
  const times = ["10:00", "14:00", "18:00", "21:00"];
  const screens = ["Screen 1", "Screen 1", "Screen 1", "IMAX"];
  const prices = [150, 200, 250, 350];
  let counter = 1;

  const activeMovies = DEMO_MOVIES.filter(
    (m) => m.is_active && new Date(m.release_date) <= new Date()
  );

  for (const movie of activeMovies) {
    for (let d = 0; d <= 6; d++) {
      for (let t = 0; t < times.length; t++) {
        // Add some pre-booked seats for realism
        const bookedSeats: string[] = [];
        if (d <= 1) {
          // Today and tomorrow have some booked seats
          const numBooked = Math.floor(Math.random() * 15) + 5;
          for (let b = 0; b < numBooked; b++) {
            const row = String.fromCharCode(65 + Math.floor(Math.random() * 10));
            const col = Math.floor(Math.random() * 10) + 1;
            const seat = `${row}${col}`;
            if (!bookedSeats.includes(seat)) bookedSeats.push(seat);
          }
        }

        showtimes.push({
          id: `st${counter}`,
          movie_id: movie.id,
          screen_name: screens[t],
          show_date: todayPlus(d),
          show_time: times[t],
          price: prices[t],
          total_seats: 100,
          booked_seats: bookedSeats,
          created_at: now,
        });
        counter++;
      }
    }
  }

  return showtimes;
}

export const DEMO_SHOWTIMES = generateShowtimes();

// ============================================================
// DEMO PROMO CODES
// ============================================================

export const DEMO_PROMOS: PromoCode[] = [
  { id: "p1", code: "DEMO", discount_type: "percentage", discount_value: 100, usage_limit: 0, times_used: 12, expiry_date: null, is_active: true },
  { id: "p2", code: "FIRST50", discount_type: "percentage", discount_value: 50, usage_limit: 100, times_used: 34, expiry_date: todayPlus(60), is_active: true },
  { id: "p3", code: "FLAT100", discount_type: "fixed", discount_value: 100, usage_limit: 50, times_used: 8, expiry_date: todayPlus(30), is_active: true },
  { id: "p4", code: "WELCOME", discount_type: "percentage", discount_value: 25, usage_limit: 200, times_used: 67, expiry_date: todayPlus(90), is_active: true },
];

// ============================================================
// DEMO BOOKINGS
// ============================================================

export const DEMO_BOOKINGS: Booking[] = [
  {
    id: "b1", booking_id: "HAM-X7K29L", showtime_id: "st1",
    customer_name: "Rahul Sharma", phone: "9876543210", email: "rahul@email.com",
    selected_seats: ["D4", "D5", "D6"], subtotal: 450, discount: 0, final_amount: 450,
    promo_code_used: null, payment_mode: "cash", payment_status: "completed", booking_status: "confirmed",
    created_at: now,
    showtime: { ...DEMO_SHOWTIMES[0], movie: DEMO_MOVIES[0] },
  },
  {
    id: "b2", booking_id: "HAM-P3M81N", showtime_id: "st5",
    customer_name: "Priya Verma", phone: "9123456780", email: "priya@email.com",
    selected_seats: ["F7", "F8"], subtotal: 400, discount: 400, final_amount: 0,
    promo_code_used: "DEMO", payment_mode: "demo", payment_status: "completed", booking_status: "confirmed",
    created_at: now,
    showtime: { ...DEMO_SHOWTIMES[4], movie: DEMO_MOVIES[1] },
  },
  {
    id: "b3", booking_id: "HAM-Q9T54A", showtime_id: "st9",
    customer_name: "Amit Kumar", phone: "9988776655", email: "amit@email.com",
    selected_seats: ["B2", "B3", "C2", "C3"], subtotal: 800, discount: 200, final_amount: 600,
    promo_code_used: "FIRST50", payment_mode: "cash", payment_status: "completed", booking_status: "confirmed",
    created_at: now,
    showtime: { ...DEMO_SHOWTIMES[8], movie: DEMO_MOVIES[2] },
  },
  {
    id: "b4", booking_id: "HAM-R2W67B", showtime_id: "st2",
    customer_name: "Sneha Gupta", phone: "8877665544", email: "sneha@email.com",
    selected_seats: ["E5"], subtotal: 200, discount: 0, final_amount: 200,
    promo_code_used: null, payment_mode: "cash", payment_status: "completed", booking_status: "cancelled",
    created_at: now,
    showtime: { ...DEMO_SHOWTIMES[1], movie: DEMO_MOVIES[0] },
  },
  {
    id: "b5", booking_id: "HAM-Y8K12Z", showtime_id: "st3",
    customer_name: "Vikram Singh", phone: "7766554433", email: "",
    selected_seats: ["H8", "H9", "H10"], subtotal: 750, discount: 100, final_amount: 650,
    promo_code_used: "FLAT100", payment_mode: "cash", payment_status: "completed", booking_status: "confirmed",
    created_at: now,
    showtime: { ...DEMO_SHOWTIMES[2], movie: DEMO_MOVIES[0] },
  },
];

// ============================================================
// DEMO STATS
// ============================================================

export const DEMO_STATS: DashboardStats = {
  totalMovies: DEMO_MOVIES.length,
  totalBookings: DEMO_BOOKINGS.filter((b) => b.booking_status === "confirmed").length,
  todayBookings: 3,
  totalRevenue: DEMO_BOOKINGS.filter((b) => b.booking_status === "confirmed").reduce((s, b) => s + b.final_amount, 0),
};

// ============================================================
// HELPER: Check if Supabase is configured
// ============================================================

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return url.length > 10 && !url.includes("placeholder");
}
