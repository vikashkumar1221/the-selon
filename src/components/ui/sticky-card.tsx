"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

export interface CardData {
  id: number | string;
  image: string;
  alt?: string;
  title?: string;
  category?: string;
}

export interface StickyCard002Props {
  cards: CardData[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

const StickyCard002 = ({
  cards,
  className,
  containerClassName,
  imageClassName,
}: StickyCard002Props) => {
  const container = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      gsap.registerPlugin(ScrollTrigger);

      const imageElements = imageRefs.current;
      const totalCards = imageElements.length;

      if (!imageElements[0]) return;

      gsap.set(imageElements[0], { y: "0%", scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        if (!imageElements[i]) continue;
        gsap.set(imageElements[i], { y: "100%", scale: 1, rotation: 0 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky-cards",
          start: "top top",
          end: `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentImage = imageElements[i];
        const nextImage = imageElements[i + 1];
        const position = i;
        if (!currentImage || !nextImage) continue;

        scrollTimeline.to(
          currentImage,
          {
            scale: 0.7,
            rotation: 5,
            duration: 1,
            ease: "none",
          },
          position,
        );

        scrollTimeline.to(
          nextImage,
          {
            y: "0%",
            duration: 1,
            ease: "none",
          },
          position,
        );
      }

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container },
  );

  return (
    <div className={cn("relative h-full w-full", className)} ref={container}>
      <div className="sticky-cards relative flex min-h-screen h-full w-full items-center justify-center overflow-hidden p-3 lg:p-8">
        <div
          className={cn(
            "relative h-[540px] sm:h-[620px] w-full max-w-sm overflow-hidden rounded-3xl sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.12]",
            containerClassName,
          )}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
              className={cn(
                "absolute inset-0 h-full w-full overflow-hidden rounded-3xl will-change-transform",
                imageClassName,
              )}
            >
              {/* Background card image */}
              <img
                src={card.image}
                alt={card.alt || card.title || ""}
                className="h-full w-full object-cover object-center"
              />

              {/* Luxury dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080B] via-[#08080B]/30 to-transparent" />

              {/* Card content badge & info */}
              {(card.title || card.category) && (
                <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-10 flex flex-col space-y-2">
                  {card.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-gold/40 text-gold text-[11px] font-bold uppercase tracking-wider w-fit">
                      {card.category}
                    </span>
                  )}
                  {card.title && (
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                      {card.title}
                    </h3>
                  )}
                </div>
              )}

              {/* Subtle gold accent frame */}
              <div className="absolute inset-0 rounded-3xl border border-gold/20 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Example usage component with default luxury salon data
const Skiper17 = ({ customCards }: { customCards?: CardData[] }) => {
  const defaultCards: CardData[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200&auto=format&fit=crop",
      alt: "The Royal Crown Lounge",
      title: "Vintage Italian Belmont Chairs",
      category: "Signature Atelier",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop",
      alt: "Straight Razor Hot Lather Shave",
      title: "Double Hot-Steam Towel Shaves",
      category: "Master Barbering",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop",
      alt: "Precision Scissor Work",
      title: "Precision Shears & Skin Fades",
      category: "Couture Styling",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1200&auto=format&fit=crop",
      alt: "Japanese Botanical Head Spa",
      title: "Japanese Botanical Head Spa",
      category: "Holistic Wellness",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1200&auto=format&fit=crop",
      alt: "Gentlemen's Grooming Sanctuary",
      title: "Beard Architecture & Contouring",
      category: "Bespoke Grooming",
    },
  ];

  return (
    <ReactLenis root>
      <div className="h-full w-full">
        <StickyCard002 cards={customCards || defaultCards} />
      </div>
    </ReactLenis>
  );
};

export { Skiper17, StickyCard002 };
