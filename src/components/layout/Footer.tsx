import Link from "next/link";
import { Scissors, ShieldCheck, Clock, MapPin, Phone, Mail, Award, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#060608] border-t border-white/[0.08] text-[#A1A1AA] pt-16 pb-28 md:pb-14 overflow-hidden">
      {/* Subtle bottom ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-gold/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#BFA15F] p-[1px] shadow-gold transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-[#08080B] rounded-xl flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-gold group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-wider text-white">
                  SALON<span className="text-gold">X</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#71717A] -mt-1 font-semibold">
                  Luxury Ateliers & Queue
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-sm pt-1">
              The premier luxury salon booking and intelligent live queue ecosystem. Elevating the salon experience with zero-waiting precision scheduling and master barbershop artistry.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-gold/10 text-gold border border-gold/25 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                Verified Luxury Salons
              </span>
              <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-[#121217] text-[#E4E4E7] border border-white/[0.08]">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-gold" />
                Live Floor Sync
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Explore</p>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/salons" className="hover:text-gold transition-colors">
                  Top Salons
                </Link>
              </li>
              <li>
                <Link href="/queue" className="hover:text-gold transition-colors">
                  Live Queue Tracker
                </Link>
              </li>
              <li>
                <Link href="/salons?category=Haircut" className="hover:text-gold transition-colors">
                  Master Haircuts
                </Link>
              </li>
              <li>
                <Link href="/salons?category=Spa" className="hover:text-gold transition-colors">
                  Japanese Head Spas
                </Link>
              </li>
              <li>
                <Link href="/salons?category=Beard+Trimming" className="hover:text-gold transition-colors">
                  Straight-Razor Shaves
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners & Dashboards */}
          <div className="space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">For Salons</p>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/become-partner" className="hover:text-gold transition-colors flex items-center">
                  Become a Partner
                  <ArrowUpRight className="w-3 h-3 ml-1 text-gold" />
                </Link>
              </li>
              <li>
                <Link href="/owner" className="hover:text-gold transition-colors">
                  Salon Owner Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold transition-colors">
                  Super Admin Console
                </Link>
              </li>
              <li>
                <span className="text-[#52525B]">Queue Hardware & Display API</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Concierge</p>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Bandra West, Mumbai & Global Luxury Hubs</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>+91 (0) 22 8000 SALON</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>concierge@salonx.luxury</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717A]">
          <p>© {new Date().getFullYear()} SalonX Platform Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-gold cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Live Queue SLA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
