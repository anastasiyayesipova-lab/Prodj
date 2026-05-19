const API_BASE_URL = "http://localhost:3000/api/v1";

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
    });

    const text = await response.text();

    if (!response.ok) {
      let payload = null;
      try {
        payload = text ? JSON.parse(text) : null;
      } catch {}

      throw {
        status: response.status,
        message: payload?.message || "HTTP помилка",
        details: text,
      };
    }

    if (response.status === 204 || !text) return null;
    return JSON.parse(text);
  } catch (err) {
    if (err.status) throw err;

    throw {
      status: 0,
      message:
        err.name === "AbortError"
          ? "Запит перевищив час очікування"
          : "Помилка мережі або CORS",
      details: err.message,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getPasses() {
  return request("/passes");
}

export function createPass(dto) {
  return request("/passes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export function deletePass(id) {
  return request(`/passes/${id}`, {
    method: "DELETE",
  });
}

export function getPassById(id) {
  return request(`/passes/${id}`);
}

export function updatePass(id, dto) {
  return request(`/passes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}