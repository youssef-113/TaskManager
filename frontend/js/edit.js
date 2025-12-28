import { tasksApi } from "./api.js";
import { qs, setAlert, ensureLoggedInOrRedirect, wireLogoutButton, requireAuth } from "./common.js";

const alertEl = qs("#alert");
const form = qs("#form");
const loadingEl = qs("#loading");
const saveBtn = qs("#saveBtn");
const deleteBtn = qs("#deleteBtn");

function getTaskId() {
  const url = new URL(window.location.href);
  const raw = url.searchParams.get("id");
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

async function loadTask(id) {
  setAlert(alertEl, { message: "" });
  loadingEl.hidden = false;
  form.hidden = true;

  try {
    const res = await tasksApi.list();
    const tasks = Array.isArray(res?.data) ? res.data : [];
    const task = tasks.find(t => Number(t.id) === Number(id));

    if (!task) {
      setAlert(alertEl, { type: "error", message: "Task not found." });
      loadingEl.textContent = "Task not found.";
      return null;
    }

    qs("#title").value = task.title || "";
    qs("#description").value = task.description || "";
    qs("#status").value = task.status || "pending";

    loadingEl.hidden = true;
    form.hidden = false;
    return task;
  } catch (err) {
    if (ensureLoggedInOrRedirect(err)) return null;
    setAlert(alertEl, { type: "error", message: err.message || "Failed to load task" });
    loadingEl.textContent = "Failed to load task.";
    return null;
  }
}

async function onSave(e) {
  e.preventDefault();
  const id = getTaskId();
  if (!id) {
    setAlert(alertEl, { type: "error", message: "Missing task id" });
    return;
  }

  setAlert(alertEl, { message: "" });

  const title = qs("#title").value.trim();
  const description = qs("#description").value.trim();
  const status = qs("#status").value;

  saveBtn.disabled = true;

  try {
    await tasksApi.update({ id, title, description, status });
    setAlert(alertEl, { type: "success", message: "Task updated." });
    setTimeout(() => {
      window.location.href = "./tasks.html";
    }, 450);
  } catch (err) {
    if (ensureLoggedInOrRedirect(err)) return;
    setAlert(alertEl, { type: "error", message: err.message || "Update failed" });
  } finally {
    saveBtn.disabled = false;
  }
}

async function onDelete() {
  const id = getTaskId();
  if (!id) {
    setAlert(alertEl, { type: "error", message: "Missing task id" });
    return;
  }

  const ok = confirm("Delete this task?");
  if (!ok) return;

  deleteBtn.disabled = true;

  try {
    await tasksApi.remove({ id });
    window.location.href = "./tasks.html";
  } catch (err) {
    if (ensureLoggedInOrRedirect(err)) return;
    setAlert(alertEl, { type: "error", message: err.message || "Delete failed" });
  } finally {
    deleteBtn.disabled = false;
  }
}

form.addEventListener("submit", onSave);
deleteBtn.addEventListener("click", onDelete);
wireLogoutButton();

const ok = await requireAuth();
if (ok) {
  const id = getTaskId();
  if (!id) {
    loadingEl.textContent = "Missing task id.";
    setAlert(alertEl, { type: "error", message: "Missing task id" });
  } else {
    loadTask(id);
  }
}
