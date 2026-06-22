import { notFound } from "next/navigation";
import { getFlightByNumber } from "@/lib/db";
import { CopyField } from "@/components/CopyField";
import { StatusBadge } from "@/components/StatusBadge";
import type { FlightDateInfo } from "@/lib/types";

interface PageProps {
  params: Promise<{ flightNumber: string }>;
  searchParams: Promise<{ date?: string }>;
}

function formatLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function DateDetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span className="font-mono">{value.replace("T", " ")}</span>
    </div>
  );
}

function DateInfoCard({ date, info, highlighted }: { date: string; info: FlightDateInfo; highlighted: boolean }) {
  return (
    <div
      className={`p-4 rounded-lg border transition-colors
        ${highlighted ? "bg-[var(--accent)]/10 border-[var(--accent)]/30" : "bg-[var(--bg-tertiary)] border-[var(--border)]"}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono font-medium">{date}</div>
        <StatusBadge status={info.status} size="sm" />
      </div>

      <div className="space-y-2">
        <DateDetailRow label="Est. Departure" value={info.estimated_departure_time_est} />
        <DateDetailRow label="Est. Arrival" value={info.estimated_arrival_time_est} />
        <DateDetailRow label="Actual Departure" value={info.actual_departure_time_est} />
        <DateDetailRow label="Actual Arrival" value={info.actual_arrival_time_est} />
      </div>

      {info.available_seats && (
        <div className="mt-4 pt-3 border-t border-[var(--border)]">
          <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">Available Seats</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(info.available_seats).map(([cabin, seats]) => (
              <span key={cabin} className="px-2 py-1 text-xs bg-[var(--bg-primary)] rounded border border-[var(--border)]">
                {formatLabel(cabin)}: {seats}
              </span>
            ))}
          </div>
        </div>
      )}

      {info.prices && (
        <div className="mt-3">
          <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">Prices</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(info.prices).map(([cabin, price]) => (
              <span key={cabin} className="px-2 py-1 text-xs bg-[var(--bg-primary)] rounded border border-[var(--border)] font-mono">
                {formatLabel(cabin)}: ${price}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function FlightPage({ params, searchParams }: PageProps) {
  const { flightNumber } = await params;
  const { date: highlightedDate } = await searchParams;
  const flight = getFlightByNumber(flightNumber);

  if (!flight) {
    notFound();
  }

  const dates = Object.entries(flight.dates).sort(([a], [b]) => a.localeCompare(b));
  const statusCounts = dates.reduce<Record<string, number>>((acc, [, info]) => {
    acc[info.status] = (acc[info.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <nav className="text-sm text-[var(--text-secondary)]">
        <a href="/" className="hover:text-[var(--accent)]">Home</a>
        <span className="mx-2">/</span>
        <span className="text-[var(--text-primary)]">{flight.flight_number}</span>
      </nav>

      <header className="p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold font-mono">{flight.flight_number}</h1>
            <div className="mt-2 text-xl">
              {flight.origin} → {flight.destination}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-[var(--text-secondary)]">Scheduled</div>
            <div className="font-mono text-sm mt-1">
              {flight.scheduled_departure_time_est} – {flight.scheduled_arrival_time_est}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <span key={status} className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] text-xs">
              <StatusBadge status={status} size="sm" />
              <span className="text-[var(--text-secondary)]">{count}</span>
            </span>
          ))}
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Schedule ({dates.length} dates)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dates.map(([date, info]) => (
            <DateInfoCard
              key={date}
              date={date}
              info={info}
              highlighted={highlightedDate === date}
            />
          ))}
        </div>
      </section>

      <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
          Quick Copy
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CopyField label="Flight Number" value={flight.flight_number} />
          <CopyField label="Route" value={`${flight.origin} → ${flight.destination}`} />
          {highlightedDate && <CopyField label="Highlighted Date" value={highlightedDate} />}
        </div>
      </section>
    </div>
  );
}
