import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

// PageShell is the single glass container that wraps the entire
// homepage flow (Hero → Tracking → Network). The three sections live
// inside one rounded shell, separated by hairline dividers rather
// than their own rounded cards, so the page reads as one continuous
// experience instead of three stacked panels.
function PageShell({ children }: PageShellProps) {
  return (
    <section
      className="
        relative
        mx-auto
        mt-6
        w-[95%]
        max-w-7xl
        overflow-hidden
        rounded-[32px]
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-2xl
        shadow-2xl
      "
    >
      {/* Top glass highlight, matches the rest of the page language. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      {/* Ambient orange wash that bleeds across the whole shell — very
          low opacity so it reads as atmosphere, not a glow. Positioned
          slightly above center so the hero stays the brightest area. */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[18%]
          -z-0
          h-[60%]
          w-[70%]
          -translate-x-1/2
          rounded-full
          bg-orange-500/[0.05]
          blur-[120px]
        "
      />

      {/* Inner column. Vertical rhythm lives in the children's own
          py-* and the dividers between them — this shell just provides
          the boundary and the horizontal padding for the first/last
          child. */}
      <div className="relative z-10 flex flex-col">
        {children}
      </div>
    </section>
  );
}

export default PageShell;
