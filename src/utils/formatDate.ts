const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatMonthYear(value: string): string {
  // expected format: YYYY-MM
  const [yearStr, monthStr] = value.split("-");
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;

  if (!year || monthIndex < 0 || monthIndex > 11) return value;

  return `${MONTHS[monthIndex]} ${year}`;
}

export function formatExperienceRange(
  startDate: string,
  endDate: string | "Present",
): string {
  const start = formatMonthYear(startDate);
  const end = endDate === "Present" ? "Present" : formatMonthYear(endDate);
  return `${start} — ${end}`;
}
