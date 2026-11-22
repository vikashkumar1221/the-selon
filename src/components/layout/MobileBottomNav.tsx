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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0B0D]/95 backdrop-blur-lg border-t border-gold-border/30 px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                isActive ? "text-gold" : "text-[#71717A] hover:text-[#A1A1AA]"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "text-gold" : ""}`} />
                {item.name === "Queue" && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-gold animate-ping"></span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? "font-semibold text-white" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
