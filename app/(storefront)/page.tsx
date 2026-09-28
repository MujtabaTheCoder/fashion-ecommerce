import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Sparkles, Scissors } from "lucide-react";
import { Hero3DCanvas } from "@/components/3d/Hero3DCanvas";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { HomeProductSection } from "@/components/home/HomeProductSection";
import { HomeEditorialAndTrust } from "@/components/home/HomeEditorialAndTrust";

// Dynamic splitting for heavy 3D canvases below the fold
const BespokeShirtStudio = dynamic(
  () => import("@/components/home/BespokeShirtStudio").then((m) => m.BespokeShirtStudio),
  {
    loading: () => (
      <div className="h-[600px] w-full animate-pulse bg-[#141311]/50 rounded-3xl my-12" />
    ),
  },
);

const Atelier3DShowcase = dynamic(
  () => import("@/components/home/Atelier3DShowcase").then((m) => m.Atelier3DShowcase),
  {
    loading: () => (
      <div className="h-[500px] w-full animate-pulse bg-[#11100e]/50 rounded-3xl my-12" />
    ),
  },
);

export const revalidate = 300; // Edge SWR cache 5 minutes

export const metadata = {
  title: "ATELIER · 3D Luxury Fashion & Haute Outfits",
  description:
    "Experience quiet luxury and bespoke 3D outfit customization. Explore tailored silk shirts, double-faced wool overcoats, and 18k solid gold jewelry.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Editorial 3D Hero Section */}
      <section className="relative min-h-[calc(100vh-6rem)] overflow-hidden bg-gradient-to-b from-[#141311] via-[#1c1b18] to-background text-white">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[130px]" />

        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Left Column (6 cols) */}
            <div className="flex flex-col items-start lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-amber-300 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Haute Outfits & 3D Bespoke Tailoring
              </div>

              <h1 className="mt-6 font-display text-4xl font-normal tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.05]">
                Sculptural Outfits. <br />
                <span className="italic font-light text-amber-200">
                  Interactive 3D
                </span>{" "}
                Customizer.
              </h1>

              <p className="mt-6 max-w-lg text-sm sm:text-base leading-relaxed text-white/70">
                Design custom silk and oxford shirts in real-time 3D, explore architectural outerwear, and experience live order tracking with white-glove global delivery.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <span>Explore Outfits</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="#customizer-3d"
                  className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300 backdrop-blur-sm transition-all hover:bg-amber-400/20"
                >
                  <Scissors className="h-4 w-4 text-amber-300" />
                  <span>3D Shirt Studio</span>
                </Link>

                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-white/10"
                >
                  <span>Owner Portal</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-6 w-full max-w-md">
                <div>
                  <p className="text-xl font-medium text-white sm:text-2xl">100%</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/50">
                    Pure Silk & Wool
                  </p>
                </div>
                <div>
                  <p className="text-xl font-medium text-amber-300 sm:text-2xl">3D</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/50">
                    Bespoke Customizer
                  </p>
                </div>
                <div>
                  <p className="text-xl font-medium text-white sm:text-2xl">Live</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/50">
                    Owner Orders Portal
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column 3D WebGL Hero Canvas (6 cols) */}
            <div className="relative flex items-center justify-center lg:col-span-6">
              <div className="relative w-full overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-2 shadow-2xl backdrop-blur-xl">
                <Hero3DCanvas />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Universes with 3D Card Tilt */}
      <CategoryShowcase />

      {/* Interactive 3D Bespoke Shirt Customizer Section */}
      <BespokeShirtStudio />

      {/* Curated Outfits Collection Grid */}
      <HomeProductSection />

      {/* 3D Atelier Virtual Studio Section */}
      <Atelier3DShowcase />

      {/* Brand Heritage, Trust Markers, and VIP Newsletter */}
      <HomeEditorialAndTrust />
    </div>
  );
}
