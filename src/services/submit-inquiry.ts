import { bakery } from "../content.ts";
import { formatInquiry, validateInquiry } from "../inquiry.ts";
import type { InquiryData, InquiryReceipt } from "../types.ts";
import { getLocale, translate } from "../i18n.ts";
import type { Locale } from "../i18n.ts";

/**
 * The single integration boundary for a future form service or backend.
 * Today this prepares a local inquiry. It does not transmit or store customer data.
 * Replace this body with an awaited fetch when a real endpoint is available.
 * Return status: 'submitted' and emailUrl: null only after the service confirms
 * success. The UI already supports both prepared and submitted receipts.
 */
export async function submitInquiry(
  data: InquiryData,
  language: Locale = getLocale(),
): Promise<InquiryReceipt> {
  if (Object.keys(validateInquiry(data)).length > 0) {
    throw new Error("Please check the highlighted details and try again.");
  }
  const summary = formatInquiry(data, language);
  return {
    status: "prepared",
    summary,
    emailUrl:
      bakery.email && !bakery.isDemo
        ? `mailto:${bakery.email}?subject=${encodeURIComponent(`${translate("Cake inquiry", language)} — ${translate(data.occasion, language)}, ${data.date}`)}&body=${encodeURIComponent(summary)}`
        : null,
  };
}
