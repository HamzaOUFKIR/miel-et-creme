import {
  getLocale,
  hasTranslation,
  resolveLocale,
  setLocale,
  translate,
} from "./i18n.ts";
import type { MessageKey, MessageParams } from "./i18n.ts";

const preferenceKey = "miel-creme-language";
const textSources = new WeakMap<Text, string>();
const attributeSources = new WeakMap<Element, Map<string, string>>();
const boundMessages = new WeakMap<
  Element,
  { key: MessageKey; params: MessageParams }
>();
const translatedAttributes = ["aria-label", "placeholder", "alt"] as const;

/** Bind interpolated UI text without rebuilding controls or losing form state. */
export function setMessage(
  element: Element,
  key: MessageKey,
  params: MessageParams = {},
): void {
  boundMessages.set(element, { key, params });
  const value = translate(key, getLocale(), params);
  if (element.textContent !== value) element.textContent = value;
}

/** Translates known, authored copy only. Never translates field values or HTML. */
function localize(node: Node): void {
  if (node instanceof Text) {
    if (
      node.parentElement?.closest(
        "textarea, script, style, [data-no-translate]",
      )
    )
      return;
    const current = node.data;
    const source = textSources.get(node) ?? current;
    if (!hasTranslation(source.trim())) return;
    textSources.set(node, source);
    const value = source.replace(source.trim(), translate(source.trim()));
    if (current !== value) node.data = value;
    return;
  }
  if (!(node instanceof Element)) return;
  if (node.matches("script, style, [data-no-translate]")) return;
  const bound = boundMessages.get(node);
  if (bound) {
    setMessage(node, bound.key, bound.params);
    return;
  }
  let sources = attributeSources.get(node);
  if (!sources) {
    sources = new Map();
    attributeSources.set(node, sources);
  }
  for (const attribute of translatedAttributes) {
    const current = node.getAttribute(attribute);
    if (current === null) continue;
    let source = sources.get(attribute) ?? current;
    // Navigation labels can change independently of the active language.
    if (current !== translate(source) && hasTranslation(current))
      source = current;
    if (!hasTranslation(source)) continue;
    sources.set(attribute, source);
    const value = translate(source);
    if (current !== value) node.setAttribute(attribute, value);
  }
  // Translate textarea attributes, never the customer's text or saved summary.
  if (node instanceof HTMLTextAreaElement) return;
  for (const child of node.childNodes) localize(child);
}

export function initializeLocalization(onChange: () => void): void {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(preferenceKey);
  } catch {
    /* Storage is optional. */
  }
  setLocale(resolveLocale(saved, navigator.language));
  const root = document.querySelector<HTMLElement>("#app");
  const languageSelect =
    document.querySelector<HTMLSelectElement>("#language-select");
  if (!root || !languageSelect) throw new Error("Missing language controls");
  const title = document.title;
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]',
  );
  const description = meta?.content ?? "";
  function refresh(): void {
    const language = getLocale();
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = translate(title);
    if (meta) meta.content = translate(description);
    languageSelect!.value = language;
    languageSelect!.lang = language;
    languageSelect!.setAttribute(
      "aria-label",
      language === "ar" ? "اللغة" : "Language",
    );
    localize(root!);
    onChange();
  }
  languageSelect.addEventListener("change", () => {
    const language = languageSelect.value;
    if (language !== "en" && language !== "ar") return;
    setLocale(language);
    try {
      localStorage.setItem(preferenceKey, language);
    } catch {
      /* Keep working in memory. */
    }
    refresh();
  });
  refresh();
  // Localize new validation/status text as it is rendered. Existing DOM nodes,
  // focus, selections, field values, and in-flight submissions are preserved.
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "childList") {
        for (const node of record.addedNodes) localize(node);
      } else localize(record.target);
    }
  }).observe(root, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...translatedAttributes],
  });
}
