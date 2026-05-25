export function mapLocale(lang: string): string {
  if (lang.startsWith("de")) return "de-DE";
  if (lang.startsWith("fr")) return "fr-FR";
  return "en-US";
}
