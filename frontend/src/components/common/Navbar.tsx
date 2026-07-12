function Navbar() {
  return (
    <nav className="w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold">
          <span className="text-white">Track</span>
          <span className="text-orange-500">Bharat</span>
        </h1>

        <div className="flex items-center gap-8 text-sm text-gray-300">
          <button>Live Map</button>
          <button>Stations</button>
          <button>Analytics</button>
          <button>Login</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;