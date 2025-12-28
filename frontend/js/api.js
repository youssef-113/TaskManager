import { API_BASE_URL } from "./config.js";

async function readJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiRequest(path, { method = "GET", body = undefined } = {}) {
  const url = `${API_BASE_URL}/${path}`;

  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include"
  });

  const json = await readJson(response);

  if (!response.ok) {
    const message = json?.message || json?.error || `Request failed (${response.status})`;
    const err = new Error(message);
    err.status = response.status;
    err.response = json;
    throw err;
  }

  if (json && json.status === "error") {
    const err = new Error(json.message || "Request failed");
    err.status = response.status;
    err.response = json;
    throw err;
  }

  return json;
}

export const tasksApi = {
  async list() {
    return apiRequest("listTasks.php");
  },
  async create({ title, description, status }) {
    return apiRequest("createTask.php", { method: "POST", body: { title, description, status } });
  },
  async update({ id, title, description, status }) {
    return apiRequest("update.php", { method: "POST", body: { id, title, description, status } });
  },
  async remove({ id }) {
    return apiRequest("delete.php", { method: "POST", body: { id } });
  }
};

export const authApi = {
  async login({ email, password }) {
    return apiRequest("login.php", { method: "POST", body: { email, password } });
  },
  async me() {
    return apiRequest("me.php");
  },
  async logout() {
    return apiRequest("logout.php", { method: "POST", body: {} });
  },
  async register({ name, email, password }) {
    return apiRequest("register.php", { method: "POST", body: { name, email, password } });
  }
};
