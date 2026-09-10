// src/services/authService.js
// Acá vive TODO lo relacionado a hablar con el backend de auth.
// Si el día de mañana cambia la URL o el nombre del endpoint,
// solo tocás este archivo, no cada componente.
// src/services/authService.js
// Acá vive TODO lo relacionado a hablar con el backend de auth.
// Si el día de mañana cambia la URL o el nombre del endpoint,
// solo tocás este archivo, no cada componente.

const API_URL = import.meta.env.VITE_API_BACK + "/api/auth/register"; // 👉 cambio esto por la URL real de franco

export async function registerUser({ name, email, password }) {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Si el backend responde con status 400/409/500, entramos acá
    throw new Error(data.message || "No se pudo completar el registro");
  }

  return data; // lo que devuelva el backend (token, usuario, etc.)
}

const Apilogin = import.meta.env.VITE_API_BACK + "/api/auth/login"; // 👉 cambio esto por la URL real de franco

export async function loginUser({ email, password }) {
  const response = await fetch(`${Apilogin}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();
  console.log("Respuesta del login:", result); // 👈 temporal, para ver la forma real

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Email o contraseña incorrectos");
    }
    if (response.status === 400) {
      throw new Error("Faltan completar datos");
    }
    throw new Error(result.message || "No se pudo iniciar sesión");
  }

  const { token, user } = result;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
}