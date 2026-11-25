// Lets other sections (the Armory, the Codex) open a project dossier without
// sharing React state across the whole page.

const EVENT = "archive:open";

export function openDossier(id: string) {
  const el = document.getElementById("archives");
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: id }));
}

export function onOpenDossier(handler: (id: string) => void) {
  const fn = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}
