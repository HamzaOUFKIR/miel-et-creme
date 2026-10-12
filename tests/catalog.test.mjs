import test from "node:test";
import assert from "node:assert/strict";
import { catalog, filterCatalog } from "../src/catalog.ts";
import { flavors, tiers } from "../src/content.ts";

test("catalog search works in English and Arabic, including Arabic diacritics", () => {
  for (const query of ["MACARON", "ماكرون", "مَاكَرُون"]) {
    assert.deepEqual(
      filterCatalog("all", query).map((item) => item.id),
      ["macaron-moments"],
    );
  }
});
test("category and text filters combine and an empty query restores the category", () => {
  assert.equal(filterCatalog("baking-tools", "macaron").length, 0);
  assert.equal(filterCatalog("baking-tools", "").length, 3);
  assert.equal(filterCatalog("all", "   ").length, catalog.length);
  assert.equal(filterCatalog("all", "<script>missing</script>").length, 0);
});
test("catalog cake links map to valid inquiry choices while supplies stay separate", () => {
  assert.equal(new Set(catalog.map((item) => item.id)).size, catalog.length);
  for (const item of catalog) {
    if (item.inquiry) {
      assert.ok(flavors.includes(item.inquiry.flavor));
      assert.ok(tiers.includes(item.inquiry.style));
    } else assert.ok(["baking-tools", "decorations"].includes(item.category));
  }
});
