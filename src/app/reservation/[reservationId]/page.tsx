import { notFound } from "next/navigation";
import {
  getReservationById,
  getUserById,
  getFlightByNumber,
  getFlightDateInfo,
} from "@/lib/db";
import { CopyField } from "@/components/CopyField";
import { StatusBadge } from "@/components/StatusBadge";

interface PageProps {
  params: Promise<{ reservationId: string }>;
}

function formatLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function ReservationPage({ params }: PageProps) {
  const { reservationId } = await params;
  const reservation = getReservationById(reservationId);

  if (!reservation) {
    notFound();
  }

  const user = getUserById(reservation.user_id);
  const totalAmount = reservation.payment_history.reduce((sum, payment) => sum + payment.amount, 0);

  const segmentsWithStatus = reservation.flights.map((segment) => {
    const flight = getFlightByNumber(segment.flight_number);
    const dateInfo = getFlightDateInfo(segment.flight_number, segment.date);
    return {
      ...segment,
      scheduledDeparture: flight?.scheduled_departure_time_est,
      scheduledArrival: flight?.scheduled_arrival_time_est,
      dateStatus: dateInfo?.status,
    };
  });

  return (
    <div className="space-y-8">
      <nav className="text-sm text-[var(--text-secondary)]">
        <a href="/" className="hover:text-[var(--accent)]">Home</a>
        <span className="mx-2">/</span>
        {user && (
          <>
            <a href={`/user/${user.user_id}`} className="hover:text-[var(--accent)]">
              {user.name.first_name} {user.name.last_name}
            </a>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-[var(--text-primary)]">{reservation.reservation_id}</span>
      </nav>

      <header className="p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono text-[var(--accent)]">
              {reservation.reservation_id}
            </h1>
            <div className="mt-2 text-lg">
              {reservation.origin} → {reservation.destination}
            </div>
            {user && (
              <a
                href={`/user/${user.user_id}`}
                className="mt-2 inline-block text-[var(--text-secondary)] hover:text-[var(--accent)]"
              >
                {user.name.first_name} {user.name.last_name}
                <span className="ml-2 text-xs font-mono opacity-60">{user.user_id}</span>
              </a>
            )}
          </div>
          <div className="text-right space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border border-[var(--border)] bg-[var(--bg-tertiary)]">
              {formatLabel(reservation.cabin)}
            </span>
            <div className="text-xs text-[var(--text-secondary)]">{formatLabel(reservation.flight_type)}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Segments</div>
            <div className="mt-1 text-xl font-semibold">{reservation.flights.length}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Passengers</div>
            <div className="mt-1 text-xl font-semibold">{reservation.passengers.length}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Total Paid</div>
            <div className="mt-1 text-xl font-semibold font-mono">${totalAmount.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Created</div>
            <div className="mt-1 text-sm font-mono">{reservation.created_at.replace("T", " ")}</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Flight Segments
            </h2>
            <div className="space-y-4">
              {segmentsWithStatus.map((segment, idx) => (
                <a
                  key={idx}
                  href={`/flight/${segment.flight_number}?date=${segment.date}`}
                  className="block p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]
                             hover:border-[var(--accent)] transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium group-hover:text-[var(--accent)] transition-colors">
                        {segment.flight_number}
                        <svg className="inline-block w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                      <div className="mt-1 text-sm">
                        {segment.origin} → {segment.destination}
                      </div>
                      <div className="mt-1 text-xs font-mono text-[var(--text-secondary)]">
                        Date: {segment.date}
                        {segment.scheduledDeparture && (
                          <span className="ml-3">
                            {segment.scheduledDeparture} – {segment.scheduledArrival}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="font-mono font-semibold">${segment.price.toFixed(2)}</div>
                      {segment.dateStatus && <StatusBadge status={segment.dateStatus} size="sm" />}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Passengers
            </h2>
            <div className="space-y-3">
              {reservation.passengers.map((passenger, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]"
                >
                  <div className="font-medium">
                    {passenger.first_name} {passenger.last_name}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">DOB: {passenger.dob}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Trip Details
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Insurance</span>
                <span className="font-medium">{formatLabel(reservation.insurance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Total Baggage</span>
                <span className="font-medium">{reservation.total_baggages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Non-free Baggage</span>
                <span className="font-medium">{reservation.nonfree_baggages}</span>
              </div>
            </div>
          </section>

          <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Payment History
            </h2>
            <div className="space-y-3">
              {reservation.payment_history.map((payment, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-400">Payment</span>
                    <span className="font-mono font-semibold">${payment.amount.toFixed(2)}</span>
                  </div>
                  <div className="mt-1 text-xs text-[var(--text-secondary)] font-mono truncate">
                    {payment.payment_id}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Quick Copy
            </h2>
            <div className="space-y-3">
              <CopyField label="Reservation ID" value={reservation.reservation_id} />
              <CopyField label="User ID" value={reservation.user_id} />
              <CopyField label="Route" value={`${reservation.origin} → ${reservation.destination}`} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
