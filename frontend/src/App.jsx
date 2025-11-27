import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WeatherCard from "./components/WeatherCard";
import Highlights from "./components/Highlights";
import Forecast from "./components/Forecast";
import Loader from "./components/Loader";
import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel"; // NEW import
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import Trends from "./pages/Trends"; 

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // new: for typing only
  const [unit, setUnit] = useState("C");
  const [theme, setTheme] = useState("dark");
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]); // for future search suggestions
  
  // Sidebar state: starts open
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Right panel open state (starts open) - ADDED
  const [isRightOpen, setIsRightOpen] = useState(true);

  const dropdownRef = useRef(null);
  const DEFAULT_CITY = "New Delhi";

  // Load preferences on mount
  useEffect(() => {
    const savedUnit = localStorage.getItem("weather-unit");
    const savedTheme = localStorage.getItem("weather-theme");
    const savedCity = localStorage.getItem("weather-city");

    if (savedUnit) setUnit(savedUnit);
    if (savedTheme) setTheme(savedTheme);
    fetchWeather(savedCity || DEFAULT_CITY); // always fetch weather for city or default
  }, []);

  // Persist preferences
  useEffect(() => localStorage.setItem("weather-unit", unit), [unit]);
  useEffect(() => {
    localStorage.setItem("weather-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Toggle Right Panel - ADDED
  const toggleRightPanel = () => setIsRightOpen((p) => !p);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Map condition to general category
  const mapCondition = (text) => {
    if (!text) return "Sunny";
    const t = text.toLowerCase();
    if (t.includes("sun") || t.includes("clear")) return "Sunny";
    if (t.includes("cloud")) return "Cloudy";
    if (t.includes("rain") || t.includes("drizzle") || t.includes("thunder")) return "Rain";
    if (t.includes("snow") || t.includes("sleet")) return "Snow";
    if (t.includes("night")) return "Night";
    return "Sunny";
  };

  // Background gradients
  const bgStyles = {
    Sunny: theme === "dark"
      ? "bg-gradient-to-r from-yellow-500 via-orange-400 to-pink-500"
      : "bg-gradient-to-r from-yellow-200 via-orange-100 to-pink-200",
    Cloudy: theme === "dark"
      ? "bg-gradient-to-r from-gray-500 via-gray-600 to-gray-800"
      : "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400",
    Rain: theme === "dark"
      ? "bg-gradient-to-r from-blue-600 via-blue-800 to-gray-900"
      : "bg-gradient-to-r from-blue-200 via-blue-300 to-gray-400",
    Snow: theme === "dark"
      ? "bg-gradient-to-r from-gray-600 via-white/30 to-gray-800"
      : "bg-gradient-to-r from-blue-100 via-white/70 to-blue-200",
    Night: theme === "dark"
      ? "bg-gradient-to-r from-gray-900 via-indigo-900 to-black"
      : "bg-gradient-to-r from-indigo-100 via-blue-100 to-gray-200",
  };
  const conditionCategory = mapCondition(weather?.current?.condition?.text);
  const bgClass = bgStyles[conditionCategory] || bgStyles.Sunny;

  // Fetch weather from backend with unit support
  const fetchWeather = async (cityOrCoords, isFallback = false) => {
    if (!cityOrCoords) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`http://localhost:9090/api/weather?city=${cityOrCoords}&unit=${unit}`);
      if (!res.ok) {
        throw new Error(res.status === 404 ? "City not found. Try again." : "Weather service unavailable.");
      }
      const data = await res.json();
      setWeather(data);
      setCity(cityOrCoords);
      localStorage.setItem("weather-city", cityOrCoords);
    } catch (err) {
      console.error("Error fetching weather:", err);
      if (!isFallback) {
        setError(err.message || "Unable to fetch weather. Try again.");
        fetchWeather(DEFAULT_CITY, true);
      } else {
        setError("Unable to fetch even fallback weather data.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update weather when unit changes
  useEffect(() => {
    if (weather) fetchWeather(weather.city);
  }, [unit]);

  // Get current location weather
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        fetchWeather(`${lat},${lon}`);
      },
      () => {
        setError("Location denied. Showing default weather.");
        fetchWeather(DEFAULT_CITY);
      }
    );
  }, []);

  // --- Updated Search Handlers ---
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      fetchWeather(searchQuery.trim());
      setCity(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim() !== "") {
      fetchWeather(searchQuery.trim());
      setCity(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const handleReset = () => {
    setTheme("dark");
    setUnit("C");
    localStorage.removeItem("weather-unit");
    localStorage.removeItem("weather-theme");
    setShowDropdown(false);
  };


  return (
    <div
      className={`min-h-screen w-full transition-all duration-700 ease-in-out ${
        theme === "dark" ? "text-white" : "text-gray-900"
      } ${bgClass}`}
    >
      <div
        className={`backdrop-blur-lg ${
          theme === "dark" ? "bg-black/30" : "bg-white/40"
        } min-h-screen flex transition-all duration-300 ease-in-out`}
      >
        <Sidebar theme={theme} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Right info panel */}
        <RightPanel
          theme={theme}
          currentCity={city}
          onSelectCity={fetchWeather}
          weather={weather}
          unit={unit}
          isOpen={isRightOpen}
          toggleOpen={toggleRightPanel}
        />

        {/* Main content area: shifts based on sidebar state and avoids covering by right panel */}
        <main
          id="main-scroll"
          className="flex-1 flex flex-col items-center px-6 py-8 overflow-y-auto transition-all duration-300 ease-in-out"
          style={{
            marginLeft: isSidebarOpen ? "256px" : "0px",
            marginRight: isRightOpen ? "300px" : "0px",
            height: "100vh",
          }}
        >
          {/* Header */}
          <header className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0 relative">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-wide drop-shadow-lg">Weather App</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto relative" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Search city..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className={`px-4 py-2 rounded-lg ${
                theme === "dark"
                  ? "bg-white/20 text-white placeholder-gray-300"
                  : "bg-gray-100 text-gray-900 placeholder-gray-500"
              } outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300 w-full sm:w-auto`}
            />

            <button
              onClick={handleSearchClick}
              className={`px-3 py-2 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                  : "bg-yellow-300 hover:bg-yellow-400 text-gray-900"
              }`}
            >
              Search
            </button>

            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`px-3 py-2 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "bg-gray-300 text-gray-800 hover:bg-gray-400"
              }`}
            >
              <Cog6ToothIcon className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 top-12 mt-1 z-50 p-4 rounded-xl shadow-lg border ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } w-48`}
                >
                  <p className="text-sm font-semibold mb-2">Settings</p>
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-full text-left px-2 py-1.5 rounded-md hover:bg-gray-600/20 transition-colors"
                  >
                    Theme:{" "}
                    <span className="font-semibold">
                      {theme === "dark" ? "Dark" : "Light"}
                    </span>
                  </button>
                  <button
                    onClick={() => setUnit(unit === "C" ? "F" : "C")}
                    className="w-full text-left px-2 py-1.5 rounded-md hover:bg-gray-600/20 transition-colors"
                  >
                    Unit: <span className="font-semibold">°{unit}</span>
                  </button>
                  <hr
                    className={`my-2 ${
                      theme === "dark" ? "border-gray-700" : "border-gray-300"
                    }`}
                  />
                  <button
                    onClick={handleReset}
                    className="w-full text-left px-2 py-1.5 text-sm text-red-500 hover:bg-red-500/10 rounded-md"
                  >
                    Reset to Default
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

          {/* Scrollable Sections */}
          <div className="w-full space-y-16 pb-16">
          {/* Current Section */} 
          <section id="current" className="scroll-mt-8 min-h-screen flex flex-col items-center justify-start">
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4 w-full max-w-5xl text-center animate-pulse shadow-lg"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loader */}
            {loading && <Loader />}

            {/* Main Weather Content */}
            <AnimatePresence>
              {!loading && weather && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6 }}
                  className="w-full max-w-5xl flex flex-col lg:flex-row gap-6"
                >
                  <div className="lg:w-1/3 flex justify-center">
                    <WeatherCard data={weather} unit={unit} theme={theme} />
                  </div>
                  <div className="lg:w-2/3 flex flex-col gap-6">
                    <Highlights data={weather} unit={unit} theme={theme} />
                    <Forecast data={weather} unit={unit} theme={theme} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Trends Section */}
          <section id="trends" className="scroll-mt-8 min-h-screen flex flex-col items-center justify-center">
            <Trends city={city || "New Delhi"} unit={unit} />
          </section>

          {/* Monthly Section */}
          <section id="monthly" className="scroll-mt-8 min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-5xl">
              <h2 className="text-3xl font-bold mb-6">Monthly Forecast</h2>
              <p className="text-lg">This is the Monthly section.</p>
            </div>
          </section>

          {/* Map Section */}
          <section id="map" className="scroll-mt-8 min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-5xl">
              <h2 className="text-3xl font-bold mb-6">Map View</h2>
              <p className="text-lg">This is the Map section.</p>
            </div>
          </section>

          {/* Hourly Section */}
          <section id="hourly" className="scroll-mt-8 min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-5xl">
              <h2 className="text-3xl font-bold mb-6">Hourly Forecast</h2>
              <p className="text-lg">This is the Hourly Forecast section.</p>
            </div>
          </section>

          {/* Details Section */}
          <section id="details" className="scroll-mt-8 min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-5xl">
              <h2 className="text-3xl font-bold mb-6">Weather Details</h2>
              <p className="text-lg">This is the Details section.</p>
            </div>
          </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
