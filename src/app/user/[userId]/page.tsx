import { notFound } from "next/navigation";
import { getUserById, getReservationsByUserId } from "@/lib/db";
import { PaymentMethodCard } from "@/components/PaymentMethodCard";
import { ReservationCard } from "@/components/ReservationCard";
import { CopyField } from "@/components/CopyField";

interface PageProps {
  params: Promise<{ userId: string }>;
}

function formatLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function UserPage({ params }: PageProps) {
  const { userId } = await params;
  const user = getUserById(userId);

  if (!user) {
    notFound();
  }

  const reservations = getReservationsByUserId(userId);
  const paymentMethods = Object.values(user.payment_methods);

  return (
    <div className="space-y-8">
      <nav className="text-sm text-[var(--text-secondary)]">
        <a href="/" className="hover:text-[var(--accent)]">Home</a>
        <span className="mx-2">/</span>
        <span className="text-[var(--text-primary)]">{user.name.first_name} {user.name.last_name}</span>
      </nav>

      <header className="flex items-start gap-6 p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 
                        flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {user.name.first_name[0]}{user.name.last_name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold">
            {user.name.first_name} {user.name.last_name}
          </h1>
          <div className="mt-1 text-[var(--text-secondary)] font-mono text-sm">
            {user.user_id}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <a href={`mailto:${user.email}`} className="text-[var(--accent)] hover:text-[var(--accent-hover)]">
              {user.email}
            </a>
            <span className="text-[var(--text-secondary)]">DOB: {user.dob}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium border border-[var(--border)] bg-[var(--bg-tertiary)]">
              {formatLabel(user.membership)} Member
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm text-[var(--text-secondary)]">Reservations</div>
          <div className="text-2xl font-bold text-[var(--accent)]">{reservations.length}</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Address
            </h2>
            <div className="space-y-1 text-sm">
              <div>{user.address.address1}</div>
              {user.address.address2 && <div>{user.address.address2}</div>}
              <div>
                {user.address.city}, {user.address.state} {user.address.zip}
              </div>
              <div className="text-[var(--text-secondary)]">{user.address.country}</div>
            </div>
          </section>

          <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Payment Methods ({paymentMethods.length})
            </h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <PaymentMethodCard key={method.id} method={method} />
              ))}
            </div>
          </section>

          {user.saved_passengers.length > 0 && (
            <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
              <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
                Saved Passengers ({user.saved_passengers.length})
              </h2>
              <div className="space-y-3">
                {user.saved_passengers.map((passenger, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)] text-sm"
                  >
                    <div className="font-medium">
                      {passenger.first_name} {passenger.last_name}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1">DOB: {passenger.dob}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-2">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Reservation History ({reservations.length})
            </h2>
            {reservations.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-secondary)] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
                No reservations yet
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reservations.map((reservation) => (
                  <ReservationCard key={reservation.reservation_id} reservation={reservation} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
          Quick Copy
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CopyField label="User ID" value={user.user_id} />
          <CopyField label="Email" value={user.email} />
          <CopyField label="Name" value={`${user.name.first_name} ${user.name.last_name}`} />
          <CopyField label="Zip" value={user.address.zip} />
        </div>
      </section>
    </div>
  );
}
