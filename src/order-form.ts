import {
  bakery,
  dietaryOptions,
  flavors,
  occasions,
  sizes,
  tiers,
} from "./content.ts";
import {
  formatInquiry,
  localDate,
  stepFields,
  validateInquiry,
} from "./inquiry.ts";
import { submitInquiry } from "./services/submit-inquiry.ts";
import { arrow, element, escapeHtml } from "./ui.ts";
import type { FieldName, InquiryData, ValidationErrors } from "./types.ts";
import { getLocale, translate } from "./i18n.ts";
import { setMessage } from "./localization.ts";

function options(values: readonly string[]): string {
  return (
    '<option value="">Select an option</option>' +
    values
      .map(
        (value) =>
          `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`,
      )
      .join("")
  );
}

function select(
  name: FieldName,
  label: string,
  values: readonly string[],
): string {
  return `<div class="field"><label for="${name}">${label} <span aria-hidden="true">*</span></label><select id="${name}" name="${name}" required aria-describedby="${name}-error">${options(values)}</select><span class="field-error" id="${name}-error"></span></div>`;
}

export function orderFormMarkup(): string {
  return `<div class="order-workspace">
    <form id="inquiry-form" novalidate>
      <ol class="form-progress" aria-label="Inquiry progress">
        <li data-progress="0" aria-current="step"><span>01</span> Your cake</li>
        <li data-progress="1"><span>02</span> The occasion</li>
        <li data-progress="2"><span>03</span> Your details</li>
      </ol>
      <div id="error-summary" class="error-summary" role="alert" hidden></div>
      <div class="form-step" data-step="0">
        <div class="step-heading"><h3 tabindex="-1">First, the delicious details.</h3><p>Have something in mind? Let’s start there.</p></div>
        <div class="field-grid">
          ${select("flavor", "Your favorite flavor", flavors)}
          ${select("size", "How many sweet tooths?", sizes)}
          ${select("tiers", "Cake style", tiers)}
        </div>
        <fieldset class="dietary-field"><legend>Dietary requests <span class="optional">(optional)</span></legend>
          <div class="dietary-options">${dietaryOptions.map((value, i) => `<label class="check-pill" for="dietary-${i}"><input type="checkbox" id="dietary-${i}" name="dietary" value="${escapeHtml(value)}" aria-describedby="dietary-hint dietary-error" /><span>${escapeHtml(value)}</span></label>`).join("")}</div>
          <p id="dietary-hint" class="field-hint">The baker will confirm ingredients and whether your dietary needs can be met before you order.</p>
          <span class="field-error" id="dietary-error"></span>
        </fieldset>
        <div class="field"><label for="notes">Make it yours <span class="optional">(optional)</span></label><textarea id="notes" name="notes" rows="3" maxlength="2000" placeholder="A color palette, a little message, a theme you love…" aria-describedby="notes-hint notes-error"></textarea><div class="field-meta"><span id="notes-hint">Design notes, allergy details, and little wishes.</span><span id="notes-count">0 / 2,000</span></div><span class="field-error" id="notes-error"></span></div>
      </div>
      <div class="form-step" data-step="1" hidden>
        <div class="step-heading"><h3 tabindex="-1">A date for something sweet.</h3><p>A few details to help plan your celebration.</p></div>
        <div class="field-grid">
          ${select("occasion", "What’s the occasion?", occasions)}
          <div class="field"><label for="date">Preferred date <span aria-hidden="true">*</span></label><input id="date" name="date" type="date" min="${localDate()}" required aria-describedby="date-hint date-error" /><span id="date-hint" class="field-hint">Subject to the baker’s availability.</span><span class="field-error" id="date-error"></span></div>
        </div>
        <fieldset class="fulfillment-field"><legend>How would you like your cake? <span aria-hidden="true">*</span></legend><div class="fulfillment-options"><label><input type="radio" name="fulfillment" value="pickup" checked aria-describedby="fulfillment-error" /><span><strong>Pick it up</strong><small>A little trip for a lovely treat.</small></span></label><label><input type="radio" name="fulfillment" value="delivery" aria-describedby="fulfillment-error" /><span><strong>Request delivery</strong><small>Location and fees to be confirmed.</small></span></label></div><span class="field-error" id="fulfillment-error"></span></fieldset>
        <div class="field" id="delivery-field" hidden><label for="deliveryArea">Delivery city or area <span aria-hidden="true">*</span></label><input id="deliveryArea" name="deliveryArea" type="text" autocomplete="address-level2" maxlength="200" placeholder="City and neighborhood" aria-describedby="deliveryArea-hint deliveryArea-error" /><span id="deliveryArea-hint" class="field-hint">No full address needed yet. The baker will confirm the delivery area.</span><span class="field-error" id="deliveryArea-error"></span></div>
        <div class="gentle-note">A little note: your date and delivery preference are requests. Your order is confirmed only after you and the baker agree on the details.</div>
      </div>
      <div class="form-step" data-step="2" hidden>
        <div class="step-heading"><h3 tabindex="-1">Let’s make it personal.</h3><p>How can the baker get in touch about your cake?</p></div>
        <div class="field"><label for="name">Your name <span aria-hidden="true">*</span></label><input id="name" name="name" autocomplete="name" maxlength="100" required placeholder="Your lovely name" aria-describedby="name-error" /><span class="field-error" id="name-error"></span></div>
        <div class="field-grid">
          <div class="field"><label for="email">Email address <span aria-hidden="true">*</span></label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required placeholder="you@example.com" aria-describedby="email-error" /><span class="field-error" id="email-error"></span></div>
          <div class="field"><label for="phone">Phone <span class="optional">(optional)</span></label><input id="phone" name="phone" type="tel" autocomplete="tel" maxlength="30" placeholder="Include your country code" aria-describedby="phone-error" /><span class="field-error" id="phone-error"></span></div>
        </div>
        <label class="consent-label"><input id="consent" name="consent" type="checkbox" required aria-describedby="consent-error" /><span>I agree to be contacted about my inquiry. I understand this is a request, and my order will need to be confirmed with the baker.</span></label><span class="field-error" id="consent-error"></span>
        <p class="privacy-note">Your details stay in this page until you choose to share your inquiry. No payment is collected.</p>
      </div>
      <div class="form-actions"><button type="button" id="previous-step" class="text-button" hidden>← Back</button><span class="required-note">* A little detail we need</span><button type="submit" class="button" id="next-step">The occasion ${arrow}</button></div>
      <p class="form-footnote">${bakery.isDemo || !bakery.email ? "Preview mode · Prepare and copy your inquiry. Sending is not connected yet." : "We’ll prepare your inquiry for you to send by email."}</p>
    </form>
    <section id="inquiry-result" class="inquiry-result" aria-labelledby="result-title" hidden>
      <span class="result-mark" aria-hidden="true">✓</span><p class="eyebrow">ONE STEP CLOSER TO SOMETHING SWEET</p><h3 id="result-title" tabindex="-1">Your inquiry is ready.</h3>
      <p id="result-explanation"></p>
      <label for="inquiry-summary" class="summary-label">Your cake, at a glance</label><textarea id="inquiry-summary" readonly rows="12"></textarea>
      <div class="result-actions"><a class="button" id="email-inquiry" hidden>Email your inquiry ${arrow}</a><button type="button" class="button" id="copy-inquiry">Copy inquiry ${arrow}</button><button type="button" class="button button-outline" id="download-inquiry">Save as text</button></div>
      <p id="copy-status" class="copy-status" role="status"></p><button type="button" class="text-button" id="edit-inquiry">← Edit my details</button>
    </section>
  </div>`;
}

