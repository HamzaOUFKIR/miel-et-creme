# Miel & Crème

A responsive bakery storefront with a three-step cake inquiry flow. Built with **Vite, strict TypeScript, and plain HTML/CSS**. There are no runtime dependencies, backend, payment flow, or customer accounts.

## Run locally

Use Node.js **22.18+** (or a newer supported release).

```sh
npm install
npm run dev
```

Open the URL Vite prints (normally http://127.0.0.1:5173). On Windows PowerShell, use `npm.cmd` if script execution policy prevents running `npm`.

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

The production build is emitted to `dist/` and can be served by any static host. The app assumes hosting at the domain root. Vite builds both `/index.html` (the storefront and inquiry form) and `/products.html` (the complete collection), so the products page supports direct visits and refreshes without server routing rules.

## Project layout

```text
index.html                    Page metadata and Vite entry
products.html                 Products page entry
vite.config.ts                Multi-page production build configuration
src/
  main.ts                     Storefront and collection interactions
  site-shell.ts               Shared header, footer, and mobile navigation
  catalog.ts                  Typed bilingual product catalog and filtering
  products-page.ts            Product search, filters, and detail dialogs
  products.css                Product page and dialog styles
  style.css                   Responsive design and focus/motion styles
  rtl.css                     Arabic typography and language-switch styles
  i18n.ts                     Arabic messages and pure locale/number helpers
  localization.ts             In-place DOM translation and language preference
  content.ts                  Bakery configuration and typed content
  types.ts                    Content, form, validation, and receipt models
  inquiry.ts                  Pure validation and plain-text formatting
  order-form.ts               Accessible multi-step form and result controls
  services/submit-inquiry.ts   Single submission integration boundary
  ui.ts                       Small DOM, escaping, and icon helpers
public/
  images/                     Locally served illustrative photography
  fonts/                      Locally served fonts and their licenses
tests/inquiry.test.mjs         Node test runner coverage
tests/i18n.test.mjs            Locale, translation, and Arabic inquiry tests
tests/catalog.test.mjs         Bilingual search and inquiry mapping checks
```

## Bakery contact and content

The requested brand is **Miel & Crème**. Product names, descriptions, and photography are editable inspiration content, not a claim about an existing bakery menu. Update `src/content.ts` with the actual collection and public contact details.

Until a contact is supplied, `bakery.email` is empty and `bakery.isDemo` is `true`. The interface explicitly says that no inquiry has been sent. Customers can prepare, edit, copy, and download a text inquiry. Details remain in page memory; refreshing the page clears them. Only the language preference is saved in local storage. No customer data is persisted, and no analytics, third-party font requests, or network submission is used.

To enable email handoff, set the real `bakery.email` and set `bakery.isDemo` to `false`. An optional `bakery.phone` is also supported. The contact section will display those details, and the completed inquiry will offer **Email your inquiry**. This opens a draft in the customer’s email app; the customer still needs to send it. Copy and download remain available if a mail client is not configured or limits long mailto URLs. Sending an email does not confirm an order.

## Connect a backend or form service

Replace the implementation of `submitInquiry(data)` in **`src/services/submit-inquiry.ts`**. It is the only submission boundary called by the UI and currently returns a local `prepared` receipt. It revalidates the typed payload before returning.

When an endpoint exists, await its response and throw an error on failure so the form retains customer input and allows retry. Return `{ status: 'submitted', summary, emailUrl: null }` only after the service confirms receipt; the UI already handles this outcome. The integration remains contained in this function. Before launch, also replace the preview/privacy copy with your actual submission and data-handling terms. Never display “sent” solely because the customer clicked a button. Keep service credentials off the frontend, validate again on the server, and add appropriate abuse protection there.

## English and Arabic

Use the language dropdown at the end of the navigation to choose **English** or **العربية**. It displays the selected language; on mobile, open the navigation menu to access it. Modern Standard Arabic includes the storefront, product descriptions, image alternatives, navigation, form choices and placeholders, validation, FAQs, results, and inquiry summaries/email drafts. The brand remains **Miel & Crème**.

The page sets its `lang` and `dir` attributes and uses logical CSS positioning for right-to-left layouts. Noto Sans Arabic is served locally. Email, phone, and date inputs keep left-to-right formatting; names, notes, and delivery areas automatically follow the entered text. Phone validation accepts Western, Arabic-Indic, and Persian digits.

The selected language is saved as `miel-creme-language` in local storage. On a first visit, an Arabic browser preference selects Arabic; other browser languages select English. If storage is blocked, switching still works for the current visit. Switching preserves form entries, the current step, validation errors, selected collection filters, and prepared inquiries without resubmitting anything.

Translations live in `src/i18n.ts`, keyed by their authored English phrases. When changing or adding English copy, update its Arabic entry there as well. `src/localization.ts` translates known text and accessibility attributes in place, leaving input values and DOM controls intact. It observes newly rendered error/status copy; parameterized messages use the typed `setMessage` helper. Canonical select values stay unchanged for the future backend. `formatInquiry(data, locale)` localizes exported text while preserving the customer's words; `submitInquiry(data, locale)` accepts an optional locale and defaults to the active language.

## Products page

Open **Products** in the navbar or **Explore all products** below the homepage collection. The page presents 18 illustrative items across celebration cakes, layers and cheesecakes, little treats, baking tools, and finishing touches. Edit `src/catalog.ts` to replace the sample collection with real products; names, descriptions, categories, and image alternatives have explicit English and Arabic content.

Category filters combine with search, which matches both languages and ignores case and diacritics. An empty-results state provides a reset. Product details open in a native modal dialog with Escape support and focus return. Cake inquiries link to `/?product=<catalog-id>#custom-cake`, prefilling the flavor, style, and product name. Supply inquiries lead to the contact section, or open an email draft when a real baker email is configured. There is no cart, checkout, invented price, or stock guarantee.

## Behavior and accessibility

- Filters show cakes or little treats. Selecting a product prefills its flavor and style.
- Three form steps collect flavor, servings, tiers, dietary requests, design notes, occasion, preferred date, fulfillment, delivery area, and contact details.
- Validation catches missing fields, invalid choices, malformed/past dates, invalid email/phone, and missing contact consent. Delivery requires a city or area; pickup does not.
- Labels, fieldset legends, inline errors, `aria-invalid`, error/status announcements, focus movement, a skip link, native FAQ disclosures, and an Escape-aware mobile navigation support keyboard and assistive technology use.
- Layouts adapt to small screens. Motion respects `prefers-reduced-motion`.
- Dietary requirements, availability, price, and fulfillment always need direct confirmation with the baker.

## Assets

Illustrative cake and dessert photos are served locally from Unsplash image sources:

- Berry celebration cake: `photo-1535141192574-5d4897c12636`
- Chocolate cake: `photo-1578985545062-69928b1d9587`
- Cupcakes: `photo-1486427944299-d1955d23e34d`
- Berry tarts: `photo-1464305795204-6f5bbfc7fb81`
- Coffee layer cake: `photo-1571115177098-24ec42ed204d`
- Raspberry layer cake: `photo-1565958011703-44f9829ba187`
- Pink celebration cake: `photo-1558301211-0d8c8ddee6ec`
- Macarons: `photo-1558326567-98ae2405596b`
- Chocolate squares: `photo-1606313564200-e75d5e30476c`
- Berry cheesecake: `photo-1533134242443-d4fd215305ad`

The six baking-tool and decoration images are original SVG illustrations in `public/images/`. Some cake concepts share an inspiration photo; the catalog explicitly describes the collection as illustrative.

These are inspiration images, not photos of this bakery’s actual products. Replace them with the baker’s own photos before launch. DM Sans, DM Serif Display, and Noto Sans Arabic are locally hosted Google Fonts distributed under the SIL Open Font License; licenses are included with the font files. Decorative icons are inline SVG.
# miel-et-creme
