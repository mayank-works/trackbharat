function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-7">
      <h1 className="text-3xl font-bold tracking-tight">
        <span className="text-white">Track</span>
        <span className="text-orange-500">Bharat</span>
      </h1>

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

        <button className="rounded-xl border border-orange-500/40 bg-orange-500/10 px-5 py-2 text-orange-400 transition hover:bg-orange-500 hover:text-white">
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;