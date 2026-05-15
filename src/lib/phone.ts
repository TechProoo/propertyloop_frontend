import { parsePhoneNumberFromString } from "libphonenumber-js";

const DEFAULT_COUNTRY = "NG";

function parse(phone: string | null | undefined) {
  if (!phone) return null;
  const trimmed = String(phone).trim();
  if (!trimmed) return null;
  const parsed = parsePhoneNumberFromString(trimmed, DEFAULT_COUNTRY);
  if (!parsed || !parsed.isValid()) return null;
  return parsed;
}

/** Returns a safe `tel:` URL (E.164) or undefined when the input is unusable. */
export function formatTel(phone: string | null | undefined): string | undefined {
  const parsed = parse(phone);
  if (!parsed) return undefined;
  return `tel:${parsed.number}`;
}

/** Returns a human-friendly international format, or the raw input as a fallback. */
export function formatPhoneDisplay(phone: string | null | undefined): string {
  const parsed = parse(phone);
  if (!parsed) return phone ?? "";
  return parsed.formatInternational();
}
