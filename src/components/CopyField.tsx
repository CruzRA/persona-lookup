"use client";

interface CopyFieldProps {
  label: string;
  value: string;
}

export function CopyField({ label, value }: CopyFieldProps) {
  const handleCopy = () => {
    navigator.clipboard?.writeText(value);
  };

  return (
    <div className="space-y-1">
      <div className="text-xs text-[var(--text-secondary)]">{label}</div>
      <div
        className="px-3 py-2 bg-[var(--bg-tertiary)] rounded border border-[var(--border)] 
                   text-sm font-mono truncate cursor-pointer hover:border-[var(--accent)] transition-colors"
        title={`Click to copy: ${value}`}
        onClick={handleCopy}
      >
        {value}
      </div>
    </div>
  );
}
