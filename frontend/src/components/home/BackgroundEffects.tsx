// BackgroundEffects.tsx
//
// Ambient glow that sits behind the entire home page. The brief calls for
// "subtle orange railway accents" and explicitly says to "avoid excessive
// glow", so both blobs are kept small and low-opacity. The orange blob is
// positioned to sit behind the hero rather than across the whole page.

function BackgroundEffects() {
  return (
    <>
      {/* Base canvas. */}
      <div className="fixed inset-0 -z-50 bg-neutral-950" />

      {/* Orange ambient glow, sized to sit behind the hero only. */}
      <div className="fixed left-1/2 top-[140px] -z-40 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[140px]" />

      {/* Cool accent in the top-right corner, very low opacity. */}
      <div className="fixed -right-24 -top-24 -z-40 h-[320px] w-[320px] rounded-full bg-sky-500/[0.04] blur-[120px]" />
    </>
  );
}

export default BackgroundEffects;
