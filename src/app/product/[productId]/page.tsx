import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db";
import { CopyField } from "@/components/CopyField";

interface PageProps {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ item?: string }>;
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { productId } = await params;
  const { item: highlightedItemId } = await searchParams;
  const product = getProductById(productId);

  if (!product) {
    notFound();
  }

  const variants = Object.values(product.variants);
  const availableCount = variants.filter((v) => v.available).length;

  // Get all unique option keys across variants
  const optionKeys = [...new Set(variants.flatMap((v) => Object.keys(v.options)))];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--text-secondary)]">
        <a href="/" className="hover:text-[var(--accent)]">Home</a>
        <span className="mx-2">/</span>
        <span className="text-[var(--text-primary)]">{product.name}</span>
      </nav>

      {/* Product Header */}
      <header className="p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 text-[var(--text-secondary)] font-mono text-sm">
              Product ID: {product.product_id}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-[var(--text-secondary)]">Variants</div>
            <div className="text-2xl font-bold">
              <span className="text-green-400">{availableCount}</span>
              <span className="text-[var(--text-secondary)]"> / {variants.length}</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)]">available</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Price Range</div>
            <div className="mt-1 text-xl font-semibold font-mono">
              ${Math.min(...variants.map((v) => v.price)).toFixed(2)} - ${Math.max(...variants.map((v) => v.price)).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Options</div>
            <div className="mt-1 text-xl font-semibold">{optionKeys.length}</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Option Types</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {optionKeys.map((key) => (
                <span
                  key={key}
                  className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] rounded border border-[var(--border)]"
                >
                  {key}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Variants Table */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          All Variants ({variants.length})
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Item ID</th>
                {optionKeys.map((key) => (
                  <th key={key} className="text-left py-3 px-4 font-medium text-[var(--text-secondary)] capitalize">
                    {key}
                  </th>
                ))}
                <th className="text-right py-3 px-4 font-medium text-[var(--text-secondary)]">Price</th>
                <th className="text-center py-3 px-4 font-medium text-[var(--text-secondary)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr
                  key={variant.item_id}
                  className={`border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors
                    ${highlightedItemId === variant.item_id ? "bg-[var(--accent)]/10 border-[var(--accent)]/30" : ""}`}
                >
                  <td className="py-3 px-4 font-mono text-xs">
                    {highlightedItemId === variant.item_id && (
                      <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] mr-2" />
                    )}
                    {variant.item_id}
                  </td>
                  {optionKeys.map((key) => (
                    <td key={key} className="py-3 px-4">
                      {variant.options[key] || "—"}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right font-mono">${variant.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        variant.available
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {variant.available ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Copy */}
      <section className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
          Quick Copy
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CopyField label="Product ID" value={product.product_id} />
          <CopyField label="Product Name" value={product.name} />
          {highlightedItemId && <CopyField label="Highlighted Item ID" value={highlightedItemId} />}
        </div>
      </section>
    </div>
  );
}
