// @ts-nocheck
const API_BASE_URL = "http://localhost:3000/api/v1";
const USER_KEY = "oap-current-user-id";

export function getCurrentUserId() {
  return localStorage.getItem(USER_KEY) || "1";
}

export function setCurrentUserId(id) {
  localStorage.setItem(USER_KEY, String(id));
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const headers = {
    "X-Demo-UserId": getCurrentUserId(),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    const text = await response.text();

    if (!response.ok) {
      let payload = null;
      try { payload = text ? JSON.parse(text) : null; } catch {}
      throw { status: response.status, message: payload?.message || "HTTP помилка", details: text };
    }

    if (response.status === 204 || !text) return null;
    return JSON.parse(text);
  } catch (err) {
    if (err.status) throw err;
    throw {
      status: 0,
      message: err.name === "AbortError" ? "Запит перевищив час очікування" : "Помилка мережі або CORS",
      details: err.message,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export const getPasses = () => request("/passes");
export const getPassStats = () => request("/passes/stats");
export const getPassById = (id) => request(`/passes/${id}`);
export const createPass = (dto) => request("/passes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dto) });
export const updatePass = (id, dto) => request(`/passes/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dto) });
export const deletePass = (id) => request(`/passes/${id}`, { method: "DELETE" });

export const getUsers = () => request("/users");
export const getUserById = (id) => request(`/users/${id}`);
export const createUser = (dto) => request("/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dto) });
export const updateUser = (id, dto) => request(`/users/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dto) });
export const deleteUser = (id) => request(`/users/${id}`, { method: "DELETE" });
