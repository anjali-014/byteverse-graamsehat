const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

async function request(path, options) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers,
    ...options,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error || 'Request failed');
  }

  return body;
}

export async function signupUser(payload) {
  const response = await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (response.success) {
    setToken(response.token);
    setAuthUser(response.data);
  }

  return response;
}

export async function loginUser(identifier, password) {
  const response = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });

  if (response.success) {
    setToken(response.token);
    setAuthUser(response.data);
  }

  return response;
}

export function setToken(token, remember = false) {
  if (remember) {
    localStorage.setItem('token', token);
    sessionStorage.removeItem('token');
  } else {
    sessionStorage.setItem('token', token);
    localStorage.removeItem('token');
  }
}

export function getToken() {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
}

export function setAuthUser(user, remember = false) {
  const serialized = JSON.stringify(user);
  if (remember) {
    localStorage.setItem('user', serialized);
    sessionStorage.removeItem('user');
  } else {
    sessionStorage.setItem('user', serialized);
    localStorage.removeItem('user');
  }
}

export function getCurrentUser() {
  const stored = sessionStorage.getItem('user') || localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
}

export function logoutUser() {
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

export function isAuthenticated() {
  return getCurrentUser() !== null && getToken() !== null;
}
