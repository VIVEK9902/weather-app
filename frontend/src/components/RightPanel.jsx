// src/components/RightPanel.jsx
import React, { useEffect, useState } from "react";
import { FiClock, FiStar, FiTrash2, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
/**
 * Minimal RightPanel
 * Props:
 *  - theme: "dark" | "light"
 *  - currentCity: string
 *  - onSelectCity: function(city)
 *  - isOpen: boolean
 *  - toggleOpen: function
 *
 * Only: clock, favorites (persisted), add (star), remove, collapse.
 */
export default function RightPanel({
  theme = "dark",
  currentCity = "",
  onSelectCity = () => {},
  isOpen = true,
  toggleOpen = () => {},
}) {
  const STORAGE_KEY = "weather-favorites";
  const PANEL_WIDTH = 300; // px
  const [now, setNow] = useState(new Date());
  const [favorites, setFavorites] = useState([]);

  // load favorites on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to read favorites:", e);
    }
  }, []);

  // clock tick
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const saveFavorites = (list) => {
    setFavorites(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to write favorites:", e);
    }
  };

  const addFavorite = () => {
    if (!currentCity || !currentCity.trim()) return;
    const city = currentCity.trim();
    if (favorites.includes(city)) return;
    const next = [city, ...favorites].slice(0, 12);
    saveFavorites(next);
  };

  const removeFavorite = (city) => {
    const next = favorites.filter((c) => c !== city);
    saveFavorites(next);
  };

  const handleClickFav = (city) => {
    if (typeof onSelectCity === "function") onSelectCity(city);
    const main = document.getElementById("main-scroll");
    if (main) main.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const panelStyle = {
    width: `${PANEL_WIDTH}px`,
    right: isOpen ? 0 : `-${PANEL_WIDTH}px`,
    top: 0,
    height: "100vh",
    position: "fixed",
    zIndex: 40,
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "right 0.28s ease-in-out",
    background: theme === "dark" ? "rgba(18,18,18,0.08)" : "rgba(255,255,255,0.06)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderLeft: theme === "dark" ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
  };

  const smallBtn = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "6px 8px",
    borderRadius: "8px",
  };

  return (
    <aside style={panelStyle} aria-label="Right info panel">
      {/* Top row: clock + collapse toggle + add favorite (star) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiClock className="w-5 h-5 text-white/90" />
          <div>
            <div className="text-sm text-white/90">Local time</div>
            <div className="text-lg font-semibold text-white/100">
              {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: undefined })}
            </div>
            <div className="text-xs text-white/70">{now.toLocaleDateString()}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* ADD FAVORITE uses star icon now */}
          <button
            title="Add current city to favorites"
            onClick={addFavorite}
            className="flex items-center gap-2"
            style={smallBtn}
          >
            {favorites.includes(currentCity.trim()) ? (
                <AiFillStar className="w-4 h-4 text-yellow-400" />
            ) : (
                <FiStar className="w-4 h-4 text-white/90" />
            )}
          </button>

          {/* collapse toggle */}
          <button
            onClick={toggleOpen}
            title={isOpen ? "Collapse panel" : "Open panel"}
            className="p-2 rounded-md"
            style={{ ...smallBtn, padding: "6px" }}
          >
            {isOpen ? <FiChevronRight className="w-4 h-4 text-white/90" /> : <FiChevronLeft className="w-4 h-4 text-white/90" />}
          </button>
        </div>
      </div>

      {/* Favorites */}
      <div className="mt-4 flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-white/80 flex items-center gap-2">
            <FiStar /> Favorites
          </div>
          <button
            title="Clear favorites"
            onClick={() => saveFavorites([])}
            className="text-xs text-white/70 px-2 py-1 rounded-md hover:bg-white/6 transition-colors"
            style={{ background: "transparent" }}
          >
            Clear
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="text-sm text-white/70">No favorites yet. Add the current city using the star button.</div>
        ) : (
          <ul className="flex flex-col gap-2">
            {favorites.map((c) => (
              <li key={c} className="flex items-center justify-between gap-2">
                <button
                  onClick={() => handleClickFav(c)}
                  className="flex-1 text-left px-3 py-2 rounded-md hover:bg-white/6 transition-colors text-white/90"
                >
                  {c}
                </button>
                <button
                  onClick={() => removeFavorite(c)}
                  title="Remove"
                  className="ml-2 p-2 rounded-md hover:bg-white/6 transition-colors"
                  style={{ background: "transparent" }}
                >
                  <FiTrash2 className="w-4 h-4 text-white/80" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-xs text-white/60">Tips: use favorites to quickly switch locations.</div>
    </aside>
  );
}
