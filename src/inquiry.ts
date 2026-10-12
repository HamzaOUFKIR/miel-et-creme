import { dietaryOptions, flavors, occasions, sizes, tiers } from "./content.ts";
import type { InquiryData, ValidationErrors, FieldName } from "./types.ts";
import { normalizePhoneDigits, translate } from "./i18n.ts";
import type { Locale } from "./i18n.ts";

export const stepFields: readonly (readonly FieldName[])[] = [
  ["flavor", "size", "tiers", "dietary", "notes"],
  ["occasion", "date", "fulfillment", "deliveryArea"],
  ["name", "email", "phone", "consent"],
];

export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00`);
  return !Number.isNaN(parsed.getTime()) && localDate(parsed) === value;
}

export function validateInquiry(
  data: InquiryData,
  today = localDate(),
  language: Locale = "en",
): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!(flavors as readonly string[]).includes(data.flavor))
    errors.flavor = "Choose a flavor, or select “Help me choose”.";
  if (!(sizes as readonly string[]).includes(data.size))
    errors.size = "Choose how many people you’d like to serve.";
  if (!(tiers as readonly string[]).includes(data.tiers))
    errors.tiers = "Choose your cake style, or let us help you decide.";
  if (!(occasions as readonly string[]).includes(data.occasion))
    errors.occasion = "Tell us what you’re celebrating.";
  if (!isRealDate(data.date))
    errors.date = "Choose a valid date for your celebration.";
  else if (data.date < today)
    errors.date = "Please choose today or a future date.";
  if (!["pickup", "delivery"].includes(data.fulfillment))
    errors.fulfillment = "Choose pickup or delivery.";
  if (data.fulfillment === "delivery" && data.deliveryArea.trim().length < 2)
    errors.deliveryArea =
      "Add your city or area so the baker can check delivery.";
  else if (data.deliveryArea.length > 200)
    errors.deliveryArea = "Keep your delivery area under 200 characters.";
  if (
    data.dietary.some(
      (value) => !(dietaryOptions as readonly string[]).includes(value),
    )
  )
    errors.dietary = "Choose one of the listed dietary requests.";
  if (data.notes.length > 2000)
    errors.notes = "Keep your design notes under 2,000 characters.";
  if (data.name.trim().length < 2)
    errors.name = "Please enter your name (at least 2 characters).";
  else if (data.name.length > 100)
    errors.name = "Keep your name under 100 characters.";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) ||
    data.email.length > 254
  )
    errors.email = "Enter a valid email address, such as you@example.com.";
  if (
    data.phone.trim() &&
    (!/^[+\d\s().-]+$/.test(normalizePhoneDigits(data.phone)) ||
      normalizePhoneDigits(data.phone).replace(/\D/g, "").length < 7 ||
      normalizePhoneDigits(data.phone).replace(/\D/g, "").length > 15)
  )
    errors.phone =
      "Enter a valid phone number, including your country code if needed.";
  if (!data.consent)
    errors.consent =
      "Please confirm that the baker may contact you about this inquiry.";
  for (const field of Object.keys(errors) as FieldName[]) {
    const message = errors[field];
    if (message) errors[field] = translate(message, language);
  }
  return errors;
}

export function formatInquiry(
  data: InquiryData,
  language: Locale = "en",
): string {
  const t = (message: string): string => translate(message, language);
  const row = (label: string, value: string): string => `${t(label)}: ${value}`;
  return [
    t("A little something special — cake inquiry"),
    "",
    row("Name", data.name.trim()),
    row("Email", data.email.trim()),
    row("Phone", data.phone.trim() || t("Not provided")),
    "",
    row("Flavor", t(data.flavor)),
    row("Size", t(data.size)),
    row("Style", t(data.tiers)),
    row("Occasion", t(data.occasion)),
    row("Preferred date", data.date),
    row("Collection", t(data.fulfillment === "pickup" ? "Pickup" : "Delivery")),
    ...(data.fulfillment === "delivery"
      ? [row("Delivery area", data.deliveryArea.trim())]
      : []),
    row(
      "Dietary requests",
      data.dietary.map(t).join(language === "ar" ? "، " : ", ") ||
        t("None specified"),
    ),
    row(
      "Design notes",
      data.notes.trim() || t("Let’s dream something up together."),
    ),
    "",
    t(
      "Please confirm availability, dietary requirements, the design, and a quote.",
    ),
    t("I understand this is an inquiry, not a confirmed order."),
    t("I agree to be contacted about this inquiry."),
  ].join("\n");
}
