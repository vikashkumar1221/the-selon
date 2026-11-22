"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Scissors,
  Clock,
  Sparkles,
  User,
  Shield,
  Store,
  ChevronDown,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { useSalonStore } from "@/lib/store/salonStore";

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, switchUser } = useSalonStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Salons", href: "/salons" },
    { name: "Live Queue", href: "/queue" },
    { name: "How It Works", href: "/#how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0B0D]/90 backdrop-blur-md border-b border-gold-border/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#BFA15F] p-[1px] shadow-gold transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#0B0B0D] rounded-xl flex items-center justify-center">
                <Scissors className="w-5 h-5 text-gold group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-wider text-white">
                SALON<span className="text-gold">X</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#A1A1AA] -mt-1 font-medium">
                Luxury Salon & Queue
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-gold font-semibold"
                      : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Role Switcher & Book CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Role Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#171719] border border-gold-border/30 text-xs text-[#A1A1AA] hover:text-white hover:border-gold transition-colors"
                title="Switch role for testing"
              >
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
                <span className="font-medium capitalize text-white">
                  {currentUser.role.replace("_", " ")}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gold" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#171719] border border-gold-border/40 shadow-luxury py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-charcoal-border/50 text-[11px] text-[#A1A1AA] uppercase font-semibold tracking-wider">
                    Test Role Persona
                  </div>
                  <button
                    onClick={() => {
                      switchUser("usr_customer_1");
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center space-x-2.5 transition-colors ${
                      currentUser.role === "customer"
                        ? "bg-gold/10 text-gold font-semibold"
                        : "text-[#A1A1AA] hover:bg-[#212124] hover:text-white"
                    }`}
                  >
                    <User className="w-4 h-4 text-gold" />
                    <div>
                      <p className="text-white">Customer View</p>
                      <p className="text-[10px] text-[#A1A1AA]">Alexander (Client)</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchUser("usr_owner_1");
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center space-x-2.5 transition-colors ${
                      currentUser.role === "salon_owner"
                        ? "bg-gold/10 text-gold font-semibold"
                        : "text-[#A1A1AA] hover:bg-[#212124] hover:text-white"
                    }`}
                  >
                    <Store className="w-4 h-4 text-gold" />
                    <div>
                      <p className="text-white">Salon Owner View</p>
                      <p className="text-[10px] text-[#A1A1AA]">Marcus (Royal Crown)</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchUser("usr_admin_1");
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center space-x-2.5 transition-colors ${
                      currentUser.role === "admin"
                        ? "bg-gold/10 text-gold font-semibold"
                        : "text-[#A1A1AA] hover:bg-[#212124] hover:text-white"
                    }`}
                  >
                    <Shield className="w-4 h-4 text-gold" />
                    <div>
                      <p className="text-white">Super Admin View</p>
                      <p className="text-[10px] text-[#A1A1AA]">Victoria (Platform Ops)</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Dashboard Quick Link based on role */}
            {currentUser.role === "customer" && (
              <Link
                href="/customer"
                className="text-xs text-[#A1A1AA] hover:text-white px-2 py-1 transition-colors"
              >
                My Bookings
              </Link>
            )}
            {currentUser.role === "salon_owner" && (
              <Link
                href="/owner"
                className="text-xs text-gold border border-gold/40 px-2.5 py-1.5 rounded-lg hover:bg-gold/10 transition-colors flex items-center space-x-1"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Owner Dashboard</span>
              </Link>
            )}
            {currentUser.role === "admin" && (
              <Link
                href="/admin"
                className="text-xs text-gold border border-gold/40 px-2.5 py-1.5 rounded-lg hover:bg-gold/10 transition-colors flex items-center space-x-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            )}

            {/* Book Now Primary Button */}
            <Link
              href="/book"
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#BFA15F] rounded-lg shadow-gold hover:opacity-95 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Book Appointment
            </Link>
          </div>

          {/* Mobile menu trigger button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/book"
              className="text-xs font-semibold px-3 py-1.5 bg-gold text-black rounded-lg"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#171719] border border-charcoal-border text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0B0D] border-b border-gold-border/30 px-4 pt-3 pb-6 space-y-4">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-[#A1A1AA] hover:text-gold hover:bg-[#171719] rounded-lg"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-charcoal-border/50">
            <p className="text-[11px] uppercase tracking-wider text-[#A1A1AA] px-3 mb-2 font-semibold">
              Quick Role Navigation
            </p>
            <div className="grid grid-cols-3 gap-2 px-1">
              <button
                onClick={() => {
                  switchUser("usr_customer_1");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-[11px] rounded-lg border text-center ${
                  currentUser.role === "customer"
                    ? "border-gold text-gold bg-gold/10"
                    : "border-charcoal-border text-[#A1A1AA]"
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => {
                  switchUser("usr_owner_1");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-[11px] rounded-lg border text-center ${
                  currentUser.role === "salon_owner"
                    ? "border-gold text-gold bg-gold/10"
                    : "border-charcoal-border text-[#A1A1AA]"
                }`}
              >
                Owner
              </button>
              <button
                onClick={() => {
                  switchUser("usr_admin_1");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-[11px] rounded-lg border text-center ${
                  currentUser.role === "admin"
                    ? "border-gold text-gold bg-gold/10"
                    : "border-charcoal-border text-[#A1A1AA]"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-2 pt-2">
            <Link
              href="/owner"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-center py-2 text-gold border border-gold/30 rounded-lg"
            >
              Salon Owner Portal
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-center py-2 text-[#A1A1AA] border border-charcoal-border rounded-lg"
            >
              Super Admin Console
            </Link>
            <Link
              href="/become-partner"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-center py-2 text-white bg-[#171719] rounded-lg"
            >
              Become a Partner
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
