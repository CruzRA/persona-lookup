import type { FlightDateStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: FlightDateStatus | string;
  size?: "sm" | "md";
}

const statusStyles: Record<string, string> = {
  available: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  delayed: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  flying: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  landed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "on time": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

const defaultStyle = "bg-slate-500/20 text-slate-400 border-slate-500/30";

function formatStatus(status: string): string {
  return status
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

  return (
    <span
      className={`rounded-full font-medium border ${sizeClass} ${statusStyles[status] ?? defaultStyle}`}
    >
      {formatStatus(status)}
    </span>
  );
}
