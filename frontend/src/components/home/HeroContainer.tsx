import type { ReactNode } from "react";

type HeroContainerProps = {
  children: ReactNode;
};

function HeroContainer({ children }: HeroContainerProps) {
  return (
    // flex flex-col + gap gives a single source of vertical rhythm across
    // Hero, TrackingShowcase, and RailwayNetwork. Inner sections should
    // not stack their own mt-20 / mt-40 — the gap here is the rhythm.
    <section className="relative mx-auto w-[95%] max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
      {/* Glass highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      <div className="flex flex-col gap-16 py-10">
        {children}
      </div>
    </section>
  );
}

export default HeroContainer;