// src/components/Navbar.tsx
import { TrainIcon } from './ui/TrainIcon';

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-7">
      <div className="flex items-center gap-3">
        <TrainIcon size={32} className="text-orange-400" />
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-white">Track</span>
          <span className="text-orange-500">Bharat</span>
        </h1>
      </div>

      <div className="flex items-center gap-10 text-gray-300">
        <button className="transition hover:text-white">
          Live Map
        </button>

        <button className="transition hover:text-white">
          Stations
        </button>

        <button className="transition hover:text-white">
          Analytics
        </button>

        <button
          className="
            relative overflow-hidden rounded-2xl
            border border-white/20
            bg-white/10
            px-6 py-2
            text-white
            backdrop-blur-xl
            transition-all duration-300
            hover:bg-white/15
            hover:border-white/30
            hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
          "
        >
          <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          <span className="relative z-10">
            Login
          </span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;