import { bakery } from "./content.ts";
import { arrow, element, escapeHtml, flower, sparkle } from "./ui.ts";

export function headerMarkup(active: "home" | "products"): string {
  return `  <a class="skip-link" href="#main">Skip to content</a>
  <div class="announcement" role="region" aria-label="A little welcome">A little butter. A little love. A reason to celebrate. ${sparkle}</div>
  <header class="site-header"><div class="header-inner container">
    <a class="wordmark" href="/" aria-label="${escapeHtml(bakery.name)} home">${flower}<span><bdi lang="fr">${escapeHtml(bakery.name)}</bdi><small>CAKES & LITTLE JOYS</small></span></a>
    <button class="menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="main-nav"><span></span><span></span></button>
    <nav id="main-nav" class="main-nav" aria-label="Main navigation"><a href="/products.html" ${active === "products" ? 'aria-current="page"' : ""}>Products</a><a href="/#our-story">Our philosophy</a><a href="/#custom-cake">Custom cakes</a><a href="/#contact">Say hello</a><a class="button header-cta" href="/#custom-cake">Let’s make a cake ${arrow}</a><select id="language-select" class="language-select" data-no-translate aria-label="Language"><option value="en" lang="en">English</option><option value="ar" lang="ar">العربية</option></select></nav>
  </div></header>
`;
}

export function footerMarkup(): string {
  return `  <footer class="site-footer"><div class="container footer-top"><a href="#" class="footer-brand">${flower}<span>${escapeHtml(bakery.name)}</span></a><p>A little joy in every layer.</p><a href="/#custom-cake" class="footer-link">Let’s make something lovely ${arrow}</a></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} ${escapeHtml(bakery.name)}</span><span>${bakery.isDemo ? "A storefront preview, with a little love." : "Made for life’s sweet moments."}</span><a href="#">Back to the top ↑</a></div></footer>
`;
}

export function initializeNavigation(): void {
  const menuToggle = element<HTMLButtonElement>(".menu-toggle");
  const navigation = element<HTMLElement>("#main-nav");
  function closeNavigation(): void {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  }
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    navigation.classList.toggle("is-open", open);
  });
  navigation
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeNavigation));
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuToggle.getAttribute("aria-expanded") === "true"
    ) {
      closeNavigation();
      menuToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (
      event.target instanceof Node &&
      !navigation.contains(event.target) &&
      !menuToggle.contains(event.target)
    )
      closeNavigation();
  });
  window
    .matchMedia("(min-width: 1051px)")
    .addEventListener("change", closeNavigation);
}
