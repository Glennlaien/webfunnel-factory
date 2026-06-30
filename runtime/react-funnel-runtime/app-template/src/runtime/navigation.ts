import type { FunnelPage } from "./types";

export function routeFromUrl(defaultRoute = "age_group") {
  const params = new URLSearchParams(window.location.search);
  return params.get("page") || defaultRoute;
}

export function routeTo(id: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", id);
  window.history.pushState({}, "", url);
  window.dispatchEvent(new Event("routechange"));
}

export function nextPage(pages: FunnelPage[], id: string) {
  const index = pages.findIndex((page) => page.id === id);
  return pages[Math.min(index + 1, pages.length - 1)];
}

export function isClosedSessionPage(page: FunnelPage) {
  return [
    "payment_success_page"
  ].includes(page.pageType);
}

