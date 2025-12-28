import { authApi } from "./api.js";
import { qs, setAlert, getReturnTo, navigateToReturn } from "./common.js";

const form = qs("#form");
const alertEl = qs("#alert");
const loginBtn = qs("#loginBtn");

async function onSubmit(e) {
  e.preventDefault();
  setAlert(alertEl, { message: "" });

  const email = qs("#email").value.trim();
  const password = qs("#password").value;

  loginBtn.disabled = true;

  try {
    await authApi.login({ email, password });
    setAlert(alertEl, { type: "success", message: "Login successful." });
    const to = getReturnTo();
    setTimeout(() => {
      window.location.href = to;
    }, 300);
  } catch (err) {
    setAlert(alertEl, { type: "error", message: err.message || "Login failed" });
  } finally {
    loginBtn.disabled = false;
  }
}

form.addEventListener("submit", onSubmit);
