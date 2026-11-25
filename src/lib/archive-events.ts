// Lets other sections (the Armory, the Codex) open a project dossier, or jump
// to a lesser work in the ledger, without sharing React state across the page.

import { findWork } from "@/data/projects";

const EVENT = "archive:open";

function scrollTo(el: Element) {
  const lenis = window.__lenis;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -96 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function openDossier(id: string) {
  const el = document.getElementById("archives");
  if (el) scrollTo(el);
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: id }));
}

/** Featured projects open their dossier; lesser works scroll to the ledger and flash. */
export function goToWork(id: string) {
  const w = findWork(id);
  if (!w) return;
  if (w.featured) return openDossier(id);
  const el = document.getElementById(`work-${id}`);
  if (!el) return;
  scrollTo(el);
  el.classList.remove("flash");
  void (el as HTMLElement).offsetWidth;
  el.classList.add("flash");
}

export function onOpenDossier(handler: (id: string) => void) {
  const fn = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}
