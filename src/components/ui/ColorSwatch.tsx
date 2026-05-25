import { cn } from "@/lib/utils";

interface Props {
  hex: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  ariaLabel?: string;
}

/**
 * Circular color swatch with label below. Never relies on color alone.
 * 44x44 target meets WCAG 2.1 AA touch size.
 */
export function ColorSwatch({ hex, label, selected, onClick, ariaLabel }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={ariaLabel ?? label}
      className={cn(
        "group flex flex-col items-center gap-1.5 outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1",
      )}
    >
      <span
        className={cn(
          "h-11 w-11 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all",
          selected
            ? "ring-foreground scale-105"
            : "ring-border hover:ring-foreground/40",
        )}
        style={{ backgroundColor: hex }}
      />
      <span className="text-[11px] font-medium text-foreground/80">{label}</span>
    </button>
  );
}
