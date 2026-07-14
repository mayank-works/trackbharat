import type { ReactNode } from "react";

type HeroContainerProps = {
  children: ReactNode;
};

function HeroContainer({ children }: HeroContainerProps) {
  return (
    <section className="relative mx-auto mt-8 w-[95%] max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
      {/* Glass highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      {children}
    </section>
  );
}

export default HeroContainer;