import { tasksApi } from "./api.js";
import { qs, setAlert, ensureLoggedInOrRedirect, wireLogoutButton, statusBadgeClass, requireAuth } from "./common.js";

const tasksBody = qs("#tasksBody");
const alertEl = qs("#alert");
const statusFilter = qs("#statusFilter");
const searchEl = qs("#search");
const metaEl = qs("#meta");
const refreshBtn = qs("#refreshBtn");

let allTasks = [];

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function matches(task) {
  const s = (searchEl.value || "").trim().toLowerCase();
  const status = statusFilter.value;

  if (status !== "all" && task.status !== status) return false;
  if (!s) return true;

  const hay = `${task.title || ""} ${task.description || ""}`.toLowerCase();
  return hay.includes(s);
}

function render() {
  const filtered = allTasks.filter(matches);

  if (!filtered.length) {
    tasksBody.innerHTML = "<tr><td colspan='5' class='muted'>No tasks found.</td></tr>";
    metaEl.textContent = allTasks.length ? `0 of ${allTasks.length} tasks shown` : "";
    return;
  }

  tasksBody.innerHTML = filtered.map(t => {
    const badgeClass = statusBadgeClass(t.status);
    const desc = t.description ? escapeHtml(t.description) : "<span class='muted'>—</span>";

    return `
      <tr>
        <td><strong>${escapeHtml(t.title || "")}</strong></td>
        <td>${desc}</td>
        <td><span class="${badgeClass}">${escapeHtml(t.status)}</span></td>
        <td class="muted">${escapeHtml(formatDate(t.updatedAt || t.createdAt))}</td>
        <td>
          <div class="row">
            <a class="btn btn-secondary" href="./edit.html?id=${encodeURIComponent(t.id)}">Edit</a>
            <button class="btn btn-danger" type="button" data-action="delete" data-id="${escapeHtml(String(t.id))}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  metaEl.textContent = `${filtered.length} of ${allTasks.length} tasks shown`;
}

async function loadTasks() {
  setAlert(alertEl, { message: "" });
  tasksBody.innerHTML = "<tr><td colspan='5' class='muted'>Loading…</td></tr>";

  try {
    const res = await tasksApi.list();
    allTasks = Array.isArray(res?.data) ? res.data : [];
    render();
  } catch (err) {
    if (ensureLoggedInOrRedirect(err)) return;
    tasksBody.innerHTML = "<tr><td colspan='5' class='muted'>Failed to load tasks.</td></tr>";
    setAlert(alertEl, { type: "error", message: err.message || "Failed to load" });
  }
}

async function onDelete(id) {
  setAlert(alertEl, { message: "" });
  const ok = confirm("Delete this task?");
  if (!ok) return;

  try {
    await tasksApi.remove({ id: Number(id) });
    setAlert(alertEl, { type: "success", message: "Task deleted." });
    await loadTasks();
  } catch (err) {
    if (ensureLoggedInOrRedirect(err)) return;
    setAlert(alertEl, { type: "error", message: err.message || "Delete failed" });
  }
}

function wireEvents() {
  statusFilter.addEventListener("change", render);
  searchEl.addEventListener("input", render);
  refreshBtn.addEventListener("click", loadTasks);

  tasksBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action='delete']");
    if (!btn) return;
    onDelete(btn.dataset.id);
  });
}

wireEvents();
wireLogoutButton();

const ok = await requireAuth();
if (ok) {
  loadTasks();
}
