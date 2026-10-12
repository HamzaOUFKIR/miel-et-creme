import "./style.css";
import "./rtl.css";
import {
  headerMarkup,
  footerMarkup,
  initializeNavigation,
} from "./site-shell.ts";
import { bakery, products } from "./content.ts";
import { initializeOrderForm, orderFormMarkup } from "./order-form.ts";
import { arrow, element, escapeHtml, flower, sparkle } from "./ui.ts";
import type { Product } from "./types.ts";
import { initializeLocalization, setMessage } from "./localization.ts";
import { catalog } from "./catalog.ts";
import { getLocale, translate } from "./i18n.ts";

function productCard(product: Product): string {
  return `<article class="product-card" data-category="${product.category}"><div class="product-image"><img src="${product.image}" alt="${escapeHtml(product.imageAlt)}" width="600" height="650" loading="lazy" /><span class="product-tag">${product.tag}</span><button class="product-pick" data-product="${product.id}" aria-label="Request ${escapeHtml(product.name)}">${arrow}</button></div><div class="product-info"><h3>${product.name}</h3><p>${product.description}</p><button class="product-link" data-product="${product.id}">Make it yours <span aria-hidden="true">↗</span></button></div></article>`;
}

const contactReady = Boolean(bakery.email) && !bakery.isDemo;

element<HTMLDivElement>("#app").innerHTML = `
  ${headerMarkup("home")}
  <main id="main">
    <section class="hero container" aria-labelledby="hero-title">
      <div class="hero-copy"><p class="eyebrow"><span class="tiny-line"></span> FOR LIFE’S SWEET LITTLE MOMENTS</p><h1 id="hero-title">A little joy<br>in every <em>layer.</em></h1><p class="hero-description">Beautiful cakes. Thoughtful little details.<br>Something sweet for the moments that matter.</p><div class="hero-actions"><a href="#our-bakes" class="button">Find your sweet thing ${arrow}</a><a href="#custom-cake" class="underlined-link">Dream up a custom cake</a></div><div class="hero-signoff">${flower}<span>Made to celebrate.<br><strong>Meant to be remembered.</strong></span></div></div>
      <div class="hero-visual"><div class="hero-photo"><img src="/images/berry-cake.jpg" alt="A white celebration cake layered with strawberries, raspberries, and blueberries" width="1400" height="2095" fetchpriority="high" /></div><div class="hero-stamp"><span>A LITTLE SLICE OF</span>${flower}<em>happiness</em></div><span class="hero-photo-note">A celebration in every slice.</span><span class="hero-sparkle">${sparkle}</span></div>
    </section>
    <div class="values-ribbon" aria-label="Our inspiration"><div class="container"><span>Little details, big smiles</span>${flower}<span>Your occasion, your cake</span>${flower}<span>A little less ordinary</span>${flower}<span>Always a reason to celebrate</span></div></div>
    <section id="our-bakes" class="bakes-section container" aria-labelledby="bakes-title"><div class="section-top"><div><p class="eyebrow">THE SWEET COLLECTION</p><h2 id="bakes-title">Love at first <em>bite.</em></h2></div><p>For birthdays, big days, and just-because days.<br>Find a little inspiration for your next celebration.</p></div>
      <div class="collection-controls"><div class="collection-filters" role="group" aria-label="Filter the collection"><button class="filter-button" data-filter="all" aria-pressed="true">All the lovely things</button><button class="filter-button" data-filter="cakes" aria-pressed="false">Celebration cakes</button><button class="filter-button" data-filter="little-treats" aria-pressed="false">Little treats</button></div><span class="collection-note">Your inspiration. Your own lovely twist.</span></div>
      <div class="product-grid">${products.map(productCard).join("")}</div><p id="collection-status" class="sr-only" role="status"></p>
      <div class="collection-browse"><a href="/products.html" class="button button-outline">Explore all products ${arrow}</a></div><p class="collection-disclaimer">An inspiration collection · Every request is tailored with the baker. Photography is illustrative.</p>
    </section>
    <section id="our-story" class="story-section" aria-labelledby="story-title"><div class="container story-grid"><div class="story-visual"><img src="/images/berry-tarts.jpg" alt="Homemade berry tarts with fresh fruit and flowers on a table set for tea" width="1100" height="733" loading="lazy" /><span class="story-caption">The sweetest things bring us together.</span></div><div class="story-copy"><p class="eyebrow">THE HEART OF MIEL & CRÈME</p><h2 id="story-title">More than a cake.<br><em>A little connection.</em></h2><p>The candles before the wish. The slice saved for someone you love. The “just one more bite” around the table.</p><p>That’s the feeling behind Miel & Crème: a love for beautiful bakes and the everyday magic of sharing something sweet.</p><a href="#custom-cake" class="underlined-link">Let’s make a little magic ${arrow}</a><div class="story-flower">${flower}</div></div></div></section>
    <section class="how-section container" aria-labelledby="how-title"><div class="how-heading"><p class="eyebrow">FROM A LITTLE IDEA TO A LOVELY CAKE</p><h2 id="how-title">Your cake. <em>Your kind of special.</em></h2></div><div class="process-grid"><article><span class="process-number">01</span><div><h3>Tell us your sweet idea</h3><p>A favorite flavor, a color, an occasion. Start with a little inspiration or a big dream.</p></div></article><article><span class="process-number">02</span><div><h3>Work out the lovely details</h3><p>Share your inquiry with the baker to confirm the design, date, dietary needs, and a quote.</p></div></article><article><span class="process-number">03</span><div><h3>Make room for a little joy</h3><p>Once everything is agreed, arrange pickup or delivery and look forward to your celebration.</p></div></article></div></section>
    <section id="custom-cake" class="custom-section" aria-labelledby="order-title"><div class="container custom-grid"><div class="order-intro"><p class="eyebrow">DREAM IT. TELL US. MAKE IT SWEET.</p><h2 id="order-title">A cake as<br><em>lovely as<br>your occasion.</em></h2><p>Tell us what you’re imagining.<br>A few little details are all it takes to start something special.</p><div class="order-flower">${flower}</div><div class="order-assurance"><span aria-hidden="true">♡</span><p>No checkout. No commitment.<br>Just the start of a sweet conversation.</p></div></div>${orderFormMarkup()}</div></section>
    <section id="contact" class="contact-section container" aria-labelledby="contact-title"><div class="contact-copy"><p class="eyebrow">LET’S TALK CAKE</p><h2 id="contact-title">A little question?<br><em>Say hello.</em></h2><p>Not sure where to start, or have something a little different in mind? There’s always room for a conversation.</p>${contactReady ? `<a class="contact-email" href="mailto:${escapeHtml(bakery.email)}">${escapeHtml(bakery.email)} ${arrow}</a>${bakery.phone ? `<a class="contact-phone" href="tel:${escapeHtml(bakery.phone.replace(/[^+\d]/g, ""))}">${escapeHtml(bakery.phone)}</a>` : ""}` : '<a class="underlined-link" href="#custom-cake">Put your ideas into an inquiry ↗</a><p class="contact-preview">Direct contact details are coming soon. For now, prepare and save your cake ideas above.</p>'}</div><div class="faq-list"><details><summary>How do I confirm my order?<span aria-hidden="true">+</span></summary><p>Prepare your inquiry, then share it with the baker. Your order is confirmed only when you both agree on the cake design, dietary requirements, price, date, and pickup or delivery details. Preparing an inquiry doesn’t reserve a date.</p></details><details><summary>Can I request a custom design?<span aria-hidden="true">+</span></summary><p>Absolutely — describe your colors, theme, cake message, and any ideas in the design notes. The baker will discuss what’s possible before confirming your order.</p></details><details><summary>What about allergies or dietary needs?<span aria-hidden="true">+</span></summary><p>Add your dietary requests and allergy details to your inquiry. Ingredients and preparation conditions must be discussed directly with the baker before placing an order. Dietary requests are subject to confirmation.</p></details><details><summary>Is pickup or delivery available?<span aria-hidden="true">+</span></summary><p>Choose your preference and date in the form. For delivery, include your city or area. The baker will confirm availability, timing, location, and any delivery fee with you.</p></details></div></section>
  </main>
  ${footerMarkup()}
`;

