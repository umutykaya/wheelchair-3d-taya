import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/config.types";

const LOCALES: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "de", label: "DE" },
  { id: "fr", label: "FR" },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage ?? i18n.language).slice(0, 2) as Locale;

  return (
    <div
      role="group"
      aria-label={t("aria.languageSwitcher")}
      className="inline-flex overflow-hidden rounded-full border border-border text-[11px] font-medium"
    >
      {LOCALES.map((l) => {
        const active = l.id === current;
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => void i18n.changeLanguage(l.id)}
            aria-pressed={active}
            className={cn(
              "px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:bg-foreground/5",
            )}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
