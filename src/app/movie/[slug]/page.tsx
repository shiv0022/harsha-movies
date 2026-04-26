import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMovieBySlug } from "@/actions/movies";
import { getShowtimesByMovie } from "@/actions/showtimes";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MovieDetailContent } from "./movie-detail-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);
  if (!movie) return { title: "Movie Not Found" };
  return {
    title: movie.title,
    description: movie.description,
    openGraph: {
      title: movie.title,
      description: movie.description,
      images: [movie.poster_url],
    },
  };
}

export default async function MovieDetailPage({ params }: Props) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);
  if (!movie) notFound();

  const showtimes = await getShowtimesByMovie(movie.id);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <MovieDetailContent movie={movie} showtimes={showtimes} />
      </main>
      <Footer />
    </>
  );
}
