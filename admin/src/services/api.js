// ============================================================
// API Service - Admin Panel
// Troque BASE_URL pela URL do Railway após o deploy
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getToken() {
  return localStorage.getItem('equesto_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 401) {
    localStorage.removeItem('equesto_token');
    window.location.href = '/login';
    throw new Error('Não autorizado');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

// ---- AUTH ----
export const login = (email, password) =>
  request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const getMe = () => request('/api/auth/me');

// ---- CATEGORIES ----
export const getCategories = () => request('/api/categories');
export const createCategory = (data) =>
  request('/api/categories', { method: 'POST', body: JSON.stringify(data) });
export const updateCategory = (id, data) =>
  request(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCategory = (id) =>
  request(`/api/categories/${id}`, { method: 'DELETE' });

// ---- LISTINGS ----
export const getListings = (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  ).toString();
  return request(`/api/listings/admin/all${qs ? `?${qs}` : ''}`);
};

export const createListing = (data) =>
  request('/api/listings', { method: 'POST', body: JSON.stringify(data) });

export const updateListing = (id, data) =>
  request(`/api/listings/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const approveListing = (id, approved) =>
  request(`/api/listings/${id}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({ approved }),
  });

export const deleteListing = (id) =>
  request(`/api/listings/${id}`, { method: 'DELETE' });
