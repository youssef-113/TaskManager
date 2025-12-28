import { tasksApi } from "./api.js";
import { qs, setAlert, ensureLoggedInOrRedirect, wireLogoutButton, requireAuth } from "./common.js";

const form = qs("#form");
const alertEl = qs("#alert");
const submitBtn = qs("#submitBtn");

async function onSubmit(e) {
  e.preventDefault();
  setAlert(alertEl, { message: "" });

  const title = qs("#title").value.trim();
  const description = qs("#description").value.trim();
  const status = qs("#status").value;

  submitBtn.disabled = true;

  try {
    await tasksApi.create({ title, description, status });
    setAlert(alertEl, { type: "success", message: "Task created." });
    setTimeout(() => {
      window.location.href = "./tasks.html";
    }, 450);
  } catch (err) {
    if (ensureLoggedInOrRedirect(err)) return;
    setAlert(alertEl, { type: "error", message: err.message || "Create failed" });
  } finally {
    submitBtn.disabled = false;
  }
}

form.addEventListener("submit", onSubmit);
wireLogoutButton();

await requireAuth();
