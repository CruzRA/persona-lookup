import type { Order } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const totalAmount = order.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <a
      href={`/order/${order.order_id.replace("#", "")}`}
      className="block p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg
                 hover:border-[var(--accent)] hover:bg-[var(--bg-tertiary)] transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono font-semibold text-[var(--accent)] group-hover:text-[var(--accent-hover)]">
            {order.order_id}
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-2">
        {order.items.slice(0, 3).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)] truncate flex-1 mr-4">{item.name}</span>
            <span className="font-mono">${item.price.toFixed(2)}</span>
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="text-xs text-[var(--text-secondary)]">
            +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">Total</span>
        <span className="font-semibold font-mono">${totalAmount.toFixed(2)}</span>
      </div>

      {order.fulfillments.length > 0 && order.fulfillments[0].tracking_id.length > 0 && (
        <div className="mt-2 text-xs text-[var(--text-secondary)]">
          <span className="opacity-60">Tracking:</span>{" "}
          <span className="font-mono">{order.fulfillments[0].tracking_id[0]}</span>
        </div>
      )}
    </a>
  );
}
