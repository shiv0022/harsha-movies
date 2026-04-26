import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { SeatSelectionContent } from "./seat-selection-content";
import { MovieDetailSkeleton } from "@/components/shared/loading-skeleton";

export const metadata = { title: "Select Seats" };

export default function SeatSelectionPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <Suspense fallback={<div className="container-app py-12"><MovieDetailSkeleton /></div>}>
          <SeatSelectionContent />
        </Suspense>
      </main>
    </>
  );
}
