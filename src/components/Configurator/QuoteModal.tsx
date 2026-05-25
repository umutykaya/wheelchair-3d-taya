import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useConfigStore } from "@/store/useConfigStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  role: "user" | "dealer";
  notes: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function QuoteModal({ open, onClose }: Props) {
  const { t } = useTranslation();
  const config = useConfigStore((s) => s.config);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    role: "user",
    notes: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (form.name.trim().length < 2) next.name = t("quote.errors.name");
    if (!EMAIL_RE.test(form.email)) next.email = t("quote.errors.email");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // In production this would POST to /api/quote. For now we log + show success.
    // eslint-disable-next-line no-console
    console.info("[quote.submit]", { ...form, config });
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setErrors({});
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("quote.submitted")}</DialogTitle>
              <DialogDescription>{t("quote.submittedBody")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleClose}>{t("actions.close")}</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t("quote.title")}</DialogTitle>
              <DialogDescription>{t("quote.subtitle")}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="q-name">{t("quote.name")}</Label>
                <Input
                  id="q-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "q-name-err" : undefined}
                />
                {errors.name && (
                  <span id="q-name-err" className="text-[12px] text-red-600">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="q-email">{t("quote.email")}</Label>
                <Input
                  id="q-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "q-email-err" : undefined}
                />
                {errors.email && (
                  <span id="q-email-err" className="text-[12px] text-red-600">
                    {errors.email}
                  </span>
                )}
              </div>

              <fieldset className="flex flex-col gap-1.5">
                <legend className="text-sm font-medium">{t("quote.role")}</legend>
                <div className="flex gap-2">
                  {(["user", "dealer"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm({ ...form, role: r })}
                      aria-pressed={form.role === r}
                      className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                        form.role === r
                          ? "border-foreground bg-foreground/5"
                          : "border-border hover:border-foreground/40"
                      }`}
                    >
                      {t(r === "user" ? "quote.roleUser" : "quote.roleDealer")}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="q-notes">{t("quote.notes")}</Label>
                <Textarea
                  id="q-notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                {t("actions.cancel")}
              </Button>
              <Button type="submit">{t("actions.submit")}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
