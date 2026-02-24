import { cn } from "../../utils/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-8", align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold text-white md:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 max-w-2xl text-sm text-gray-300 md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
