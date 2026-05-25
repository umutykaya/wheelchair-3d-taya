import { cn } from "@/lib/utils";

interface Props {
  label: string;
  selected: boolean;
  onClick: () => void;
  description?: string;
  priceDelta?: number;
  formatPrice?: (n: number) => string;
}

/**
 * Rectangular pill button for non-color choices (finish, materials, styles).
 */
export function ChoiceButton({
  label,
  selected,
  onClick,
  description,
  priceDelta,
  formatPrice,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-start justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left",
        "transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-foreground bg-foreground/5"
          : "border-border hover:border-foreground/40",
      )}
    >
      <span className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <span className="text-[11px] text-muted-foreground">{description}</span>
        )}
      </span>
      {priceDelta !== undefined && priceDelta > 0 && formatPrice && (
        <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
          +{formatPrice(priceDelta)}
        </span>
      )}
    </button>
  );
}
