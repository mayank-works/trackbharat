import GlassSurface from "../effects/GlassSurface";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="fixed left-0 right-0 top-6 z-50 flex justify-center">
      <GlassSurface
        width="92%"
        height={72}
        borderRadius={999}
        backgroundOpacity={0.08}
        brightness={42}
        blur={10}
        opacity={0.95}
        displace={0.15}
        distortionScale={-140}
        className="max-w-7xl"
      >
        <div className="flex w-full items-center justify-between px-8">

          {/* Logo */}

          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-text-950"
          >
            Track<span className="text-primary-500">Bharat</span>
          </Link>

          {/* Navigation */}

          <nav className="hidden gap-10 md:flex">

            <Link to="/" className="text-text-700 transition hover:text-primary-500">
              Home
            </Link>

            <Link to="/live" className="text-text-700 transition hover:text-primary-500">
              Live
            </Link>

            <Link to="/routes" className="text-text-700 transition hover:text-primary-500">
              Routes
            </Link>

            <Link to="/about" className="text-text-700 transition hover:text-primary-500">
              About
            </Link>

          </nav>

          {/* CTA */}

          <button
            className="
              rounded-full
              bg-primary-500
              px-6
              py-2.5
              font-medium
              text-white
              transition
              hover:bg-primary-400
            "
          >
            Track Now
          </button>

        </div>
      </GlassSurface>
    </div>
  );
}

export default Navbar;