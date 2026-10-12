import test from "node:test";
import assert from "node:assert/strict";
import { formatInquiry, localDate, validateInquiry } from "../src/inquiry.ts";
import { submitInquiry } from "../src/services/submit-inquiry.ts";
import { bakery } from "../src/content.ts";

const valid = {
  flavor: "Vanilla & berries",
  size: "10–14 servings",
  tiers: "One tier",
  occasion: "Birthday",
  date: "2099-05-24",
  fulfillment: "pickup",
  deliveryArea: "",
  dietary: [],
  notes: "Pink flowers and a little birthday message.",
  name: "Alex Martin",
  email: "alex@example.com",
  phone: "",
  consent: true,
};

test("a complete pickup inquiry allows optional contact and dietary fields to stay empty", () => {
  assert.deepEqual(validateInquiry(valid, "2026-10-12"), {});
});

test("required details produce field-specific messages", () => {
  const errors = validateInquiry({
    ...valid,
    flavor: "",
    size: "",
    tiers: "",
    occasion: "",
    date: "",
    name: " ",
    email: "alex@",
    consent: false,
  });
  for (const field of [
    "flavor",
    "size",
    "tiers",
    "occasion",
    "date",
    "name",
    "email",
    "consent",
  ])
    assert.ok(errors[field], field);
});

test("dates use a real calendar, allow today, and reject a past date", () => {
  assert.equal(
    validateInquiry({ ...valid, date: "2026-10-12" }, "2026-10-12").date,
    undefined,
  );
  for (const date of [
    "2026-10-11",
    "2027-02-29",
    "2026-04-31",
    "2026-13-10",
    "tomorrow",
    "2026-1-2",
  ]) {
    assert.ok(validateInquiry({ ...valid, date }, "2026-10-12").date, date);
  }
  assert.equal(
    validateInquiry({ ...valid, date: "2028-02-29" }, "2026-10-12").date,
    undefined,
  );
});

test("local dates preserve the customer calendar date near midnight", () => {
  assert.equal(localDate(new Date(2026, 9, 12, 0, 1)), "2026-10-12");
  assert.equal(localDate(new Date(2026, 9, 12, 23, 59)), "2026-10-12");
});

test("delivery requires an area; pickup neither requires nor includes a stale area", () => {
  assert.ok(
    validateInquiry({ ...valid, fulfillment: "delivery" }).deliveryArea,
  );
  assert.equal(
    validateInquiry({
      ...valid,
      fulfillment: "delivery",
      deliveryArea: "Brussels",
    }).deliveryArea,
    undefined,
  );
  assert.ok(
    !formatInquiry({ ...valid, deliveryArea: "Brussels" }).includes("Brussels"),
  );
  assert.ok(
    formatInquiry({
      ...valid,
      fulfillment: "delivery",
      deliveryArea: "Brussels",
    }).includes("Delivery area: Brussels"),
  );
});

test("rejects malformed choices, oversized text, and invalid optional phone numbers", () => {
  const errors = validateInquiry({
    ...valid,
    flavor: "<script>",
    dietary: ["Invented"],
    fulfillment: "mail",
    notes: "x".repeat(2001),
    phone: "call me",
  });
  for (const field of ["flavor", "dietary", "fulfillment", "notes", "phone"])
    assert.ok(errors[field]);
  assert.equal(
    validateInquiry({ ...valid, phone: "+32 (470) 12 34 56" }).phone,
    undefined,
  );
});

test("summary includes design, allergy, contact, and confirmation requirements", () => {
  const summary = formatInquiry({
    ...valid,
    dietary: ["Nut allergy"],
    notes: "No nuts. Add “Happy birthday, Léa!”",
  });
  for (const text of [
    "Nut allergy",
    "Happy birthday, Léa!",
    "alex@example.com",
    "2099-05-24",
    "not a confirmed order",
  ])
    assert.ok(summary.includes(text));
});

test("demo submission prepares locally and never claims an inquiry was sent", async () => {
  const receipt = await submitInquiry(valid);
  assert.equal(receipt.status, "prepared");
  assert.equal(receipt.emailUrl, null);
  assert.equal(receipt.summary, formatInquiry(valid));
});

test("submission rejects invalid data before producing a receipt", async () => {
  await assert.rejects(
    submitInquiry({ ...valid, email: "invalid" }),
    /check the highlighted details/,
  );
});

test("configured contact produces an encoded email draft, without sending", async () => {
  const original = { ...bakery };
  try {
    bakery.email = "baker@example.com";
    bakery.isDemo = false;
    const receipt = await submitInquiry({
      ...valid,
      notes: "Roses & cream + a #1 topper",
    });
    assert.equal(receipt.status, "prepared");
    const url = new URL(receipt.emailUrl);
    assert.equal(url.pathname, "baker@example.com");
    assert.equal(url.searchParams.get("body"), receipt.summary);
    assert.ok(url.searchParams.get("subject").includes("Birthday"));
  } finally {
    Object.assign(bakery, original);
  }
});
