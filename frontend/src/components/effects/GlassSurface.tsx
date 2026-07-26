import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface GlassSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  blur?: number;
  opacity?: number;
  borderRadius?: number;
  glow?: boolean;
}

function GlassSurface({
  children,
  className,
  blur = 36,
  opacity = 0.04,
  borderRadius = 9999,
  glow = true,
  style,
  ...props
}: GlassSurfaceProps) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden transition-all duration-500 hover:-translate-y-0.5 hover:scale-[1.005]",
        className
      )}
      style={{
        borderRadius,
        ...style,
      }}
      {...props}
    >
      {/* Ambient Orange Glow */}
      {glow && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(255,106,0,0.08), transparent 60%)",
          }}
        />
      )}

      {/* Frosted Glass */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: `blur(${blur}px) saturate(180%)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
          background: `
            linear-gradient(
              180deg,
              rgba(255,255,255,${opacity + 0.03}),
              rgba(255,255,255,${opacity})
            )
          `,
        }}
      />

      {/* Glass Border */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius,
          padding: 1,
          background: `
            linear-gradient(
              145deg,
              rgba(255,255,255,.40),
              rgba(255,255,255,.08)
            )
          `,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Top Highlight */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.18), transparent 30%)",
        }}
      />

      {/* Moving Shine */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,.18), transparent 35%, transparent 70%, rgba(255,255,255,.08))",
        }}
      />

      {/* Noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.25) 0.5px, transparent 0.5px)",
          backgroundSize: "8px 8px",
        }}
      />

      {/* Inner Shadow */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius,
          boxShadow: `
            0 12px 40px rgba(0,0,0,.35),
            0 0 0 1px rgba(255,255,255,.08),
            inset 0 1px rgba(255,255,255,.22),
            inset 0 -1px rgba(255,255,255,.04)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}

export default GlassSurface;