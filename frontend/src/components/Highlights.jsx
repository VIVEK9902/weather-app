import { motion } from "framer-motion";

function Highlights({ data, unit = "C", theme = "dark" }) {
  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${theme === "dark" ? "bg-white/10 text-gray-200" : "bg-gray-100 text-gray-800"} backdrop-blur-lg p-6 rounded-2xl shadow-xl w-full animate-pulse`}
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">Today's Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, idx) => (
            <div key={idx} className={`rounded-xl shadow-md p-4 h-32 ${theme === "dark" ? "bg-black/30" : "bg-gray-300/50"}`}></div>
          ))}
        </div>
      </motion.div>
    );
  }

  const feelsLike = unit === "C" ? Math.round(data.feelslike_c) : Math.round(data.feelslike_f);

  const stats = [
    { icon: "🌡️", label: "Feels Like", value: `${feelsLike}°${unit}` },
    { icon: "💧", label: "Humidity", value: `${data.humidity ?? "--"}%` },
    { icon: "📈", label: "Pressure", value: `${data.pressure_mb ?? "--"} hPa` },
    { icon: "🌬️", label: "Wind", value: `${data.wind_kph ?? "--"} km/h`, desc: data.wind_dir ?? "--" },
    { icon: "👁️", label: "Visibility", value: `${data.vis_km ?? "--"} km` },
    { icon: "☀️", label: "UV Index", value: data.uv ?? "--" },
  ];

  const containerBg = theme === "dark" ? "bg-white/20 text-gray-100" : "bg-gray-200 text-gray-900";
  const cardBg = theme === "dark" ? "bg-black/30" : "bg-white/70 shadow-md border border-gray-300/40";
  const titleText = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const labelText = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const descText = theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={`${containerBg} backdrop-blur-lg p-6 rounded-2xl shadow-xl w-full`}>
      <h2 className={`text-xl sm:text-2xl font-semibold mb-6 ${titleText}`}>Today's Highlights</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((item, idx) => (
          <motion.div key={idx} whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }} className={`${cardBg} rounded-xl p-4 flex flex-col items-center text-center transition-all duration-300`}>
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className={`text-sm mb-1 ${labelText}`}>{item.label}</div>
            <div className="text-2xl sm:text-3xl font-bold">{item.value}</div>
            {item.desc && <div className={`text-sm mt-1 ${descText}`}>{item.desc}</div>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Highlights;
