import test from "node:test";
import assert from "node:assert/strict";
import {
  arabic,
  normalizePhoneDigits,
  resolveLocale,
  translate,
} from "../src/i18n.ts";
import { formatInquiry, validateInquiry } from "../src/inquiry.ts";
import { submitInquiry } from "../src/services/submit-inquiry.ts";
import {
  bakery,
  dietaryOptions,
  flavors,
  occasions,
  products,
  sizes,
  tiers,
} from "../src/content.ts";

const inquiry = {
  flavor: "Vanilla & berries",
  size: "10–14 servings",
  tiers: "One tier",
  occasion: "Birthday",
  date: "2099-05-24",
  fulfillment: "delivery",
  deliveryArea: "الدار البيضاء",
  dietary: ["Nut allergy"],
  notes: "ورود وردية، وعبارة «عيد ميلاد سعيد»",
  name: "مريم",
  email: "maryam@example.com",
  phone: "+٢١٢ ٦١٢ ٣٤٥ ٦٧٨",
  consent: true,
};

test("saved language wins over browser language and invalid preferences safely fall back", () => {
  assert.equal(resolveLocale("en", "ar-MA"), "en");
  assert.equal(resolveLocale("ar", "en-US"), "ar");
  assert.equal(resolveLocale(null, "ar-MA"), "ar");
  assert.equal(resolveLocale("invalid", "fr-FR"), "en");
  assert.equal(resolveLocale(null, "AR_sa"), "ar");
});

test("all product content and selectable labels have Arabic translations", () => {
  const labels = [
    ...flavors,
    ...sizes,
    ...tiers,
    ...occasions,
    ...dietaryOptions,
    ...products.flatMap((p) => [
      p.name,
      p.description,
      p.tag,
      p.imageAlt,
      `Request ${p.name}`,
    ]),
  ];
  for (const label of labels) {
    assert.ok(Object.hasOwn(arabic, label), label);
    assert.notEqual(translate(label, "ar"), label);
  }
});

test("Arabic and Persian digits validate without changing the supplied phone number", () => {
  assert.equal(normalizePhoneDigits("+٢١٢ ۶۱۲ ٣٤٥ ۶۷۸"), "+212 612 345 678");
  assert.deepEqual(validateInquiry(inquiry, "2026-10-12", "ar"), {});
  assert.equal(inquiry.phone, "+٢١٢ ٦١٢ ٣٤٥ ٦٧٨");
});

test("Arabic errors cover required fields, delivery, malformed dates, and consent", () => {
  const errors = validateInquiry(
    {
      ...inquiry,
      flavor: "",
      size: "",
      tiers: "",
      occasion: "",
      date: "2000-01-01",
      deliveryArea: "",
      name: "",
      email: "",
      phone: "abc",
      consent: false,
    },
    "2026-10-12",
    "ar",
  );
  assert.equal(Object.keys(errors).length, 10);
  for (const error of Object.values(errors))
    assert.match(error, /[\u0600-\u06ff]/);
  assert.match(errors.date, /لاحق/);
});

test("localized summaries translate labels and choices while preserving customer text", () => {
  const original = structuredClone(inquiry);
  const summary = formatInquiry(inquiry, "ar");
  for (const value of [
    "الاسم: مريم",
    "فانيليا وتوت",
    "حساسية من المكسرات",
    inquiry.notes,
    inquiry.email,
    inquiry.phone,
    inquiry.date,
    inquiry.deliveryArea,
  ])
    assert.ok(summary.includes(value), value);
  assert.ok(!summary.includes("Vanilla & berries"));
  assert.deepEqual(inquiry, original);
  assert.ok(formatInquiry(inquiry, "en").includes("Name: مريم"));
});

test("Arabic email handoff has an encoded Arabic subject and unchanged customer details", async () => {
  const original = { ...bakery };
  try {
    bakery.email = "baker@example.com";
    bakery.isDemo = false;
    const receipt = await submitInquiry(inquiry, "ar");
    assert.equal(receipt.status, "prepared");
    const url = new URL(receipt.emailUrl);
    assert.match(url.searchParams.get("subject"), /استفسار عن كيك.*عيد ميلاد/);
    assert.equal(url.searchParams.get("body"), formatInquiry(inquiry, "ar"));
  } finally {
    Object.assign(bakery, original);
  }
});

test("dynamic messages use Arabic number formatting and keep unknown copy intact", () => {
  assert.equal(translate("{count} / 2,000", "ar", { count: 25 }), "٢٥ / ٢٬٠٠٠");
  assert.equal(
    translate("Customer text <b>محمد</b>", "ar"),
    "Customer text <b>محمد</b>",
  );
});
