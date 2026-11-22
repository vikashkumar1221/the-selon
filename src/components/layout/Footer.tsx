import Link from "next/link";
import { Scissors, ShieldCheck, Clock, MapPin, Phone, Mail, Award, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#08080A] border-t border-charcoal-border/80 text-[#A1A1AA] pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-charcoal-border/50">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#BFA15F] p-[1px] shadow-gold">
                <div className="w-full h-full bg-[#0B0B0D] rounded-xl flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-gold" />
                </div>
              </div>
              <span className="text-2xl font-bold tracking-wider text-white">
                SALON<span className="text-gold">X</span>
              </span>
            </Link>
            <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-sm">
              The premier luxury salon booking and intelligent live queue ecosystem. Elevating the salon experience with zero-waiting precision scheduling and master barbershop artistry.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Verified Luxury Salons
              </span>
              <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-[#171719] text-white border border-charcoal-border">
                <Clock className="w-3.5 h-3.5 mr-1 text-gold" />
                Live Queue Sync
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-white">Explore</p>
            <ul className="space-y-2 text-xs">
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
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-white">For Salons</p>
            <ul className="space-y-2 text-xs">
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
                <span className="text-[#6B7280]">Queue Hardware & Display API</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-white">Concierge</p>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Bandra West, Mumbai & Global Hubs</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>+91 (0) 22 8000 SALON</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>concierge@salonx.luxury</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717A]">
          <p>© {new Date().getFullYear()} SalonX Platform Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-[#A1A1AA] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#A1A1AA] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#A1A1AA] cursor-pointer">Queue SLA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
