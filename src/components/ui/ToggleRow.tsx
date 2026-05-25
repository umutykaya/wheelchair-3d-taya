import { cn } from "@/lib/utils";

interface Props {
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  priceDelta?: number;
  formatPrice?: (n: number) => string;
  description?: string;
}

export function ToggleRow({
  label,
  checked,
  onToggle,
  disabled,
  priceDelta,
  formatPrice,
  description,
}: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "flex w-full items-center justify-between rounded-lg border border-border px-3.5 py-2.5 text-left transition-colors",
        "hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <span className="flex flex-col">
        <span className="text-sm font-medium">{label}</span>
        {description && (
          <span className="text-[11px] text-muted-foreground">{description}</span>
        )}
        {priceDelta !== undefined && priceDelta > 0 && formatPrice && (
          <span className="text-[11px] text-muted-foreground">
            +{formatPrice(priceDelta)}
          </span>
        )}
      </span>
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          checked ? "bg-foreground" : "bg-muted",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all",
            checked ? "left-[18px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}
