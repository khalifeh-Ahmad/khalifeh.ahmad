import type { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

interface BadgeProps extends PropsWithChildren {
  className?: string;
}

function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-cyan-400/30",
        "bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300",
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
