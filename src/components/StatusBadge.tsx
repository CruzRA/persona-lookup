interface StatusBadgeProps {
  status: "pending" | "processed" | "delivered" | "cancelled";
}

const statusStyles = {
  pending: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  processed: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
