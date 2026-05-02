import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getListings } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    getListings({ limit: 100 }).then(data => {
      const all = data.data;
      setStats({
        total: data.total,
        approved: all.filter(l => l.approved).length,
        pending: all.filter(l => !l.approved).length,
        featured: all.filter(l => l.featured).length,
      });
      setPending(all.filter(l => !l.approved).slice(0, 5));
    });
  }, []);

  const CARDS = stats ? [
    { label: 'Total de Anúncios', value: stats.total, icon: '📋', color: '#1B4332' },
    { label: 'Aprovados', value: stats.approved, icon: '✅', color: '#2E7D32' },
    { label: 'Aguardando', value: stats.pending, icon: '⏳', color: '#E65100' },
    { label: 'Destaques', value: stats.featured, icon: '⭐', color: '#C9A227' },
  ] : [];

  return (
    <div>
      <div style={s.pageHeader}>
        <h1 style={s.h1}>Dashboard</h1>
        <Link to="/listings/new" style={s.newBtn}>+ Novo Anúncio</Link>
      </div>

      <div style={s.cards}>
        {CARDS.map(card => (
          <div key={card.label} style={{ ...s.card, borderTop: `4px solid ${card.color}` }}>
            <div style={s.cardIcon}>{card.icon}</div>
            <div style={{ ...s.cardValue, color: card.color }}>{card.value ?? '—'}</div>
            <div style={s.cardLabel}>{card.label}</div>
          </div>
        ))}
      </div>

      {pending.length > 0 && (
        <div style={s.section}>
          <h2 style={s.h2}>⏳ Aguardando aprovação</h2>
          <div style={s.table}>
            <div style={s.tableHeader}>
              <span style={s.th}>Nome</span>
              <span style={s.th}>Categoria</span>
              <span style={s.th}>Cidade</span>
              <span style={s.th}>Ação</span>
            </div>
            {pending.map(item => (
              <div key={item.id} style={s.tableRow}>
                <span style={s.td}>{item.name}</span>
                <span style={s.td}>{item.category_name || '—'}</span>
                <span style={s.td}>{item.city || '—'}</span>
                <span style={s.td}>
                  <Link to={`/listings/${item.id}`} style={s.editLink}>Revisar</Link>
                </span>
              </div>
            ))}
          </div>
          {stats?.pending > 5 && (
            <Link to="/listings?approved=false" style={s.viewAll}>
              Ver todos ({stats.pending}) →
            </Link>
          )}
        </div>
      )}

      <div style={s.quickLinks}>
        <Link to="/listings" style={s.quickCard}>
          <span style={s.quickIcon}>📋</span>
          <span>Gerenciar Anúncios</span>
        </Link>
        <Link to="/categories" style={s.quickCard}>
          <span style={s.quickIcon}>🏷️</span>
          <span>Gerenciar Categorias</span>
        </Link>
        <Link to="/listings/new" style={s.quickCard}>
          <span style={s.quickIcon}>➕</span>
          <span>Novo Anúncio</span>
        </Link>
      </div>
    </div>
  );
}

const s = {
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  h1: { fontSize: 26, fontWeight: 800, color: '#1A1A1A' },
  newBtn: { background: '#1B4332', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 },
  card: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardIcon: { fontSize: 24, marginBottom: 8 },
  cardValue: { fontSize: 32, fontWeight: 800, marginBottom: 4 },
  cardLabel: { fontSize: 13, color: '#6B6B6B', fontWeight: 500 },
  section: { marginBottom: 32 },
  h2: { fontSize: 18, fontWeight: 700, color: '#1A1A1A', marginBottom: 12 },
  table: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 16px', background: '#f8f7f2', borderBottom: '1px solid #E8E4DC' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 16px', borderBottom: '1px solid #E8E4DC', alignItems: 'center' },
  th: { fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: 0.5 },
  td: { fontSize: 13, color: '#1A1A1A' },
  editLink: { color: '#1B4332', fontWeight: 600, fontSize: 13, textDecoration: 'none' },
  viewAll: { display: 'block', marginTop: 12, color: '#1B4332', fontSize: 13, fontWeight: 600, textDecoration: 'none' },
  quickLinks: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
  quickCard: { background: '#fff', borderRadius: 12, padding: '20px 16px', textDecoration: 'none', color: '#1A1A1A', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'box-shadow 0.15s' },
  quickIcon: { fontSize: 20 },
};
