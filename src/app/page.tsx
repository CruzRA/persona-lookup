import { SearchBox } from "@/components/SearchBox";
import { getAllUsers, getStats } from "@/lib/db";

export default function Home() {
  const users = getAllUsers();
  const stats = getStats();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Find Your Persona
        </h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
          Search for a test user to view their profile, orders, and payment methods.
        </p>
        <SearchBox initialUsers={users} />
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-6">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-[var(--accent)]">{stats.totalUsers.toLocaleString()}</div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">Users</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-[var(--accent)]">{stats.totalOrders.toLocaleString()}</div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">Orders</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-[var(--accent)]">{stats.totalProducts.toLocaleString()}</div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">Products</div>
        </div>
      </section>

      {/* Quick access - random sample of users */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Access</h2>
        <p className="text-sm text-[var(--text-secondary)]">Sample personas to get started</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.slice(0, 12).map((user) => (
            <a
              key={user.user_id}
              href={`/user/${user.user_id}`}
              className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg
                         hover:border-[var(--accent)] hover:bg-[var(--bg-tertiary)] transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 
                              flex items-center justify-center text-white font-semibold">
                {user.name.first_name[0]}{user.name.last_name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium group-hover:text-[var(--accent)] transition-colors">
                  {user.name.first_name} {user.name.last_name}
                </div>
                <div className="text-xs text-[var(--text-secondary)] truncate font-mono">
                  {user.user_id}
                </div>
              </div>
              <div className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
