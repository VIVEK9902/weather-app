// src/pages/Trends.jsx
import React, { useEffect, useState } from "react";
import TrendChart from "../components/TrendChart";

export default function Trends({ city = "New Delhi", unit = "C" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [daily, setDaily] = useState([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/forecast?city=${encodeURIComponent(city)}&units=${unit === "C" ? "metric" : "imperial"}`);
        if (!res.ok) throw new Error("Forecast fetch failed");
        const json = await res.json();
        setDaily(json.daily || []);
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to fetch forecast");
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [city, unit]);

  // Map the next 7 days (skip 0 if you want today+6 or 1..7)
  const days = (daily || []).slice(0, 7);
  const categories = days.map((d) => {
    const dt = d.dt ? new Date(d.dt * 1000) : new Date();
    return dt.toLocaleDateString(undefined, { weekday: "short", day: "numeric" });
  });

  // Temperature series: use day temp (or avg of min,max)
  const tempSeries = [
    {
      name: `Temperature (°${unit})`,
      data: days.map((d) => {
        // handle different providers (OpenWeatherMap has d.temp.day)
        const t = d.temp && (d.temp.day ?? d.temp) ? (d.temp.day ?? d.temp) : null;
        return t != null ? Math.round(t) : null;
      }),
    },
  ];

  const humiditySeries = [
    {
      name: "Humidity (%)",
      data: days.map((d) => (d.humidity != null ? d.humidity : null)),
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4">
      <h2 className="text-2xl font-semibold">7-Day Trends</h2>

      {loading && <div className="p-4">Loading trends…</div>}
      {error && <div className="p-4 text-red-500">{error}</div>}

      {!loading && !error && days.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/6 p-4 rounded-xl">
            <h3 className="font-semibold mb-2">Temperature</h3>
            <TrendChart series={tempSeries} categories={categories} height={300} />
          </div>

          <div className="bg-white/6 p-4 rounded-xl">
            <h3 className="font-semibold mb-2">Humidity</h3>
            <TrendChart series={humiditySeries} categories={categories} height={300} />
          </div>
        </div>
      )}

      {!loading && !error && days.length === 0 && <div>No trend data available.</div>}
    </div>
  );
}
