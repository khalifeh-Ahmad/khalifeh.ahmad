import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";

let isRegistered = false;

export function ensureChartJSRegistered() {
  if (isRegistered) return;

  ChartJS.register(
    // Radar
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,

    // Bar
    CategoryScale,
    LinearScale,
    BarElement,

    // Shared
    Tooltip,
    Legend,
  );

  isRegistered = true;
}
