import { authApi } from "./api.js";
import { qs, setAlert } from "./common.js";

const form = qs("#form");
const alertEl = qs("#alert");
const registerBtn = qs("#registerBtn");

function isValidEmail(email) {
  return email.includes("@");
}

async function onSubmit(e) {
  e.preventDefault();
  setAlert(alertEl, { message: "" });

  const name = qs("#name").value.trim();
  const email = qs("#email").value.trim();
  const password = qs("#password").value;

  if (!name) {
    setAlert(alertEl, { type: "error", message: "Name is required" });
    return;
  }

  if (!email || !isValidEmail(email)) {
    setAlert(alertEl, { type: "error", message: "Please enter a valid email address" });
    return;
  }

  if (!password || password.length < 6) {
    setAlert(alertEl, { type: "error", message: "Password must be at least 6 characters long" });
    return;
  }

  registerBtn.disabled = true;

  try {
    await authApi.register({ name, email, password });
    setAlert(alertEl, { type: "success", message: "Registered successfully. Redirecting to login..." });

    setTimeout(() => {
      window.location.href = "./login.html";
    }, 500);
  } catch (err) {
    setAlert(alertEl, {
      type: "error",
      message: err.message || "Register failed"
    });
  } finally {
    registerBtn.disabled = false;
  }
}

form.addEventListener("submit", onSubmit);
