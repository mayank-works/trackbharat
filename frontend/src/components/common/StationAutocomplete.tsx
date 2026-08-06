// frontend/src/components/common/StationAutocomplete.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { searchStations } from "../../api/backend";
import type { Station } from "../../api/backend";

interface Props {
  label: string;
  value: Station | null;
  onSelect: (station: Station) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function StationAutocomplete({ label, value, onSelect, onOpenChange }: Props) {
  const [input, setInput] = useState(value?.name ?? "");
  const [options, setOptions] = useState<Station[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const query = input.trim();

  // Notify parent when dropdown opens/closes
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  // Update input when value changes externally
  useEffect(() => {
    if (value) {
      setInput(`${value.name} (${value.code})`);
    }
  }, [value]);

  // Search stations with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // DON'T search if the input has parentheses (selected station format)
    // Example: "HOWRAH JUNCTION (HWH)" - this is a selected station, don't search
    if (query.includes('(') && query.includes(')')) {
      setOptions([]);
      setIsOpen(false);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    if (query.length < 2) {
      setOptions([]);
      setIsOpen(false);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(false);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchStations(query);
        console.log("Results from search:", results);
        
        if (results && results.length > 0) {
          setOptions(results);
          setHasSearched(true);
          setIsOpen(true);
        } else {
          setOptions([]);
          setHasSearched(true);
          setIsOpen(true);
        }
        setSelectedIndex(-1);
      } catch (err) {
        console.error("Station search failed", err);
        setOptions([]);
        setHasSearched(true);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || options.length === 0) {
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < options.length) {
          handleSelect(options[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, options, selectedIndex]);

  const handleSelect = (station: Station) => {
    onSelect(station);
    setInput(`${station.name} (${station.code})`);
    setIsOpen(false);
    setSelectedIndex(-1);
    setOptions([]);
    setHasSearched(false);
    onOpenChange?.(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    if (newValue.trim() === "" && value) {
      onSelect(null as any);
    }
  };

  const handleInputFocus = () => {
    if (options.length > 0) {
      setIsOpen(true);
    }
  };

  // Check if input is a selected station format (has parentheses)
  const isSelectedFormat = query.includes('(') && query.includes(')');

  // Get position for portal
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width
      });
    }
  }, [isOpen]);

  // Render dropdown with portal
  const renderDropdown = () => {
    // Don't render dropdown if:
    // 1. Not open
    // 2. Input is a selected station format (has parentheses)
    if (!isOpen || isSelectedFormat) return null;

    return createPortal(
      <div
        className="fixed z-[9999]"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {isLoading ? (
          <div className="rounded-lg border border-white/10 bg-black/90 backdrop-blur-lg px-3 py-2.5 shadow-2xl shadow-black/50">
            <p className="text-sm text-white/50">Searching...</p>
          </div>
        ) : !hasSearched ? (
          <div className="rounded-lg border border-white/10 bg-black/90 backdrop-blur-lg px-3 py-2.5 shadow-2xl shadow-black/50">
            <p className="text-sm text-white/30">Type to search...</p>
          </div>
        ) : options.length > 0 ? (
          <ul 
            className="max-h-48 overflow-y-auto rounded-lg border border-white/10 bg-black/90 backdrop-blur-lg shadow-2xl shadow-black/50"
          >
            <div className="sticky top-0 border-b border-white/5 bg-black/80 px-3 py-1.5">
              <span className="text-[10px] text-white/40">
                {options.length} station{options.length > 1 ? "s" : ""} found
              </span>
            </div>
            {options.map((station, index) => (
              <li
                key={station.code}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleSelect(station)}
                className={`cursor-pointer px-3 py-2 transition-all ${
                  index === selectedIndex
                    ? "bg-white/10"
                    : "hover:bg-white/5"
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="text-sm font-medium text-white">{station.name}</div>
                <div className="font-mono text-[10px] text-white/40">{station.code}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div 
            className="rounded-lg border border-white/10 bg-black/90 backdrop-blur-lg px-3 py-2.5 shadow-2xl shadow-black/50"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <p className="text-sm text-white/50">No stations found</p>
            <p className="text-[10px] text-white/30 mt-0.5">Try a different search term</p>
          </div>
        )}
      </div>,
      document.body
    );
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-steam">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Type station name or code..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:border-white/30 backdrop-blur-sm"
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
          </div>
        )}
        {query.length > 0 && query.length < 2 && !isLoading && !isSelectedFormat && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <span className="text-xs text-white/40">Type 2+ chars</span>
          </div>
        )}
        {value && input && !isOpen && !isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <button
              onClick={() => {
                setInput("");
                onSelect(null as any);
                inputRef.current?.focus();
              }}
              className="text-white/30 hover:text-white/60 transition-colors"
              type="button"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {renderDropdown()}
    </div>
  );
}