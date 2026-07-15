type GlassButtonProps = {
  text: string;
};

function GlassButton({ text }: GlassButtonProps) {
  return (
    <button
      className="
        group
        relative
        overflow-hidden
        rounded-full
        border border-white/15
        bg-white/10
        px-6
        py-3
        text-white
        backdrop-blur-xl
        transition-all
        duration-300
        hover:scale-[0.98]
        hover:bg-white/15
      "
    >
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-white/30
          to-transparent
          opacity-60
        "
      />

      <span className="relative z-10 font-medium tracking-tight">
        {text}
      </span>
    </button>
  );
}

export default GlassButton;