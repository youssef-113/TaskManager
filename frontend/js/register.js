import { authApi } from "./api.js";
import { qs, setAlert } from "./common.js";

const form = qs("#form");
const alertEl = qs("#alert");
const registerBtn = qs("#registerBtn");

async function onSubmit(e) {
  e.preventDefault();
  setAlert(alertEl, { message: "" });

  const name = qs("#name").value.trim();
  const email = qs("#email").value.trim();
  const password = qs("#password").value;

  registerBtn.disabled = true;

  try {
    await authApi.register({ name, email, password });
    setAlert(alertEl, { type: "success", message: "Registered. Now login." });
    setTimeout(() => {
      window.location.href = "./login.html";
    }, 450);
  } catch (err) {
    setAlert(alertEl, { type: "error", message: err.message || "Register failed" });
  } finally {
    registerBtn.disabled = false;
  }
}

form.addEventListener("submit", onSubmit);