const orderForm = initializeOrderForm();
document
  .querySelectorAll<HTMLButtonElement>("[data-product]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const product = products.find(
        (item) => item.id === button.dataset.product,
      );
      if (product)
        orderForm.chooseProduct(
          product.flavor,
          product.category === "little-treats",
        );
    });
  });

document
  .querySelectorAll<HTMLButtonElement>("[data-filter]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-filter]")
        .forEach((filter) =>
          filter.setAttribute("aria-pressed", String(filter === button)),
        );
      let count = 0;
      document
        .querySelectorAll<HTMLElement>(".product-card")
        .forEach((card) => {
          const visible =
            button.dataset.filter === "all" ||
            card.dataset.category === button.dataset.filter;
          card.hidden = !visible;
          if (visible) count++;
        });
      setMessage(
        element<HTMLElement>("#collection-status"),
        "Showing {count} ideas in this collection.",
        { count },
      );
    });
  });

initializeNavigation();

initializeLocalization(() => orderForm.refreshLocale());

const requestedProduct = catalog.find(
  (item) => item.id === new URLSearchParams(location.search).get("product"),
);
if (requestedProduct?.inquiry) {
  orderForm.chooseProduct(
    requestedProduct.inquiry.flavor,
    requestedProduct.category === "little-treats",
  );
  element<HTMLSelectElement>("#tiers").value = requestedProduct.inquiry.style;
  const notes = element<HTMLTextAreaElement>("#notes");
  notes.value = `${translate("I'm interested in this item:")} ${requestedProduct.name[getLocale()]}`;
  notes.dispatchEvent(new Event("input"));
  if (requestedProduct.id === "wedding-berries")
    element<HTMLSelectElement>("#occasion").value = "Wedding";
}
