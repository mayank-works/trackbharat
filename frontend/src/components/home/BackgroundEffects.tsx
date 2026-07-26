function BackgroundEffects() {
  return (
    <>
      {/* Base */}
      <div className="fixed inset-0 -z-50 bg-ink" />

      {/* Dot grid texture */}
      <div
        className="fixed inset-0 -z-40 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Diagonal signal-orange light beam sweeping across the page */}
      <div className="fixed inset-0 -z-30 overflow-hidden">
        <div
          className="absolute h-[160%] w-[260px]"
          style={{
            left: "-6%",
            top: "-25%",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(255,107,53,0.32) 45%, rgba(255,107,53,0.12) 62%, transparent 100%)",
            transform: "rotate(28deg)",
            filter: "blur(70px)",
          }}
        />
      </div>

      {/* Soft ambient glow, kept from before */}
      <div className="fixed left-1/2 top-24 -z-20 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-signal/10 blur-[220px]" />

      {/* Vignette so the beam/grid fade out at the very edges */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-ink/0 via-ink/0 to-ink/60" />
    </>
  );
}

export default BackgroundEffects;