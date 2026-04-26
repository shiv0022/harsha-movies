import Link from "next/link";
import { Film, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react";
import { APP_NAME, BUSINESS } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-lg">{APP_NAME}</span>
                <p className="text-[10px] text-gold tracking-widest uppercase">{BUSINESS.tagline}</p>
              </div>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              {BUSINESS.description}
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-surface-light flex items-center justify-center text-muted hover:text-accent hover:bg-surface-lighter transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-gold">Quick Links</h4>
            {[
              { label: "Now Showing", href: "/#now-showing" },
              { label: "Coming Soon", href: "/#upcoming" },
              { label: "Offers", href: "/#offers" },
              { label: "About Us", href: "#" },
              { label: "Terms & Conditions", href: "#" },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="block text-sm text-muted hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-gold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-muted">
                <MapPin className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                <span>{BUSINESS.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>{BUSINESS.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span>{BUSINESS.email}</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-gold">Operating Hours</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted">
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <span>Box Office: {BUSINESS.hours}</span>
              </div>
              <div className="text-sm text-muted pl-7">
                <p>Monday – Sunday</p>
                <p className="text-gold mt-1">🎬 Open All Days</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-dark">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-accent">♥</span> for cinema lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
