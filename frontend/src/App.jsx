import { useState, useEffect } from "react";
import WeatherCard from "./components/WeatherCard";
import Highlights from "./components/Highlights";
import Forecast from "./components/Forecast";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [bgCond, setBgCond] = useState("sunny"); // controls background style

  const bgStyles = {
    sunny: "bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-400",
    cloudy: "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-700",
    rainy: "bg-gradient-to-r from-blue-500 via-blue-700 to-gray-900",
    night: "bg-gradient-to-r from-gray-900 via-indigo-900 to-black",
  };

  // fetch by city
  const fetchByCity = async (cityName) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
      const data = await res.json();
      setWeatherData(data);
      setLoading(false);
      updateBackground(data);
    } catch (err) {
      console.error("fetchByCity error:", err);
      setLoading(false);
    }
  };

  // fetch by coords
  const fetchByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setWeatherData(data);
      setLoading(false);
      updateBackground(data);
    } catch (err) {
      console.error("fetchByCoords error:", err);
      setLoading(false);
    }
  };

  // update background cond from data.condition
  const updateBackground = (data) => {
    const cond = (data?.condition || "").toLowerCase();
    if (cond.includes("rain") || cond.includes("shower") || cond.includes("thunder")) setBgCond("rainy");
    else if (cond.includes("cloud")) setBgCond("cloudy");
    else if (cond.includes("night")) setBgCond("night");
    else setBgCond("sunny");
  };

  // On load, attempt to get user location and fetch weather
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.warn("Location denied or error - falling back to default city (Delhi).", err);
          fetchByCity("Delhi");
        }
      );
    } else {
      // browser doesn't support geolocation
      fetchByCity("Delhi");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      fetchByCity(search.trim());
      setSearch("");
    }
  };

  return (
    <div className={`min-h-screen w-full text-white transition-all duration-700 ${bgStyles[bgCond] || bgStyles["sunny"]}`}>
      <div className="backdrop-blur-lg bg-black/30 min-h-screen flex flex-col items-center px-6 py-8">
        <header className="w-full max-w-5xl flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-wide">Weather App</h1>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search city..."
              className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <button type="submit" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">
              Search
            </button>
          </form>
        </header>

        <main className="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3">
            {loading ? (
              <div className="bg-white/10 p-6 rounded-2xl text-center">Loading...</div>
            ) : (
              <WeatherCard data={weatherData} />
            )}
          </div>

          <div className="lg:w-2/3 flex flex-col gap-6">
            <Highlights data={weatherData} />
            <Forecast data={weatherData} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
