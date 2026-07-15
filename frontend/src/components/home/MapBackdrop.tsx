function MapBackdrop() {
  return (
    <div
      className="
        absolute
        inset-0
        opacity-10
        pointer-events-none
      "
    >
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[700px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-white/10
        "
      />
    </div>
  );
}

export default MapBackdrop;