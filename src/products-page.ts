import "./style.css";
import "./rtl.css";
import "./products.css";
import { catalog, catalogCategories, filterCatalog } from "./catalog.ts";
import type { CatalogCategory, CatalogItem } from "./catalog.ts";
import { getLocale, translate } from "./i18n.ts";
import { initializeLocalization, setMessage } from "./localization.ts";
import {
  footerMarkup,
  headerMarkup,
  initializeNavigation,
} from "./site-shell.ts";
import { arrow, element, escapeHtml, flower } from "./ui.ts";
import { bakery } from "./content.ts";

element<HTMLDivElement>("#app").innerHTML = `
  ${headerMarkup("products")}
  <main id="main">
    <section class="catalog-hero container" aria-labelledby="catalog-title">
      <div><p class="eyebrow">THE MIEL & CRÈME COLLECTION</p><h1 id="catalog-title">A world of<br><em>sweet possibilities.</em></h1><p>Beautiful cakes, little treats, and the tools to make your own magic.</p><a class="underlined-link" href="/#custom-cake">Dream up a custom cake ${arrow}</a></div>
      <div class="catalog-hero-image"><img src="/images/celebration-cake.jpg" width="800" height="1384" alt="Pink drip birthday cake with colorful sprinkles" fetchpriority="high" /><span class="catalog-hero-flower">${flower}</span><span class="catalog-hero-caption">A little inspiration for every celebration.</span></div>
    </section>
    <section class="catalog-section container" aria-labelledby="collection-title">
      <div class="catalog-heading"><div><p class="eyebrow">FIND YOUR NEXT LITTLE JOY</p><h2 id="collection-title">Made for <em>your kind of sweet.</em></h2></div><div class="catalog-search"><label for="product-search">Search the collection</label><input id="product-search" type="search" placeholder="Try chocolate, macarons, or candles…" dir="auto" autocomplete="off" /><button type="button" id="clear-search" class="text-button" hidden>Clear search</button></div></div>
      <div class="catalog-filters" role="group" aria-label="Filter the collection"><button type="button" class="filter-button" data-category="all" aria-pressed="true">All products</button>${Object.entries(
        catalogCategories,
      )
        .map(
          ([key, label]) =>
            `<button type="button" class="filter-button" data-category="${key}" aria-pressed="false">${label.en}</button>`,
        )
        .join("")}</div>
      <div class="catalog-meta"><p id="catalog-count" role="status"></p><p>Illustrative collection · Availability and quotes confirmed with the baker.</p></div>
      <div id="catalog-grid" class="catalog-grid" data-no-translate></div>
      <div id="catalog-empty" class="catalog-empty" hidden>${flower}<h3>No little joys found just yet.</h3><p>Try another search or explore the full collection.</p><button class="button button-outline" id="reset-catalog" type="button">Show all products ${arrow}</button></div>
    </section>
    <section class="catalog-custom"><div class="container"><div><p class="eyebrow">SOMETHING A LITTLE MORE YOU?</p><h2>Your idea. <em>A lovely starting point.</em></h2><p>Tell us your flavor, occasion, and the details you love. Let’s imagine something together.</p></div><a class="button" href="/#custom-cake">Let’s make a cake ${arrow}</a></div></section>
  </main>
  ${footerMarkup()}
  <dialog id="product-dialog" aria-labelledby="detail-title" aria-describedby="detail-description"><button type="button" class="dialog-close" aria-label="Close product details">×</button><div id="product-detail" data-no-translate></div></dialog>
`;

let category: CatalogCategory | "all" = "all";
let selected: CatalogItem | null = null;
let dialogTrigger: HTMLButtonElement | null = null;
const search = element<HTMLInputElement>("#product-search");
const grid = element<HTMLDivElement>("#catalog-grid");
const dialog = element<HTMLDialogElement>("#product-dialog");

