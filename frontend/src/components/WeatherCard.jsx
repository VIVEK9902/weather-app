

function WeatherCard({ data }) {
  if (!data) {
    return (
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center text-gray-200">
        Allow location or search a city to see weather.
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{data.city}</h2>
          <p className="text-sm text-gray-200">{data.region ? `${data.region}, ${data.country}` : data.country}</p>
        </div>

        {data.icon && (
          <img src={data.icon} alt={data.condition} className="w-20 h-20" />
        )}
      </div>

      <p className="text-6xl font-extrabold my-3">{Math.round(data.temp_c)}°C</p>
      <p className="text-lg font-medium">{data.condition}</p>
    </div>
  );
}

export default WeatherCard;
