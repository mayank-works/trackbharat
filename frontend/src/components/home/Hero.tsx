import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SearchBar from "../common/SearchBar";
import SignalDot from "../common/ui/SignalDot";

function Hero() {
  return (
    <section className="px-10 py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        {/* Left: headline */}
        <div className="text-left">
          <Link
            to="/trains"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-steam transition hover:border-signal/40 hover:text-white"
          >
            <span className="rounded-full bg-signal px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-black">
              Live
            </span>
            Track any train right now
            <ArrowRight size={12} />
          </Link>

          <h1 className="font-display mb-6 text-6xl font-bold leading-[1.05] tracking-tight text-white">
            Track Every Train
            <br />
            In Real Time
          </h1>

          <p className="mb-10 max-w-md text-lg leading-relaxed text-steam">
            Track trains across India with real-time location updates,
            predictive ETAs, and an interactive railway network experience.
          </p>

          <SearchBar />
        </div>

        {/* Right: live status "chrome" panel */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-white/15" />
              <span className="h-3 w-3 rounded-full bg-white/15" />
              <span className="h-3 w-3 rounded-full bg-white/15" />
            </div>
            <span className="font-mono text-xs text-steam">
              Rajdhani Express ⌄
            </span>
          </div>

          <div className="p-7 font-mono">
            <div className="flex items-center justify-between text-sm text-steam">
              <span>NDLS</span>
              <span className="text-white/20">──────</span>
              <span>HWH</span>
            </div>

            <div className="mt-5">
              <SignalDot state="clear" label="On time" />
            </div>

            <div className="mt-8 flex gap-10">
              <div>
                <div className="text-xs uppercase tracking-wider text-steam">ETA</div>
                <div className="mt-1 text-3xl font-bold text-signal">1h 12m</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-steam">Speed</div>
                <div className="mt-1 text-3xl font-bold text-white">92 km/h</div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 text-xs">
              <div>
                <div className="text-steam">Current Station</div>
                <div className="mt-0.5 text-white">Asansol Junction</div>
              </div>
              <div>
                <div className="text-steam">Next Station</div>
                <div className="mt-0.5 text-white">Durgapur</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;