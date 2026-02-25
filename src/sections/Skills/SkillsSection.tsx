import { useMemo, useState } from "react";
import type { ChartData, ChartOptions, TooltipItem } from "chart.js";
import { Bar, Radar } from "react-chartjs-2";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { skillsCategories, skillsMetrics } from "@/data/skills";
import { ensureChartJSRegistered } from "@/lib/chart";
import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";

ensureChartJSRegistered();

const PRESETS = {
  core: [92, 88, 84, 82, 78, 75],
  frontend: [96, 91, 78, 86, 65, 55],
  data: [72, 74, 70, 68, 90, 60],
  automation: [66, 70, 78, 75, 72, 92],
} as const;

type PresetKey = keyof typeof PRESETS;
type ChartView = "radar" | "bar";

function SkillsSection() {
  const [activePreset, setActivePreset] = useState<PresetKey>("core");
  const [chartView, setChartView] = useState<ChartView>("radar");

  const activeValues = PRESETS[activePreset];

  const radarData = useMemo<ChartData<"radar">>(() => {
    return {
      labels: skillsMetrics.map((item) => item.label),
      datasets: [
        {
          label: "Skills Overview",
          data: [...activeValues],
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
  }, [activeValues]);

  const barData = useMemo<ChartData<"bar">>(() => {
    return {
      labels: skillsMetrics.map((item) => item.label),
      datasets: [
        {
          label: "Skill Strength",
          data: [...activeValues],
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
  }, [activeValues]);

  const radarOptions = useMemo<ChartOptions<"radar">>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 700,
      },
      interaction: {
        mode: "nearest",
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          titleColor: "#ffffff",
          bodyColor: "#d1d5db",
          borderColor: "rgba(255,255,255,0.12)",
          borderWidth: 1,
          padding: 10,
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
          ticks: {
            display: false,
            stepSize: 20,
          },
          angleLines: {
            color: "rgba(255,255,255,0.08)",
          },
          grid: {
            color: "rgba(255,255,255,0.08)",
          },
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
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          titleColor: "#ffffff",
          bodyColor: "#d1d5db",
          borderColor: "rgba(255,255,255,0.12)",
          borderWidth: 1,
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
          ticks: {
            color: "#94a3b8",
            stepSize: 20,
          },
          grid: {
            color: "rgba(255,255,255,0.08)",
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
  ];

  return (
    <section id="skills" className="section anchor-offset">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Skills"
            title="Technical Skills"
            description="Interactive skill visualizations and categorized technologies used to build modern, professional web applications."
          />
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

                {/* <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                Chart.js
              </span> */}
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

              <div className="mt-5 h-[340px] rounded-2xl border border-white/10 bg-white/5 p-4 md:h-[380px]">
                {chartView === "radar" ? (
                  <Radar data={radarData} options={radarOptions} />
                ) : (
                  <Bar data={barData} options={barOptions} />
                )}
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Note: Values represent a portfolio-style visual summary of
                strengths (not certification scores).
              </p>
            </Card>
          </Reveal>
          {/* Category cards */}
          <div className="grid gap-6" staggerChildren={0.08}>
            {skillsCategories.map((category) => (
              <Reveal key={category.id}>
                <TiltCard>
                  <Card
                    key={category.id}
                    className="p-5 transition-transform duration-300 hover:-translate-y-1 md:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-white md:text-lg">
                          {category.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-gray-300">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
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
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SkillsSection;
