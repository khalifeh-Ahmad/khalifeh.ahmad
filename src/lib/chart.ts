import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";

let isRegistered = false;

export function ensureChartJSRegistered() {
  if (isRegistered) return;

  ChartJS.register(
    // scales
    CategoryScale,
    LinearScale,
    RadialLinearScale,

    // elements
    PointElement,
    LineElement,
    BarElement,
    ArcElement,

    // plugins
    Filler,
    Tooltip,
    Legend,
  );

  isRegistered = true;
}
