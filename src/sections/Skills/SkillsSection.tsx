import { useMemo } from "react";
import type { TooltipItem } from "chart.js";
import { Radar } from "react-chartjs-2";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { skillsCategories, skillsMetrics } from "@/data/skills";
import { ensureChartJSRegistered } from "@/lib/chart";

ensureChartJSRegistered();

function SkillsSection() {
  const radarData = useMemo(() => {
    return {
      labels: skillsMetrics.map((item) => item.label),
      datasets: [
        {
          label: "Skills Overview",
          data: skillsMetrics.map((item) => item.value),
          borderColor: "rgba(34, 211, 238, 0.9)",
          backgroundColor: "rgba(34, 211, 238, 0.12)",
          pointBackgroundColor: "rgba(103, 232, 249, 1)",
          pointBorderColor: "rgba(255,255,255,0.7)",
          pointHoverBackgroundColor: "rgba(255,255,255,1)",
          pointHoverBorderColor: "rgba(34, 211, 238, 1)",
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 4,
        },
      ],
    };
  }, []);

  const radarOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 900,
      },
      plugins: {
        legend: {
          display: false,
        },
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

  return (
    <section id="skills" className="section anchor-offset">
      <Container>
        <SectionHeading
          eyebrow="Skills"
          title="Technical Skills"
          description="A visual overview of my strengths, followed by categorized tools and technologies I use to build modern web applications."
        />

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          {/* Chart panel */}
          <Card variant="strong" className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Skills Overview</p>
                <h3 className="mt-2 text-lg font-semibold text-white md:text-xl">
                  Radar Visualization
                </h3>
                <p className="mt-2 text-sm text-gray-300">
                  Visual representation of core strengths across frontend
                  development, integration, and engineering workflow.
                </p>
              </div>

              <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                Chart.js
              </span>
            </div>

            <div className="mt-5 h-[340px] rounded-2xl border border-white/10 bg-white/5 p-4 md:h-[380px]">
              <Radar data={radarData} options={radarOptions} />
            </div>

            <p className="mt-4 text-xs text-gray-400">
              Note: Values represent a portfolio-style visual summary of
              strengths (not certification scores).
            </p>
          </Card>

          {/* Category cards */}
          <div className="grid gap-6">
            {skillsCategories.map((category) => (
              <Card key={category.id} className="p-5 md:p-6">
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
                      className="border-white/10 bg-white/5 text-gray-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SkillsSection;
