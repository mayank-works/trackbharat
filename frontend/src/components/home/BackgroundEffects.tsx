// BackgroundEffects.tsx
//
// Ambient glow that sits behind the entire home page. The brief calls for
// "subtle orange railway accents" and explicitly says to "avoid excessive
// glow", so both blobs are kept small and low-opacity. The orange blob
// sits behind the hero / upper half of the page; the cool blob is in
// the top-right corner. Both are pinned to the viewport so the
// background reads the same on long pages and short ones.

function BackgroundEffects() {
  return (
    <>
      {/* Base canvas. */}
      <div className="fixed inset-0 -z-50 bg-neutral-950" />

      {/* Subtle radial wash across the whole page — gives the dark
          background just enough depth to read as "atmospheric"
          instead of "flat black". */}
      <div
        className="fixed inset-0 -z-40 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(255,107,53,0.06), transparent 60%)",
        }}
      />

      {/* Orange ambient glow, sized to sit behind the hero only. */}
      <div className="fixed left-1/2 top-[120px] -z-30 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[160px]" />

      {/* Cool accent in the top-right corner, very low opacity. */}
      <div className="fixed -right-24 -top-24 -z-30 h-[320px] w-[320px] rounded-full bg-sky-500/[0.04] blur-[120px]" />
    </>
  );
}

export default BackgroundEffects;
