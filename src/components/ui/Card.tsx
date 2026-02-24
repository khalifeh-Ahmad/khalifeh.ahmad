import type { PropsWithChildren } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends PropsWithChildren {
  className?: string;
  variant?: "default" | "strong";
}

function Card({ children, className, variant = "default" }: CardProps) {
  return (
    <div
      className={cn(
        variant === "default" ? "surface" : "surface-strong",
        "p-6 md:p-7",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Card;
