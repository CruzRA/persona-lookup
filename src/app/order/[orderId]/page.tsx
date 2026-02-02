import { notFound } from "next/navigation";
import { getOrderById, getUserById, getProductById } from "@/lib/db";
import { StatusBadge } from "@/components/StatusBadge";
import { CopyField } from "@/components/CopyField";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderPage({ params }: PageProps) {
  const { orderId } = await params;
  const order = getOrderById(`#${orderId}`);

  if (!order) {
    notFound();
  }

  const user = getUserById(order.user_id);
  const totalAmount = order.items.reduce((sum, item) => sum + item.price, 0);

  // Get product availability info
  const itemsWithAvailability = order.items.map((item) => {
    const product = getProductById(item.product_id);
    const variant = product?.variants[item.item_id];
    return {
      ...item,
      currentlyAvailable: variant?.available ?? false,
      currentPrice: variant?.price ?? item.price,
    };
  });

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
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
        <span className="text-[var(--text-primary)]">{order.order_id}</span>
      </nav>

      {/* Order Header */}
      <header className="p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono text-[var(--accent)]">
              {order.order_id}
            </h1>
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
          <StatusBadge status={order.status} />
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Items</div>
            <div className="mt-1 text-xl font-semibold">{order.items.length}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Total</div>
            <div className="mt-1 text-xl font-semibold font-mono">${totalAmount.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Payments</div>
            <div className="mt-1 text-xl font-semibold">{order.payment_history.length}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Shipments</div>
            <div className="mt-1 text-xl font-semibold">{order.fulfillments.length}</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Items
            </h2>
            <div className="space-y-4">
              {itemsWithAvailability.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="mt-1 text-xs font-mono text-[var(--text-secondary)]">
                        Product: {item.product_id} | Item: {item.item_id}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold">${item.price.toFixed(2)}</div>
                      <div className={`text-xs mt-1 ${item.currentlyAvailable ? "text-green-400" : "text-red-400"}`}>
                        {item.currentlyAvailable ? "In Stock" : "Out of Stock"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(item.options).map(([key, value]) => (
                      <span
                        key={key}
                        className="px-2 py-1 text-xs bg-[var(--bg-primary)] rounded border border-[var(--border)]"
                      >
                        <span className="text-[var(--text-secondary)]">{key}:</span>{" "}
                        <span className="font-medium">{value}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Fulfillments */}
          {order.fulfillments.length > 0 && (
            <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
              <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
                Shipments
              </h2>
              <div className="space-y-4">
                {order.fulfillments.map((fulfillment, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium">Shipment {idx + 1}</div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        {fulfillment.item_ids.length} item{fulfillment.item_ids.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                    {fulfillment.tracking_id.map((trackingId, tidx) => (
                      <div 
                        key={tidx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="text-[var(--text-secondary)]">Tracking:</span>
                        <span className="font-mono text-[var(--accent)]">{trackingId}</span>
                      </div>
                    ))}
                    <div className="mt-3 text-xs text-[var(--text-secondary)]">
                      Items: {fulfillment.item_ids.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Shipping Address
            </h2>
            <div className="space-y-1 text-sm">
              <div>{order.address.address1}</div>
              {order.address.address2 && <div>{order.address.address2}</div>}
              <div>
                {order.address.city}, {order.address.state} {order.address.zip}
              </div>
              <div className="text-[var(--text-secondary)]">{order.address.country}</div>
            </div>
          </section>

          {/* Payment History */}
          <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Payment History
            </h2>
            <div className="space-y-3">
              {order.payment_history.map((payment, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      payment.transaction_type === "refund" ? "text-red-400" : "text-green-400"
                    }`}>
                      {payment.transaction_type === "refund" ? "Refund" : "Payment"}
                    </span>
                    <span className="font-mono font-semibold">
                      {payment.transaction_type === "refund" ? "-" : ""}${payment.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-[var(--text-secondary)] font-mono truncate">
                    {payment.payment_method_id}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Copy */}
          <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Quick Copy
            </h2>
            <div className="space-y-3">
              <CopyField label="Order ID" value={order.order_id} />
              <CopyField label="User ID" value={order.user_id} />
              {order.fulfillments[0]?.tracking_id[0] && (
                <CopyField label="Tracking" value={order.fulfillments[0].tracking_id[0]} />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
