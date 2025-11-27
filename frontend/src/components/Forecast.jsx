import { motion } from "framer-motion";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

function Forecast({ data, unit = "C", theme = "dark" }) {
  if (!data || !Array.isArray(data.forecast)) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${theme === "dark" ? "bg-white/10 text-gray-200" : "bg-black/5 text-gray-700"} backdrop-blur-md p-6 rounded-2xl shadow-xl w-full animate-pulse`}>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">3-Day Forecast</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{Array(3).fill(0).map((_, idx) => <div key={idx} className={`${theme === "dark" ? "bg-black/30" : "bg-white/40"} p-4 rounded-xl h-48`}></div>)}</div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={`${theme === "dark" ? "bg-white/20 text-gray-200" : "bg-black/5 text-gray-800"} backdrop-blur-md p-6 rounded-2xl shadow-xl w-full`}>
      <h2 className="text-xl sm:text-2xl font-bold mb-4">3-Day Forecast</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data.forecast.map((d, idx) => {
          const date = d.date ? new Date(d.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) : "N/A";
          const icon = d.icon || null;
          const condition = d.condition || "N/A";
          const avgTemp = unit === "C" ? Math.round(d.avg_temp_c) : Math.round(d.avg_temp_f);
          const maxTemp = unit === "C" ? Math.round(d.max_temp_c) : Math.round(d.max_temp_f);
          const minTemp = unit === "C" ? Math.round(d.min_temp_c) : Math.round(d.min_temp_f);

          return (
            <motion.div key={idx} whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className={`${theme === "dark" ? "bg-black/30" : "bg-white/60"} p-4 rounded-xl text-center flex flex-col items-center gap-2`}>
              <p className={`font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>{date}</p>
              {icon ? <img src={icon} alt={condition} className="w-14 h-14 sm:w-16 sm:h-16 mx-auto my-2" /> : <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center border rounded-full text-xs ${theme === "dark" ? "text-gray-400 border-gray-500/30" : "text-gray-600 border-gray-300/40"}`}>No Icon</div>}
              <p className="text-2xl sm:text-3xl font-bold">{avgTemp}°{unit}</p>
              <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{condition}</p>
              <div className={`flex items-center gap-2 mt-1 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                <div className="flex items-center gap-1">
                  <ArrowUpIcon className="w-4 h-4 text-red-400" />
                  <span>{maxTemp}°</span>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowDownIcon className="w-4 h-4 text-blue-400" />
                  <span>{minTemp}°</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default Forecast;
