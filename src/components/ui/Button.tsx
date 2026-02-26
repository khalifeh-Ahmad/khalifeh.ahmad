import type { AnchorHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { profileData } from "@/data/profile";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface CTAButtonProps
  extends PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>> {
  variant?: ButtonVariant;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

function CTAButton({
  children,
  className,
  variant = "primary",
  iconLeft,
  iconRight,
  ...props
}: CTAButtonProps) {
  const baseClasses =
    "inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-medium transition";

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100",
    secondary:
      "border-white/15 bg-white/5 text-gray-100 hover:bg-white/10 hover:text-white",
    ghost:
      "border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/5 hover:text-white",
  };

  return (
    <a
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {iconLeft && <span>{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span>{iconRight}</span>}
    </a>
  );
}

interface ResumeButtonProps {
  variant?: ButtonVariant;
  className?: string;
  label?: string;
}

function getResumeHref() {
  if (profileData.resumeUrl) return profileData.resumeUrl;
  if (profileData.cvFileName) return `/${profileData.cvFileName}`;
  return "#";
}

function ResumeButton({
  variant = "ghost",
  className,
  label = "Download CV",
}: ResumeButtonProps) {
  const href = getResumeHref();

  return (
    <CTAButton
      href={href}
      download
      variant={variant}
      className={className}
      title="Downloads your resume PDF"
    >
      {label}
    </CTAButton>
  );
}

export { CTAButton, ResumeButton };

