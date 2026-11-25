"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Calendar, Clock, User } from "lucide-react";
import { useSalonStore } from "@/lib/store/salonStore";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { currentUser } = useSalonStore();

  const profileHref =
    currentUser.role === "salon_owner"
      ? "/owner"
      : currentUser.role === "admin"
      ? "/admin"
      : "/customer";

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/salons", icon: Compass },
    { name: "Bookings", href: "/customer", icon: Calendar },
    { name: "Queue", href: "/queue", icon: Clock },
    { name: "Profile", href: profileHref, icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#08080B]/90 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-2.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-gold font-semibold scale-105"
                  : "text-[#71717A] hover:text-[#D4D4D8]"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "text-gold stroke-[2.3]" : "stroke-[1.8]"
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold shadow-[0_0_8px_#D4AF37]" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1.5 tracking-tight ${
                  isActive ? "text-white font-medium" : "text-[#71717A]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
