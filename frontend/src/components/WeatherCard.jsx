import { motion } from "framer-motion";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

function WeatherCard({ data, unit = "C", theme = "dark" }) {
  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${theme === "dark" ? "bg-white/10 text-gray-200" : "bg-gray-100 text-gray-800"} backdrop-blur-md p-6 rounded-2xl shadow-lg text-center max-w-sm mx-auto animate-pulse`}
      >
        Loading weather...
      </motion.div>
    );
  }

  const city = data.city || "Unknown City";
  const region = data.region || "";
  const country = data.country || "Unknown Country";
  const icon = data.icon || null;
  const condition = data.condition || "N/A";

  // Safely handle temperatures
  const temp =
    unit === "C"
      ? data.temp_c !== undefined
        ? Math.round(data.temp_c)
        : "--"
      : data.temp_f !== undefined
      ? Math.round(data.temp_f)
      : "--";

  const feelsLike =
    unit === "C"
      ? data.feelslike_c !== undefined
        ? Math.round(data.feelslike_c)
        : "--"
      : data.feelslike_f !== undefined
      ? Math.round(data.feelslike_f)
      : "--";

  const wind = data.wind_kph !== undefined ? Math.round(data.wind_kph) : "--";

  const cardBg = theme === "dark" ? "bg-white/20 text-gray-100" : "bg-gray-200 text-gray-900";
  const subText = theme === "dark" ? "text-gray-300" : "text-gray-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.5 }}
      className={`${cardBg} backdrop-blur-md p-6 rounded-2xl shadow-xl text-center max-w-sm mx-auto hover:shadow-2xl transition-shadow duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">{city}</h2>
          <p className={`text-sm sm:text-base ${subText}`}>
            {region ? `${region}, ${country}` : country}
          </p>
        </div>

        {icon ? (
          <img src={icon} alt={condition} className="w-20 h-20 sm:w-24 sm:h-24" />
        ) : (
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-xs border rounded-full ${
              theme === "dark" ? "text-gray-300 border-gray-400/30" : "text-gray-700 border-gray-600/20"
            }`}
          >
            No Icon
          </div>
        )}
      </div>

      <p className="text-5xl sm:text-6xl font-extrabold my-3">
        {temp}°{unit}
      </p>
      <p className="text-lg sm:text-xl font-medium">{condition}</p>

      <div className={`flex justify-center gap-4 mt-4 text-sm sm:text-base ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
        <div className="flex items-center gap-1">
          <ArrowUpIcon className={`w-4 h-4 ${theme === "dark" ? "text-yellow-300" : "text-yellow-600"}`} />
          <span>
            {feelsLike}°{unit}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowDownIcon className={`w-4 h-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
          <span>{wind} kph</span>
        </div>
      </div>
    </motion.div>
  );
}

export default WeatherCard;