export function initializeOrderForm(): {
  chooseProduct: (flavor: string, littleTreats: boolean) => void;
  refreshLocale: () => void;
} {
  const form = element<HTMLFormElement>("#inquiry-form");
  const next = element<HTMLButtonElement>("#next-step");
  const previous = element<HTMLButtonElement>("#previous-step");
  const errorSummary = element<HTMLElement>("#error-summary");
  const result = element<HTMLElement>("#inquiry-result");
  for (const id of ["name", "notes", "deliveryArea", "inquiry-summary"]) {
    element<HTMLElement>(`#${id}`).dir = "auto";
  }
  let currentStep = 0;
  let busy = false;
  let inquirySummary = "";
  let inquirySubmitted = false;
  let preparedData: InquiryData | null = null;

  function refreshLocale(): void {
    setMessage(element<HTMLElement>("#notes-count"), "{count} / 2,000", {
      count: element<HTMLTextAreaElement>("#notes").value.length,
    });
    if (!preparedData) return;
    inquirySummary = formatInquiry(preparedData, getLocale());
    element<HTMLTextAreaElement>("#inquiry-summary").value = inquirySummary;
    const emailLink = element<HTMLAnchorElement>("#email-inquiry");
    if (emailLink.hasAttribute("href")) {
      const emailUrl = new URL(emailLink.href);
      const subject = `${translate("Cake inquiry")} — ${translate(preparedData.occasion)}, ${preparedData.date}`;
      // mailto uses percent-encoded spaces, not form-encoded '+' characters.
      emailUrl.search = `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(inquirySummary)}`;
      emailLink.href = emailUrl.toString();
    }
  }

  function readData(): InquiryData {
    const data = new FormData(form);
    const value = (name: FieldName): string =>
      String(data.get(name) ?? "").trim();
    return {
      flavor: value("flavor"),
      size: value("size"),
      tiers: value("tiers"),
      occasion: value("occasion"),
      date: value("date"),
      fulfillment: value("fulfillment"),
      deliveryArea: value("deliveryArea"),
      dietary: data.getAll("dietary").map(String),
      notes: value("notes"),
      name: value("name"),
      email: value("email"),
      phone: value("phone"),
      consent: data.get("consent") === "on",
    };
  }

  function clearErrors(): void {
    form.querySelectorAll(".field-error").forEach((node) => {
      node.textContent = "";
    });
    form
      .querySelectorAll("[aria-invalid]")
      .forEach((node) => node.removeAttribute("aria-invalid"));
    errorSummary.hidden = true;
    errorSummary.textContent = "";
  }

  function showErrors(errors: ValidationErrors): void {
    clearErrors();
    const entries = Object.entries(errors);
    if (!entries.length) return;
    errorSummary.textContent =
      "A few details need a little attention. Please check the highlighted fields.";
    errorSummary.hidden = false;
    for (const [key, message] of entries) {
      element<HTMLElement>(`#${key}-error`, form).textContent = message;
      form
        .querySelectorAll(`[name="${key}"]`)
        .forEach((node) => node.setAttribute("aria-invalid", "true"));
    }
    form.querySelector<HTMLElement>(`[name="${entries[0]?.[0]}"]`)?.focus();
  }

  function showStep(step: number, focus = true): void {
    currentStep = step;
    clearErrors();
    form.querySelectorAll<HTMLElement>("[data-step]").forEach((node) => {
      node.hidden = Number(node.dataset.step) !== step;
    });
    form.querySelectorAll<HTMLElement>("[data-progress]").forEach((node) => {
      const index = Number(node.dataset.progress);
      node.classList.toggle("is-complete", index < step);
      if (index === step) node.setAttribute("aria-current", "step");
      else node.removeAttribute("aria-current");
    });
    previous.hidden = step === 0;
    next.innerHTML = `${["The occasion", "Your details", "Prepare my inquiry"][step]} ${arrow}`;
    if (focus)
      form.querySelector<HTMLElement>(`[data-step="${step}"] h3`)?.focus();
  }

  previous.addEventListener("click", () =>
    showStep(Math.max(0, currentStep - 1)),
  );
  form.addEventListener("change", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.name === "fulfillment") {
      const delivery = target.value === "delivery";
      element<HTMLElement>("#delivery-field").hidden = !delivery;
      element<HTMLInputElement>("#deliveryArea").required = delivery;
    }
  });
  element<HTMLTextAreaElement>("#notes").addEventListener("input", (event) => {
    const target = event.target as HTMLTextAreaElement;
    setMessage(element<HTMLElement>("#notes-count"), "{count} / 2,000", {
      count: target.value.length,
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy) return;
    element<HTMLInputElement>("#date").min = localDate();
    const data = readData();
    const allErrors = validateInquiry(data);
    const errors: ValidationErrors = {};
    for (const field of stepFields[currentStep] ?? [])
      if (allErrors[field]) errors[field] = allErrors[field];
    if (Object.keys(errors).length) {
      showErrors(errors);
      return;
    }
    if (currentStep < 2) {
      showStep(currentStep + 1);
      return;
    }
    // Revalidate earlier steps too, including a date that may now be in the past.
    if (Object.keys(allErrors).length) {
      const invalidStep = stepFields.findIndex((fields) =>
        fields.some((field) => allErrors[field]),
      );
      showStep(Math.max(0, invalidStep), false);
      const visibleErrors: ValidationErrors = {};
      for (const field of stepFields[currentStep] ?? [])
        if (allErrors[field]) visibleErrors[field] = allErrors[field];
      showErrors(visibleErrors);
      return;
    }
    busy = true;
    next.disabled = true;
    previous.disabled = true;
    form.setAttribute("aria-busy", "true");
    next.textContent = "Preparing your inquiry…";
    clearErrors();
    try {
      const receipt = await submitInquiry(data);
      preparedData = data;
      inquirySummary = receipt.summary;
      inquirySubmitted = receipt.status === "submitted";
      element<HTMLTextAreaElement>("#inquiry-summary").value = receipt.summary;
      const emailLink = element<HTMLAnchorElement>("#email-inquiry");
      const emailUrl = inquirySubmitted ? null : receipt.emailUrl;
      emailLink.hidden = !emailUrl;
      if (emailUrl) emailLink.href = emailUrl;
      else emailLink.removeAttribute("href");
      // A language switch while awaiting a future service must not leave the
      // summary or email draft in the language used when submission began.
      refreshLocale();
      element<HTMLElement>("#result-title").textContent = inquirySubmitted
        ? "Your inquiry has been sent."
        : "Your inquiry is ready.";
      element<HTMLElement>("#edit-inquiry").hidden = inquirySubmitted;
      element<HTMLElement>("#result-explanation").textContent = inquirySubmitted
        ? "The baker has received your inquiry and can contact you using the details you provided. Your order still needs confirmation of availability, design, dietary requirements, and a quote. Save a copy of your inquiry below."
        : emailUrl
          ? "Nothing has been sent yet. Open your email app to send these details to the baker, who will confirm availability and a quote. You can also copy or save your inquiry."
          : "Your details are prepared, but nothing has been sent. This preview has no baker’s contact connected yet. Copy or save your inquiry to share with the baker when contact details are available.";
      element<HTMLElement>("#copy-status").textContent = "";
      form.hidden = true;
      result.hidden = false;
      element<HTMLElement>("#result-title").focus();
    } catch (error: unknown) {
      errorSummary.textContent =
        error instanceof Error
          ? error.message
          : "We couldn’t prepare your inquiry. Your details are still here. Please try again.";
      errorSummary.hidden = false;
    } finally {
      busy = false;
      next.disabled = false;
      previous.disabled = false;
      form.removeAttribute("aria-busy");
      next.innerHTML = `Prepare my inquiry ${arrow}`;
    }
  });

  element<HTMLButtonElement>("#edit-inquiry").addEventListener("click", () => {
    result.hidden = true;
    form.hidden = false;
    showStep(0);
  });
  element<HTMLButtonElement>("#copy-inquiry").addEventListener(
    "click",
    async () => {
      const status = element<HTMLElement>("#copy-status");
      try {
        await navigator.clipboard.writeText(inquirySummary);
        status.textContent =
          "Copied! Your inquiry is ready to paste into a message.";
      } catch {
        const summary = element<HTMLTextAreaElement>("#inquiry-summary");
        summary.focus();
        summary.select();
        status.textContent =
          "Your browser couldn’t copy automatically. The text is selected — use your device’s copy command, or save it as a text file.";
      }
    },
  );
  element<HTMLButtonElement>("#download-inquiry").addEventListener(
    "click",
    () => {
      const url = URL.createObjectURL(
        new Blob([inquirySummary], { type: "text/plain;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "miel-et-creme-inquiry.txt";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      element<HTMLElement>("#copy-status").textContent = inquirySubmitted
        ? "Your copy of the inquiry is ready to save."
        : "Your inquiry is ready to save. Nothing has been sent to the baker.";
    },
  );
  return {
    refreshLocale,
    chooseProduct(flavor: string, littleTreats: boolean): void {
      if (busy) return;
      result.hidden = true;
      form.hidden = false;
      element<HTMLSelectElement>("#flavor").value = flavor;
      if (littleTreats)
        element<HTMLSelectElement>("#tiers").value = "Little treats";
      else if (element<HTMLSelectElement>("#tiers").value === "Little treats")
        element<HTMLSelectElement>("#tiers").value = "";
      showStep(0);
      element<HTMLElement>("#custom-cake").scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    },
  };
}
