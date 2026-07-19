// A small glowing dot that mirrors real railway signal-light color
// semantics: green = clear/on time, amber = caution/boarding, red = stop/delayed.
// Reused everywhere a train's status is shown so color always means the
// same thing across the app, instead of every component inventing its own.

export type SignalState = "clear" | "caution" | "stop";

interface SignalDotProps {
  state: SignalState;
  label?: string;
  className?: string;
}

const STATE_STYLES: Record<SignalState, { color: string; glow: string }> = {
  clear: { color: "bg-[#2fb673]", glow: "shadow-[0_0_10px_2px_rgba(47,182,115,0.65)]" },
  caution: { color: "bg-[#ff6b35]", glow: "shadow-[0_0_10px_2px_rgba(255,107,53,0.65)]" },
  stop: { color: "bg-[#e5484d]", glow: "shadow-[0_0_10px_2px_rgba(229,72,77,0.65)]" },
};

export default function SignalDot({ state, label, className = "" }: SignalDotProps) {
  const styles = STATE_STYLES[state];
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${styles.color} ${styles.glow} ${
          state !== "stop" ? "animate-pulse" : ""
        }`}
        aria-hidden="true"
      />
      {label && (
        <span className="font-mono text-xs uppercase tracking-wider text-steam">
          {label}
        </span>
      )}
    </span>
  );
}