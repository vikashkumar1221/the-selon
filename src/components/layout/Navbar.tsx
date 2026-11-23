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
    <header className="sticky top-0 z-50 w-full bg-[#0B0B0D]/85 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#BFA15F] p-[1px] shadow-gold transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#0B0B0D] rounded-xl flex items-center justify-center">
                <Scissors className="w-5 h-5 text-gold group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider text-white">
                SALON<span className="text-gold">X</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#71717A] -mt-1 font-semibold">
                Luxury Ateliers & Queue
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
                  className={`text-sm tracking-wide transition-all relative py-1 ${
                    isActive
                      ? "text-gold font-semibold"
                      : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Role Switcher & Book CTA */}
          <div className="hidden lg:flex items-center space-x-3.5">
            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#141418] border border-white/[0.08] text-xs text-[#A1A1AA] hover:text-white hover:border-gold/50 transition-all"
                title="Switch persona"
              >
                <span className="text-[10px] uppercase font-bold text-gold tracking-wider">
                  Role:
                </span>
                <span className="font-semibold capitalize text-white">
                  {currentUser.role.replace("_", " ")}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gold" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#141418] border border-white/[0.12] shadow-2xl py-2 z-50 backdrop-blur-xl">
                  <div className="px-3.5 py-1.5 border-b border-white/[0.06] text-[10px] text-[#71717A] uppercase font-semibold tracking-wider">
                    Switch Test View
                  </div>
                  <button
                    onClick={() => {
                      switchUser("usr_customer_1");
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center space-x-2.5 transition-colors ${
                      currentUser.role === "customer"
                        ? "bg-gold/10 text-gold font-semibold"
                        : "text-[#A1A1AA] hover:bg-[#1E1E24] hover:text-white"
                    }`}
                  >
                    <User className="w-4 h-4 text-gold" />
                    <div>
                      <p className="text-white">Customer View</p>
                      <p className="text-[10px] text-[#71717A]">Alexander Wright</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchUser("usr_owner_1");
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center space-x-2.5 transition-colors ${
                      currentUser.role === "salon_owner"
                        ? "bg-gold/10 text-gold font-semibold"
                        : "text-[#A1A1AA] hover:bg-[#1E1E24] hover:text-white"
                    }`}
                  >
                    <Store className="w-4 h-4 text-gold" />
                    <div>
                      <p className="text-white">Salon Owner Portal</p>
                      <p className="text-[10px] text-[#71717A]">Marcus (Royal Crown)</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchUser("usr_admin_1");
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center space-x-2.5 transition-colors ${
                      currentUser.role === "admin"
                        ? "bg-gold/10 text-gold font-semibold"
                        : "text-[#A1A1AA] hover:bg-[#1E1E24] hover:text-white"
                    }`}
                  >
                    <Shield className="w-4 h-4 text-gold" />
                    <div>
                      <p className="text-white">Super Admin Console</p>
                      <p className="text-[10px] text-[#71717A]">Victoria Sterling</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Role Portal Quick Link */}
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
                className="text-xs text-gold border border-gold/40 px-2.5 py-1.5 rounded-lg hover:bg-gold/10 transition-colors flex items-center space-x-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Owner Portal</span>
              </Link>
            )}
            {currentUser.role === "admin" && (
              <Link
                href="/admin"
                className="text-xs text-gold border border-gold/40 px-2.5 py-1.5 rounded-lg hover:bg-gold/10 transition-colors flex items-center space-x-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Super Admin</span>
              </Link>
            )}

            {/* Book Now Primary Button */}
            <Link
              href="/book"
              className="gold-btn px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center shadow-gold"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Book Appointment
            </Link>
          </div>

          {/* Mobile menu trigger button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/book"
              className="gold-btn text-xs px-3.5 py-1.5 rounded-lg font-bold uppercase"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#141418] border border-white/[0.08] text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E0E12] border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-4">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-[#A1A1AA] hover:text-gold hover:bg-[#17171C] rounded-lg"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-white/[0.08]">
            <p className="text-[10px] uppercase tracking-wider text-[#71717A] px-3 mb-2 font-semibold">
              Switch User View
            </p>
            <div className="grid grid-cols-3 gap-2 px-1">
              <button
                onClick={() => {
                  switchUser("usr_customer_1");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-[11px] rounded-lg border text-center font-medium ${
                  currentUser.role === "customer"
                    ? "border-gold text-gold bg-gold/10"
                    : "border-white/[0.08] text-[#A1A1AA]"
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => {
                  switchUser("usr_owner_1");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-[11px] rounded-lg border text-center font-medium ${
                  currentUser.role === "salon_owner"
                    ? "border-gold text-gold bg-gold/10"
                    : "border-white/[0.08] text-[#A1A1AA]"
                }`}
              >
                Owner
              </button>
              <button
                onClick={() => {
                  switchUser("usr_admin_1");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-[11px] rounded-lg border text-center font-medium ${
                  currentUser.role === "admin"
                    ? "border-gold text-gold bg-gold/10"
                    : "border-white/[0.08] text-[#A1A1AA]"
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
              className="text-xs text-center py-2 text-[#A1A1AA] border border-white/[0.08] rounded-lg"
            >
              Super Admin Console
            </Link>
            <Link
              href="/become-partner"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-center py-2 text-white bg-[#17171C] rounded-lg"
            >
              Become a Partner
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
