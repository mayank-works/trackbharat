// frontend/src/components/common/StationAutocomplete.tsx
import { useState, useEffect, useRef } from "react";
import { searchStations } from "../../api/backend";
import type { Station } from "../../api/backend";

interface Props {
  label: string;
  value: Station | null;
  onSelect: (station: Station) => void;
}

export default function StationAutocomplete({ label, value, onSelect }: Props) {
  const [input, setInput] = useState(value?.name ?? "");
  const [options, setOptions] = useState<Station[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const query = input.trim();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) {
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchStations(query);
        setOptions(Array.isArray(results) ? results : []);
        setOpen(true);
      } catch (err) {
        console.error("Station search failed", err);
        setOptions([]);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Derived rather than stored in state: avoids a synchronous setState in
  // the effect above just to clear results when the query gets too short.
  const visibleOptions = query.length < 2 ? [] : options;

  return (
    <div className="relative mb-4">
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-steam">
        {label}
      </label>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => visibleOptions.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Station name or code"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-steam/60 outline-none transition focus:border-signal/50 focus:bg-white/10"
      />
      {open && visibleOptions.length > 0 && (
        <ul className="absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#0e0f14]/95 backdrop-blur-xl shadow-2xl">
          {visibleOptions.map((s) => (
            <li
              key={s.code}
              onClick={() => {
                onSelect(s);
                setInput(`${s.name} (${s.code})`);
                setOpen(false);
              }}
              className="cursor-pointer px-4 py-2.5 text-white transition hover:bg-white/10"
            >
              {s.name}{" "}
              <span className="font-mono text-xs text-steam">({s.code})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}