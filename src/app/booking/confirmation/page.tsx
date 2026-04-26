import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ConfirmationContent } from "./confirmation-content";

export const metadata = { title: "Booking Confirmed" };

export default function ConfirmationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <Suspense fallback={<div className="container-app py-20 flex justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
          <ConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
