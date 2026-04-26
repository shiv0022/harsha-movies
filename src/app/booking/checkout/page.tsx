import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { CheckoutContent } from "./checkout-content";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <Suspense fallback={<div className="container-app py-12 flex justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
          <CheckoutContent />
        </Suspense>
      </main>
    </>
  );
}
