import Badge from "./Badge";

interface AvailabilityBadgesProps {
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryClassName?: string;
}

function AvailabilityBadges({
  primaryLabel = "Open to Opportunities",
  secondaryLabel,
  secondaryClassName,
}: AvailabilityBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>{primaryLabel}</Badge>
      {secondaryLabel ? (
        <Badge className={secondaryClassName}>{secondaryLabel}</Badge>
      ) : null}
    </div>
  );
}

export default AvailabilityBadges;

