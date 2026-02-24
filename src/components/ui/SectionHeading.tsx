import { cn } from "@/utils/cn";

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
    <div
      className={cn(
        "mb-8 md:mb-10",
        align === "center" && "text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2 className="heading-section text-white">{title}</h2>

      {description && (
        <p
          className={cn(
            "body-md mt-3 max-w-2xl",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
