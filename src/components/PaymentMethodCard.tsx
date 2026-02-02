import type { PaymentMethod } from "@/lib/types";

interface PaymentMethodCardProps {
  method: PaymentMethod;
}

export function PaymentMethodCard({ method }: PaymentMethodCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]">
      {method.source === "credit_card" && (
        <>
          <div className="w-10 h-7 rounded bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
            <span className="text-[8px] font-bold text-white uppercase">{method.brand}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">
              {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last_four}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">Credit Card</div>
          </div>
        </>
      )}
      {method.source === "paypal" && (
        <>
          <div className="w-10 h-7 rounded bg-[#003087] flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">PP</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">PayPal</div>
            <div className="text-xs text-[var(--text-secondary)] font-mono">{method.id}</div>
          </div>
        </>
      )}
      {method.source === "gift_card" && (
        <>
          <div className="w-10 h-7 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">GC</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Gift Card</div>
            <div className="text-xs text-[var(--text-secondary)]">
              Balance: <span className="text-green-400">${method.balance.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
      <div className="text-xs text-[var(--text-secondary)] font-mono">
        {method.id}
      </div>
    </div>
  );
}
