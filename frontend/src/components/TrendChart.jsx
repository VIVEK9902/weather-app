// src/components/TrendChart.jsx
import React from "react";
import Chart from "react-apexcharts";

/**
 * TrendChart
 * Props:
 *   - series: [{ name: 'Temperature', data: [...] }, ...]
 *   - categories: [ 'Mon 3', 'Tue 4', ...]
 *   - height: number (optional)
 */
export default function TrendChart({ series = [], categories = [], height = 320, theme = "dark" }) {
  const options = {
    chart: {
      type: "area",
      height,
      toolbar: { show: false },
      background: "transparent",
      animations: { enabled: true, easing: "easeout", speed: 600 },
      foreColor: theme === "dark" ? "#e6edf3" : "#1f2937",
    },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 90, 100] },
    },
    xaxis: {
      categories,
      labels: { rotate: 0 },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { formatter: (val) => `${Math.round(val)}` },
      tooltip: { enabled: true },
    },
    tooltip: {
      theme: theme === "dark" ? "dark" : "light",
      x: { show: true },
      y: { formatter: (val) => val },
    },
    markers: {
      size: 4,
      hover: { size: 6 },
      colors: undefined,
      strokeWidth: 2,
      shape: "circle",
      radius: 2,
    },
    grid: { show: false },
    legend: { show: true, position: "top", horizontalAlign: "right" },
  };

  return (
    <div className="rounded-xl p-4 glass" style={{ backdropFilter: "blur(8px)" }}>
      <Chart options={options} series={series} type="area" height={height} />
    </div>
  );
}
