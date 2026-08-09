// frontend/src/components/common/Navbar.tsx
import { Link } from 'react-router-dom';
import { TrainIcon } from './ui/TrainIcon';

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 flex-shrink-0">
      <Link to="/" className="flex items-center gap-3">
        <TrainIcon size={28} className="text-signal" />
        <h1 className="font-display text-2xl font-bold tracking-tight">
          <span className="text-white">Track</span>
          <span className="text-signal">Bharat</span>
        </h1>
      </Link>

      <div className="flex items-center gap-8 text-gray-300">
        <Link to="/" className="transition hover:text-white text-sm">
          Home
        </Link>

        <Link to="/trains" className="transition hover:text-white text-sm">
          Live Map
        </Link>

        <Link to="/trains" className="transition hover:text-white text-sm">
          Routes
        </Link>

        <Link to="/about" className="transition hover:text-white text-sm">
          About
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;