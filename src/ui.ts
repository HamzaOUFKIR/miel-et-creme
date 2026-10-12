export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ] ?? character,
  );
}

export const arrow =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
export const flower =
  '<svg aria-hidden="true" viewBox="0 0 48 48" fill="none"><path d="M24 19C6-5 0 22 18 24 0 26 6 53 24 29c18 24 24-3 6-5C48 22 42-5 24 19Z" stroke="currentColor" stroke-width="1.4"/><circle cx="24" cy="24" r="4" stroke="currentColor" stroke-width="1.4"/></svg>';
export const sparkle =
  '<svg aria-hidden="true" viewBox="0 0 32 32" fill="none"><path d="M16 2c0 10-4 14-14 14 10 0 14 4 14 14 0-10 4-14 14-14C20 16 16 12 16 2Z" stroke="currentColor" stroke-width="1.3"/></svg>';

export function element<T extends Element>(
  selector: string,
  root: ParentNode = document,
): T {
  const found = root.querySelector<T>(selector);
  if (!found) throw new Error(`Required element missing: ${selector}`);
  return found;
}
