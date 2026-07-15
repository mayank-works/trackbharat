import type { ReactNode } from "react";

type GlassPanelProps = {
  children: ReactNode;
};

function GlassPanel({ children }: GlassPanelProps) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border border-white/10
        bg-white/5
        backdrop-blur-3xl
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
      "
    >
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/40
          to-transparent
        "
      />

      {children}
    </div>
  );
}

export default GlassPanel;