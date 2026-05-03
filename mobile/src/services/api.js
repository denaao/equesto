// ============================================================
// Serviço de API - Equesto Mobile
// Troque BASE_URL pela URL do seu backend no Railway
// ============================================================

const BASE_URL = 'https://equesto-production.up.railway.app';

// Helper para fazer requisições
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro na requisição');
    return data;
  } catch (err) {
    console.error(`API Error [${path}]:`, err.message);
    throw err;
  }
}

// ---- CATEGORIAS ----

export const getCategories = () =>
  request('/api/categories');

export const getCategoriesGrouped = () =>
  request('/api/categories/grouped');

// ---- ANÚNCIOS ----

export const getListings = (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  ).toString();
  return request(`/api/listings${qs ? `?${qs}` : ''}`);
};

export const getFeaturedListings = () =>
  request('/api/listings/featured');

export const getListingById = (id) =>
  request(`/api/listings/${id}`);

// ---- WHATSAPP ----

export const buildWhatsAppUrl = (phone, name) => {
  const cleaned = phone.replace(/\D/g, '');
  const number = cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
  const msg = encodeURIComponent(`Olá! Vi seu anúncio no Equesto e gostaria de mais informações sobre ${name}.`);
  return `https://wa.me/${number}?text=${msg}`;
};
