import Link from "next/link";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center container-app max-w-md">
        <div className="w-20 h-20 rounded-2xl gradient-accent mx-auto mb-6 flex items-center justify-center shadow-xl shadow-accent/30">
          <Film className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-display text-6xl font-black text-accent mb-4">404</h1>
        <h2 className="font-display text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