function card(item: CatalogItem): string {
  const language = getLocale();
  return `<article class="catalog-card"><div class="catalog-card-image"><img src="${item.image}" alt="${escapeHtml(item.imageAlt[language])}" width="500" height="420" loading="lazy" /><span class="catalog-category">${escapeHtml(catalogCategories[item.category][language])}</span></div><div class="catalog-card-body"><h3>${escapeHtml(item.name[language])}</h3><p>${escapeHtml(item.description[language])}</p><button type="button" class="product-link" data-detail="${item.id}" aria-haspopup="dialog" aria-label="${escapeHtml(`${translate("View details")}: ${item.name[language]}`)}">${escapeHtml(translate("View details"))} ${arrow}</button></div></article>`;
}

function renderDetails(): void {
  if (!selected) return;
  const language = getLocale();
  const contactReady = bakery.email && !bakery.isDemo;
  const href = selected.inquiry
    ? `/?product=${encodeURIComponent(selected.id)}#custom-cake`
    : contactReady
      ? `mailto:${bakery.email}?subject=${encodeURIComponent(`${translate("Product inquiry")} — ${selected.name[language]}`)}`
      : "/#contact";
  element<HTMLDivElement>("#product-detail").innerHTML =
    `<div class="detail-layout"><img class="detail-image" src="${selected.image}" alt="${escapeHtml(selected.imageAlt[language])}" width="500" height="420" /><div class="detail-copy"><p class="eyebrow">${escapeHtml(catalogCategories[selected.category][language])}</p><h2 id="detail-title">${escapeHtml(selected.name[language])}</h2><p id="detail-description">${escapeHtml(selected.description[language])}</p><p class="detail-note">${escapeHtml(translate(selected.inquiry ? "An inspiration for your custom order. Confirm ingredients, dietary needs, the design, date, and a quote with the baker." : "An illustrative supply idea. Confirm availability, specifications, and pricing with the baker."))}</p><a class="button" href="${escapeHtml(href)}">${escapeHtml(translate(selected.inquiry ? "Start a cake inquiry" : "Ask about availability"))} ${arrow}</a><p class="detail-footnote">${escapeHtml(translate("No checkout or payment. Every order needs personal confirmation."))}</p></div></div>`;
}

function renderCatalog(): void {
  const items = filterCatalog(category, search.value);
  grid.innerHTML = items.map(card).join("");
  setMessage(
    element<HTMLElement>("#catalog-count"),
    "Showing {count} products.",
    { count: items.length },
  );
  element<HTMLElement>("#catalog-empty").hidden = items.length > 0;
  element<HTMLButtonElement>("#clear-search").hidden =
    search.value.length === 0;
}

document
  .querySelectorAll<HTMLButtonElement>("[data-category]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      category = button.dataset.category as CatalogCategory | "all";
      document
        .querySelectorAll("[data-category]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      renderCatalog();
    });
  });
search.addEventListener("input", renderCatalog);
element<HTMLButtonElement>("#clear-search").addEventListener("click", () => {
  search.value = "";
  renderCatalog();
  search.focus();
});
element<HTMLButtonElement>("#reset-catalog").addEventListener("click", () => {
  search.value = "";
  category = "all";
  document
    .querySelectorAll<HTMLButtonElement>("[data-category]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.category === "all"),
      ),
    );
  renderCatalog();
  search.focus();
});
grid.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest<HTMLButtonElement>("[data-detail]");
  if (!button) return;
  selected = catalog.find((item) => item.id === button.dataset.detail) ?? null;
  if (!selected) return;
  dialogTrigger = button;
  renderDetails();
  dialog.showModal();
});
element<HTMLButtonElement>(".dialog-close").addEventListener("click", () =>
  dialog.close(),
);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const box = dialog.getBoundingClientRect();
    if (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => dialogTrigger?.focus());
initializeNavigation();
initializeLocalization(() => {
  renderCatalog();
  if (dialog.open) renderDetails();
});
