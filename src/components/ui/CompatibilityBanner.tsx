import { AlertCircle, Info, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { CompatibilityIssue } from "@/types/config.types";

interface Props {
  issues: CompatibilityIssue[];
}

const LEVEL_STYLES: Record<
  CompatibilityIssue["level"],
  { container: string; Icon: typeof Info }
> = {
  info: {
    container:
      "border-blue-200/60 bg-blue-50/80 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200",
    Icon: Info,
  },
  warning: {
    container:
      "border-amber-200/60 bg-amber-50/80 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200",
    Icon: AlertCircle,
  },
  incompatible: {
    container:
      "border-red-200/60 bg-red-50/80 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200",
    Icon: ShieldAlert,
  },
};

export function CompatibilityBanner({ issues }: Props) {
  const { t } = useTranslation();
  if (!issues.length) return null;

  return (
    <div className="flex flex-col gap-2">
      {issues.map((issue, i) => {
        const meta = LEVEL_STYLES[issue.level];
        const Icon = meta.Icon;
        return (
          <div
            key={`${issue.messageKey}-${i}`}
            role="alert"
            className={cn(
              "flex items-start gap-2.5 rounded-md border px-3 py-2 text-[12.5px] leading-relaxed",
              meta.container,
            )}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{t(issue.messageKey)}</span>
          </div>
        );
      })}
    </div>
  );
}
