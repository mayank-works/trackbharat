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

  console.log("[StationAutocomplete] render:", { input, open, optionsCount: options.length, options });

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (input.trim().length < 2) {
      setOptions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchStations(input);
        console.log("[StationAutocomplete] fetch resolved:", results);
        setOptions(Array.isArray(results) ? results : []);
        setOpen(true);
      } catch (err) {
        console.error("Station search failed", err);
        setOptions([]);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [input]);

  return (
    <div style={{ position: "relative", marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "4px" }}>{label}</label>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => options.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Station name or code"
        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
      />
      {open && options.length > 0 && (
        <ul
          style={{
            position: "absolute",
            zIndex: 10,
            background: "white",
            border: "1px solid #ccc",
            width: "100%",
            listStyle: "none",
            margin: 0,
            padding: 0,
            maxHeight: "220px",
            overflowY: "auto",
          }}
        >
          {options.map((s) => (
            <li
              key={s.code}
              onClick={() => {
                onSelect(s);
                setInput(`${s.name} (${s.code})`);
                setOpen(false);
              }}
              style={{ padding: "6px 10px", cursor: "pointer" }}
            >
              {s.name} <span style={{ color: "#888" }}>({s.code})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}