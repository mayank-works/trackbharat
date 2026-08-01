import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SpecularButton from "./SpecularButton";

function SearchBar() {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/trains");
  };

  return (
    <div className="max-w-md">
      <div className="relative flex items-center overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <Search size={18} className="ml-4 text-gray-500" />

        <input
          type="text"
          placeholder="Search train..."
          className="min-w-0 flex-1 bg-transparent px-3 py-4 text-base font-medium text-white outline-none placeholder:text-sm placeholder:text-gray-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <SpecularButton
          size="sm"
          radius={999}
          tint="#ffffff"
          tintOpacity={0.1}
          blur={12}
          textColor="#ffffff"
          lineColor="#ffffff"
          baseColor="#3a3a3a"
          intensity={1.2}
          shineSize={15}
          shineFade={30}
          thickness={1.5}
          speed={0.35}
          followMouse={true}
          proximity={200}
          onClick={handleSearch}
          className="mr-2"
        >
          Search
        </SpecularButton>
      </div>
    </div>
  );
}

export default SearchBar;