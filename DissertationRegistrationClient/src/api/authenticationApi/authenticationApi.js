const API_URL = process.env.REACT_APP_API_URL;

async function checkSession() {
  const response = await fetch(`${API_URL}/auth/check-session`, {
    method: "GET",
    credentials: "include",
  });
  return response;
}

async function login(username, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  return response;
}

async function register(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });
  return response;
}

async function logout() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return response;
}

export { checkSession, login, register, logout };