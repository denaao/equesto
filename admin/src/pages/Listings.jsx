import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getListings, deleteListing, approveListing } from '../services/api';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | approved | pending
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: LIMIT, search };
      if (filter === 'approved') params.approved = 'true';
      if (filter === 'pending') params.approved = 'false';
      const data = await getListings(params);
      setListings(data.data);
      setTotal(data.total);
      setPage(p);
    } catch (err) {
      alert('Erro ao carregar anúncios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, [filter]);

  const handleSearch = (e) => {
    e.preventDefault();
    load(1);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Excluir "${name}"?`)) return;
    try {
      await deleteListing(id);
      load(page);
    } catch (err) {
      alert('Erro ao excluir: ' + err.message);
    }
  };

  const handleApprove = async (id, approved) => {
    try {
      await approveListing(id, approved);
      load(page);
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      <div style={s.pageHeader}>
        <h1 style={s.h1}>Anúncios</h1>
        <Link to="/listings/new" style={s.newBtn}>+ Novo Anúncio</Link>
      </div>

      {/* Filtros */}
      <div style={s.toolbar}>
        <form onSubmit={handleSearch} style={s.searchForm}>
          <input
            style={s.searchInput}
            placeholder="Buscar por nome..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button style={s.searchBtn} type="submit">Buscar</button>
        </form>

        <div style={s.filters}>
          {[['all', 'Todos'], ['approved', '✅ Aprovados'], ['pending', '⏳ Pendentes']].map(([v, l]) => (
            <button
              key={v}
              style={{ ...s.filterBtn, ...(filter === v ? s.filterBtnActive : {}) }}
              onClick={() => setFilter(v)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={s.tableWrap}>
        <div style={s.tableHeader}>
          <span style={s.th}>Nome</span>
          <span style={s.th}>Categoria</span>
          <span style={s.th}>Cidade</span>
          <span style={s.th}>Status</span>
          <span style={s.th}>Destaque</span>
          <span style={s.th}>Ações</span>
        </div>

        {loading ? (
          <div style={s.loadingRow}>Carregando...</div>
        ) : listings.length === 0 ? (
          <div style={s.emptyRow}>Nenhum anúncio encontrado</div>
        ) : (
          listings.map(item => (
            <div key={item.id} style={s.row}>
              <span style={s.tdName}>{item.name}</span>
              <span style={s.td}>{item.category_name || '—'}</span>
              <span style={s.td}>{item.city || '—'}</span>
              <span style={s.td}>
                <button
                  style={{ ...s.badge, ...(item.approved ? s.badgeGreen : s.badgeOrange) }}
                  onClick={() => handleApprove(item.id, !item.approved)}
                  title="Clique para alternar"
                >
                  {item.approved ? 'Aprovado' : 'Pendente'}
                </button>
              </span>
              <span style={s.td}>{item.featured ? '⭐' : '—'}</span>
              <span style={s.tdActions}>
                <Link to={`/listings/${item.id}`} style={s.editLink}>Editar</Link>
                <button
                  style={s.deleteBtn}
                  onClick={() => handleDelete(item.id, item.name)}
                >
                  Excluir
                </button>
              </span>
            </div>
          ))
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div style={s.pagination}>
          <button style={s.pageBtn} onClick={() => load(page - 1)} disabled={page === 1}>← Anterior</button>
          <span style={s.pageInfo}>{page} / {totalPages} ({total} total)</span>
          <button style={s.pageBtn} onClick={() => load(page + 1)} disabled={page === totalPages}>Próxima →</button>
        </div>
      )}
    </div>
  );
}

const s = {
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  h1: { fontSize: 24, fontWeight: 800, color: '#1A1A1A' },
  newBtn: { background: '#1B4332', color: '#fff', padding: '9px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13 },
  toolbar: { display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' },
  searchForm: { display: 'flex', gap: 8 },
  searchInput: { padding: '8px 14px', border: '1.5px solid #E8E4DC', borderRadius: 8, fontSize: 13, outline: 'none', minWidth: 220 },
  searchBtn: { padding: '8px 16px', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  filters: { display: 'flex', gap: 6 },
  filterBtn: { padding: '6px 14px', border: '1.5px solid #E8E4DC', borderRadius: 20, fontSize: 12, fontWeight: 500, background: '#fff', cursor: 'pointer', color: '#6B6B6B' },
  filterBtnActive: { background: '#1B4332', color: '#fff', borderColor: '#1B4332' },
  tableWrap: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr 1fr', padding: '10px 16px', background: '#f8f7f2', borderBottom: '1px solid #E8E4DC' },
  row: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr 1fr', padding: '12px 16px', borderBottom: '1px solid #E8E4DC', alignItems: 'center' },
  th: { fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: 0.5 },
  td: { fontSize: 13, color: '#1A1A1A' },
  tdName: { fontSize: 13, color: '#1A1A1A', fontWeight: 600 },
  tdActions: { display: 'flex', gap: 8, alignItems: 'center' },
  badge: { fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, border: 'none', cursor: 'pointer' },
  badgeGreen: { background: '#E8F5E9', color: '#2E7D32' },
  badgeOrange: { background: '#FFF3E0', color: '#E65100' },
  editLink: { color: '#1B4332', fontWeight: 600, fontSize: 12, textDecoration: 'none' },
  deleteBtn: { color: '#C62828', background: 'none', border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer' },
  loadingRow: { padding: 24, textAlign: 'center', color: '#6B6B6B' },
  emptyRow: { padding: 40, textAlign: 'center', color: '#6B6B6B', fontSize: 14 },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 16 },
  pageBtn: { padding: '6px 16px', background: '#fff', border: '1.5px solid #E8E4DC', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  pageInfo: { fontSize: 13, color: '#6B6B6B' },
};
