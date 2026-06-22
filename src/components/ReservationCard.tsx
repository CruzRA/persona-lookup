import type { Reservation } from "@/lib/types";

interface ReservationCardProps {
  reservation: Reservation;
}

function formatLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function ReservationCard({ reservation }: ReservationCardProps) {
  const totalAmount = reservation.payment_history.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <a
      href={`/reservation/${reservation.reservation_id}`}
      className="block p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg
                 hover:border-[var(--accent)] hover:bg-[var(--bg-tertiary)] transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono font-semibold text-[var(--accent)] group-hover:text-[var(--accent-hover)]">
            {reservation.reservation_id}
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">
            {reservation.origin} → {reservation.destination}
          </div>
        </div>
        <span className="px-2 py-1 rounded-full text-[10px] font-medium border bg-[var(--bg-tertiary)] border-[var(--border)]">
          {formatLabel(reservation.cabin)}
        </span>
      </div>

      <div className="space-y-2">
        {reservation.flights.slice(0, 3).map((segment, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)] truncate flex-1 mr-4">
              {segment.flight_number} · {segment.origin} → {segment.destination}
            </span>
            <span className="font-mono">${segment.price.toFixed(0)}</span>
          </div>
        ))}
        {reservation.flights.length > 3 && (
          <div className="text-xs text-[var(--text-secondary)]">
            +{reservation.flights.length - 3} more segment{reservation.flights.length - 3 !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <div className="text-xs text-[var(--text-secondary)]">
          {reservation.passengers.length} passenger{reservation.passengers.length !== 1 ? "s" : ""} · {formatLabel(reservation.flight_type)}
        </div>
        <span className="font-semibold font-mono">${totalAmount.toFixed(2)}</span>
      </div>
    </a>
  );
}
