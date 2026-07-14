function BackgroundEffects() {
  return (
    <>
      {/* Main Background */}
      <div className="fixed inset-0 -z-50 bg-neutral-950" />

      {/* Orange Ambient Glow */}
      <div className="fixed left-1/2 top-24 -z-40 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-[220px]" />

      {/* Blue Ambient Glow */}
      <div className="fixed right-0 top-0 -z-40 h-[450px] w-[450px] rounded-full bg-sky-500/10 blur-[200px]" />
    </>
  );
}

export default BackgroundEffects;