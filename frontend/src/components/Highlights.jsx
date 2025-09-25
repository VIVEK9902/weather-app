

function Highlights({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Today's Highlights</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-black/20 rounded-xl">
          <h3 className="text-sm text-gray-200">Feels Like</h3>
          <p className="text-2xl font-bold">{Math.round(data.feelslike_c)}°C</p>
        </div>

        <div className="p-4 bg-black/20 rounded-xl">
          <h3 className="text-sm text-gray-200">Humidity</h3>
          <p className="text-2xl font-bold">{data.humidity}%</p>
        </div>

        <div className="p-4 bg-black/20 rounded-xl">
          <h3 className="text-sm text-gray-200">Pressure</h3>
          <p className="text-2xl font-bold">{data.pressure_mb} hPa</p>
        </div>

        <div className="p-4 bg-black/20 rounded-xl">
          <h3 className="text-sm text-gray-200">Wind</h3>
          <p className="text-2xl font-bold">{data.wind_kph} km/h</p>
          <p className="text-xs mt-1">{data.wind_dir}</p>
        </div>

        <div className="p-4 bg-black/20 rounded-xl">
          <h3 className="text-sm text-gray-200">Visibility</h3>
          <p className="text-2xl font-bold">{data.vis_km} km</p>
        </div>

        <div className="p-4 bg-black/20 rounded-xl">
          <h3 className="text-sm text-gray-200">UV Index</h3>
          <p className="text-2xl font-bold">{data.uv}</p>
        </div>
      </div>
    </div>
  );
}

export default Highlights;
