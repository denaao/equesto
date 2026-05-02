import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const C = {
  primary: '#2D3B1E',
  accent: '#B8960C',
  bg: '#f8f7f2',
  surface: '#fff',
  border: '#E8E4DC',
  text: '#1A1A1A',
  textMuted: '#6B6B6B',
};

const NAV = [
  { path: '/', icon: '📊', label: 'Dashboard' },
  { path: '/listings', icon: '📋', label: 'Anúncios' },
  { path: '/categories', icon: '🏷️', label: 'Categorias' },
];

export default function Layout({ children }) {
  const { admin, setAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const logout = () => {
    localStorage.removeItem('equesto_token');
    setAdmin(null);
    navigate('/login');
  };

  return (
    <div style={s.wrap}>
      {/* Sidebar */}
      <aside style={{ ...s.sidebar, width: sidebarOpen ? 220 : 64 }}>
        <div style={s.sidebarHeader}>
          {sidebarOpen && <span style={s.logo}>🐎 Equesto</span>}
          <button style={s.toggleBtn} onClick={() => setSidebarOpen(v => !v)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav style={s.nav}>
          {NAV.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{ ...s.navItem, ...(active ? s.navItemActive : {}) }}
              >
                <span style={s.navIcon}>{item.icon}</span>
                {sidebarOpen && <span style={s.navLabel}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div style={s.sidebarFooter}>
          {sidebarOpen && (
            <div style={s.adminInfo}>
              <span style={s.adminName}>{admin?.name || admin?.email}</span>
            </div>
          )}
          <button style={s.logoutBtn} onClick={logout} title="Sair">
            🚪 {sidebarOpen && 'Sair'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        <div style={s.content}>{children}</div>
      </main>
    </div>
  );
}

const s = {
  wrap: { display: 'flex', minHeight: '100vh', background: C.bg },
  sidebar: {
    background: C.primary,
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.2s',
    position: 'sticky',
    top: 0,
    height: '100vh',
    flexShrink: 0,
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 12px 16px',
    borderBottom: `1px solid rgba(255,255,255,0.1)`,
  },
  logo: { color: '#fff', fontWeight: 800, fontSize: 18 },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    fontSize: 12,
    padding: 4,
  },
  nav: { flex: 1, padding: '8px 0' },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    transition: 'background 0.15s',
    borderRadius: 0,
  },
  navItemActive: {
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    borderLeft: `3px solid ${C.accent}`,
  },
  navIcon: { fontSize: 16, minWidth: 20, textAlign: 'center' },
  navLabel: { fontSize: 14, fontWeight: 500 },
  sidebarFooter: {
    padding: '12px 14px',
    borderTop: `1px solid rgba(255,255,255,0.1)`,
  },
  adminInfo: { marginBottom: 8 },
  adminName: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: 4,
  },
  main: { flex: 1, overflow: 'auto' },
  content: { padding: 28, maxWidth: 1100 },
};
