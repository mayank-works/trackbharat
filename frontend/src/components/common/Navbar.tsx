import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="fixed left-0 right-0 top-6 z-50 flex justify-center">
      <div className="flex w-[92%] max-w-7xl items-center justify-between rounded-[999px] border border-white/10 bg-white/5 px-8 py-3 backdrop-blur-xl shadow-lg">
        <Link to="/" className="text-2xl font-bold tracking-tight text-white">
          Track<span className="text-white/60">Bharat</span>
        </Link>

        <nav className="hidden gap-10 md:flex">
          <Link to="/" className="text-gray-400 transition hover:text-white">
            Home
          </Link>
          <Link to="/live" className="text-gray-400 transition hover:text-white">
            Live
          </Link>
          <Link to="/routes" className="text-gray-400 transition hover:text-white">
            Routes
          </Link>
          <Link to="/about" className="text-gray-400 transition hover:text-white">
            About
          </Link>
        </nav>

        <button className="rounded-full border border-white/20 bg-white/10 px-6 py-2.5 font-medium text-white transition hover:bg-white/20">
          Track Now
        </button>
      </div>
    </div>
  );
}

export default Navbar;