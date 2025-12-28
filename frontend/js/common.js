import { authApi } from "./api.js";

export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

export function setAlert(el, { type = "", message = "" } = {}) {
  if (!el) return;
  el.classList.remove("alert-error", "alert-success");
  if (!message) {
    el.hidden = true;
    el.textContent = "";
    return;
  }
  el.hidden = false;
  el.textContent = message;
  if (type === "error") el.classList.add("alert-error");
  if (type === "success") el.classList.add("alert-success");
}

export function getReturnTo() {
  const url = new URL(window.location.href);
  return url.searchParams.get("returnTo") || "./tasks.html";
}

export function currentPageReturnTo() {
  const file = window.location.pathname.split("/").pop() || "index.html";
  return `${file}${window.location.search}`;
}

export function navigateToReturn() {
  window.location.href = getReturnTo();
}

export function ensureLoggedInOrRedirect(err) {
  if (err && (err.status === 401 || err.status === 403)) {
    const returnTo = encodeURIComponent(currentPageReturnTo());
    window.location.href = `./login.html?returnTo=${returnTo}`;
    return true;
  }
  return false;
}

export async function requireAuth({ hideSelector = "body" } = {}) {
  const hideEl = hideSelector ? document.querySelector(hideSelector) : null;
  const previousVisibility = hideEl ? hideEl.style.visibility : "";

  if (hideEl) hideEl.style.visibility = "hidden";

  try {
    await authApi.me();
    if (hideEl) hideEl.style.visibility = previousVisibility;
    return true;
  } catch (err) {
    ensureLoggedInOrRedirect(err);
    return false;
  }
}

export async function wireLogoutButton() {
  const btn = document.querySelector("[data-action='logout']");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    try {
      await authApi.logout();
      window.location.href = "./login.html";
    } catch {
      window.location.href = "./login.html";
    }
  });
}

export function statusBadgeClass(status) {
  if (status === "done") return "badge badge-done";
  if (status === "inProgress") return "badge badge-inProgress";
  return "badge badge-pending";
}
