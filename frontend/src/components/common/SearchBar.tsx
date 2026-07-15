import { Search } from "lucide-react";
function SearchBar() {
  return (
    <div className="mx-auto mt-12 max-w-5xl">
      <div
        className="
          relative
          flex
          items-center
          overflow-hidden
          rounded-full
          border
          border-white/10
          bg-white/5
          backdrop-blur-3xl
          shadow-[0_10px_40px_rgba(0,0,0,0.35)]
        "
      >
        {/* top reflection */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/40
            to-transparent
          "
        />
        <Search
        size={22}
        className="ml-5 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search train..."
          className="
            min-w-0
            flex-1
            bg-transparent
            px-4
            py-6
            text-xl
            font-medium
            text-white
            outline-none
            placeholder:text-sm
            placeholder:text-gray-500
          "
        />

        <button
          className="
            mr-2
            rounded-full
            border
            border-white/15
            bg-white/10
            px-6
            py-3
            text-white
            backdrop-blur-xl
            transition-all
            duration-300
            hover:bg-white/15
            hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
          "
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;