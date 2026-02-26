import { useMemo, useState } from "react";
import type { ChartData, ChartOptions, TooltipItem } from "chart.js";
import { Bar, Pie, Radar } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";

import Reveal from "@/components/motion/Reveal";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { skillsCategories, skillsMetrics } from "@/data/skills";
import { ensureChartJSRegistered } from "@/lib/chart";
import SpotlightCard from "@/components/motion/SpotlightCard";
import ParallaxMouse from "@/components/motion/ParallaxMouse";

ensureChartJSRegistered();

const PRESETS = {
  core: [92, 88, 84, 82, 78, 75],
  frontend: [96, 91, 78, 86, 65, 55],
  data: [72, 74, 70, 68, 90, 60],
  automation: [66, 70, 78, 75, 72, 92],
} as const;

type PresetKey = keyof typeof PRESETS;
type ChartView = "radar" | "bar" | "pie" | "progress";

function SkillsSection() {
  const [activePreset, setActivePreset] = useState<PresetKey>("core");
  const [chartView, setChartView] = useState<ChartView>("radar");

  const activeValues = PRESETS[activePreset];

  const labels = useMemo(() => skillsMetrics.map((m) => m.label), []);
  const values = useMemo(() => [...activeValues], [activeValues]);

  const radarData = useMemo<ChartData<"radar">>(() => {
    return {
      labels,
      datasets: [
        {
          label: "Skills Overview",
          data: values,
          borderColor: "rgba(34, 211, 238, 0.9)",
          backgroundColor: "rgba(34, 211, 238, 0.12)",
          pointBackgroundColor: "rgba(103, 232, 249, 1)",
          pointBorderColor: "rgba(255,255,255,0.7)",
          pointHoverBackgroundColor: "rgba(255,255,255,1)",
          pointHoverBorderColor: "rgba(34, 211, 238, 1)",
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointHitRadius: 12,
        },
      ],
    };
  }, [labels, values]);

  const barData = useMemo<ChartData<"bar">>(() => {
    return {
      labels,
      datasets: [
        {
          label: "Skill Strength",
          data: values,
          backgroundColor: [
            "rgba(34, 211, 238, 0.35)",
            "rgba(56, 189, 248, 0.30)",
            "rgba(139, 92, 246, 0.28)",
            "rgba(34, 211, 238, 0.28)",
            "rgba(56, 189, 248, 0.24)",
            "rgba(139, 92, 246, 0.22)",
          ],
          borderColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          borderRadius: 10,
          borderSkipped: false,
          hoverBackgroundColor: [
            "rgba(34, 211, 238, 0.45)",
            "rgba(56, 189, 248, 0.40)",
            "rgba(139, 92, 246, 0.38)",
            "rgba(34, 211, 238, 0.38)",
            "rgba(56, 189, 248, 0.34)",
            "rgba(139, 92, 246, 0.32)",
          ],
        },
      ],
    };
  }, [labels, values]);

  const pieData = useMemo<ChartData<"pie">>(() => {
    return {
      labels,
      datasets: [
        {
          label: "Distribution",
          data: values,
          backgroundColor: [
            "rgba(34, 211, 238, 0.50)",
            "rgba(56, 189, 248, 0.45)",
            "rgba(139, 92, 246, 0.40)",
            "rgba(34, 211, 238, 0.40)",
            "rgba(56, 189, 248, 0.35)",
            "rgba(139, 92, 246, 0.32)",
          ],
          borderColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          hoverOffset: 10,
        },
      ],
    };
  }, [labels, values]);

  const commonTooltip = {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    titleColor: "#ffffff",
    bodyColor: "#d1d5db",
    borderColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    padding: 10,
  } as const;

  const radarOptions = useMemo<ChartOptions<"radar">>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700 },
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...commonTooltip,
          callbacks: {
            label: (tooltipItem: TooltipItem<"radar">) => {
              const rawValue =
                typeof tooltipItem.raw === "number"
                  ? tooltipItem.raw
                  : Number(tooltipItem.raw ?? 0);
              return ` Visual strength: ${rawValue}/100`;
            },
          },
        },
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false, stepSize: 20 },
          angleLines: { color: "rgba(255,255,255,0.08)" },
          grid: { color: "rgba(255,255,255,0.08)" },
          pointLabels: {
            color: "#cbd5e1",
            font: {
              size: 12,
              family: "Inter, ui-sans-serif, system-ui, sans-serif",
            },
          },
        },
      },
    };
  }, []);

  const barOptions = useMemo<ChartOptions<"bar">>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700 },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...commonTooltip,
          callbacks: {
            label: (tooltipItem: TooltipItem<"bar">) => {
              const rawValue =
                typeof tooltipItem.raw === "number"
                  ? tooltipItem.raw
                  : Number(tooltipItem.raw ?? 0);
              return ` Visual strength: ${rawValue}/100`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#cbd5e1",
            font: { size: 11 },
            maxRotation: 0,
            minRotation: 0,
          },
        },
        y: {
          min: 0,
          max: 100,
          ticks: { color: "#94a3b8", stepSize: 20 },
          grid: { color: "rgba(255,255,255,0.08)" },
        },
      },
    };
  }, []);

  const pieOptions = useMemo<ChartOptions<"pie">>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700 },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            color: "#cbd5e1",
            boxWidth: 10,
            boxHeight: 10,
            padding: 14,
            font: {
              size: 11,
              family: "Inter, ui-sans-serif, system-ui, sans-serif",
            },
          },
        },
        tooltip: {
          ...commonTooltip,
          callbacks: {
            label: (tooltipItem: TooltipItem<"pie">) => {
              const rawValue =
                typeof tooltipItem.raw === "number"
                  ? tooltipItem.raw
                  : Number(tooltipItem.raw ?? 0);
              return ` Visual strength: ${rawValue}/100`;
            },
          },
        },
      },
    };
  }, []);

  const presetButtons: Array<{ key: PresetKey; label: string }> = [
    { key: "core", label: "Core" },
    { key: "frontend", label: "Frontend" },
    { key: "data", label: "Data" },
    { key: "automation", label: "Automation" },
  ];

  const chartViewButtons: Array<{ key: ChartView; label: string }> = [
    { key: "radar", label: "Radar" },
    { key: "bar", label: "Bar" },
    { key: "pie", label: "Pie" },
    { key: "progress", label: "Progress" },
  ];

  const progressItems = useMemo(() => {
    return skillsMetrics.map((m, idx) => ({
      label: m.label,
      value: values[idx] ?? 0,
    }));
  }, [values]);

  return (
    <section id="skills" className="section anchor-offset">
      <Container>
        <Reveal>
          <ParallaxMouse strengthX={10} strengthY={8}>
            <SectionHeading
              eyebrow="Skills"
              title="Technical Skills"
              description="Interactive skill visualizations and categorized technologies used to build modern, professional web applications."
            />
          </ParallaxMouse>
        </Reveal>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          {/* Chart panel */}
          <Reveal delay={0.05}>
            <Card variant="strong" className="p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Skills Overview</p>
                  <h3 className="mt-2 text-lg font-semibold text-white md:text-xl">
                    Interactive Visualization
                  </h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Switch presets and chart types to explore different strength
                    profiles across frontend, data, and automation.
                  </p>
                </div>
              </div>

              {/* Chart type tabs */}
              <div className="mt-4 flex flex-wrap gap-2">
                {chartViewButtons.map((tab) => {
                  const isActive = chartView === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setChartView(tab.key)}
                      className={[
                        "inline-flex items-center rounded-xl border px-3 py-2 text-xs font-medium transition",
                        isActive
                          ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                          : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                      aria-pressed={isActive}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Preset controls */}
              <div className="mt-3 flex flex-wrap gap-2">
                {presetButtons.map((preset) => {
                  const isActive = activePreset === preset.key;
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => setActivePreset(preset.key)}
                      className={[
                        "inline-flex items-center rounded-xl border px-3 py-2 text-xs font-medium transition",
                        isActive
                          ? "border-white/15 bg-white/10 text-white"
                          : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                      aria-pressed={isActive}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* View container */}
              <div className="mt-5 h-[340px] rounded-2xl border border-white/10 bg-white/5 p-4 md:h-[380px]">
                <AnimatePresence mode="wait" initial={false}>
                  {chartView === "radar" && (
                    <motion.div
                      key="radar"
                      className="h-full"
                      initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                      <Radar data={radarData} options={radarOptions} />
                    </motion.div>
                  )}

                  {chartView === "bar" && (
                    <motion.div
                      key="bar"
                      className="h-full"
                      initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                      <Bar data={barData} options={barOptions} />
                    </motion.div>
                  )}

                  {chartView === "pie" && (
                    <motion.div
                      key="pie"
                      className="h-full"
                      initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                      <Pie data={pieData} options={pieOptions} />
                    </motion.div>
                  )}

                  {chartView === "progress" && (
                    <motion.div
                      key="progress"
                      className="h-full overflow-auto pr-1"
                      initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                      <div className="space-y-4">
                        {progressItems.map((item) => (
                          <div key={item.label}>
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-medium text-gray-200">
                                {item.label}
                              </p>
                              <p className="text-xs text-gray-400">
                                {Math.round(item.value)}%
                              </p>
                            </div>

                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
                              <motion.div
                                className="h-full bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400"
                                initial={{ width: "0%" }}
                                animate={{
                                  width: `${Math.max(0, Math.min(100, item.value))}%`,
                                }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        ))}

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                            Insight
                          </p>
                          <p className="mt-2 text-sm leading-6 text-gray-200">
                            This view is perfect for recruiters — clear skill
                            percentages without chart complexity.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Note: Values represent a portfolio-style visual summary of
                strengths (not certification scores).
              </p>
            </Card>
          </Reveal>

          {/* Category cards */}
          <div className="grid gap-6">
            {skillsCategories.map((category, index) => (
              <Reveal key={category.id} delay={0.03 * index} once>
                <SpotlightCard>
                  <Card className="group p-5 md:p-6">
                    <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.06),transparent_45%),radial-gradient(circle_at_85%_15%,rgba(139,92,246,0.05),transparent_48%)]" />

                    <div className="relative flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-white md:text-lg">
                          {category.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-gray-300">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="relative mt-4 flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <Badge
                          key={skill}
                          className="border-white/10 bg-white/5 text-gray-200 transition hover:border-white/20 hover:bg-white/10"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SkillsSection;
