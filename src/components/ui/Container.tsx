import type { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

interface ContainerProps extends PropsWithChildren {
  className?: string;
}

function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6", className)}>
      {children}
    </div>
  );
}

export default Container;
