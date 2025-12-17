import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Simple place search using OpenStreetMap Nominatim
// Note: Nominatim is free but rate-limited. For production consider Mapbox/Google with an API key
export default function PlaceSearch({ value = '', onSelect }) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Debounce requests
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
        query
      )}`;
      fetch(url, { signal: controllerRef.current.signal, headers: { 'Accept-Language': 'en' } })
        .then((r) => r.json())
        .then((data) => {
          setResults(data || []);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            // eslint-disable-next-line no-console
            console.error('Place search error', err);
          }
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      clearTimeout(debounceRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [query]);

  // Recompute dropdown position when results change or window resizes/scrolls
  useEffect(() => {
    const computePos = () => {
      const el = inputRef.current;
      if (!el) return setDropdownPos(null);
      const rect = el.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    };
    computePos();
    window.addEventListener('resize', computePos);
    window.addEventListener('scroll', computePos, true);
    return () => {
      window.removeEventListener('resize', computePos);
      window.removeEventListener('scroll', computePos, true);
    };
  }, [results]);

  // Close on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (
        inputRef.current &&
        (inputRef.current.contains(e.target) ||
          (dropdownRef.current && dropdownRef.current.contains(e.target)))
      ) {
        return;
      }
      setResults([]);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const handleSelect = (item) => {
    setQuery(item.display_name);
    setResults([]);
    if (onSelect) onSelect(item);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a place or address"
        className="input-field"
        autoComplete="off"
      />
      {loading && <div className="text-xs text-gray-500 mt-1">Searching...</div>}

      {results.length > 0 && dropdownPos
        ? createPortal(
            <ul
              ref={dropdownRef}
              style={{
                position: 'fixed',
                top: dropdownPos.top + 'px',
                left: dropdownPos.left + 'px',
                width: dropdownPos.width + 'px',
                zIndex: 9999,
                maxHeight: '220px',
                overflow: 'auto',
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
              }}
              className="text-sm"
            >
              {results.map((r) => (
                <li
                  key={`${r.place_id}-${r.osm_id}`}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(r)}
                >
                  <div className="font-medium">{r.display_name}</div>
                  <div className="text-xs text-gray-500">lat: {r.lat}, lon: {r.lon}</div>
                </li>
              ))}
            </ul>,
            document.body
          )
        : null}
    </div>
  );
}
