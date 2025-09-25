

function Forecast({ data }) {
  if (!data || !Array.isArray(data.forecast)) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">3-Day Forecast</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data.forecast.map((d, idx) => (
          <div key={idx} className="bg-black/20 p-4 rounded-xl text-center">
            <p className="font-semibold">{d.date}</p>
            <img src={d.icon} alt={d.condition} className="w-12 h-12 mx-auto my-2" />
            <p className="text-2xl font-bold">{Math.round(d.avg_temp_c)}°C</p>
            <p className="text-sm">{d.condition}</p>
            <p className="text-xs mt-1">H: {Math.round(d.max_temp_c)}° / L: {Math.round(d.min_temp_c)}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
