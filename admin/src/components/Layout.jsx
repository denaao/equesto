import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { colors } from '../theme';

const NAV = [
  { path: '/', icon: '📊', label: 'Dashboard' },
  { path: '/listings', icon: '📋', label: 'Anúncios' },
  { path: '/categories', icon: '🏷️', label: 'Categorias' },
  { path: '/admins', icon: '👤', label: 'Admins' },
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
      <aside style={{ ...s.sidebar, width: sidebarOpen ? 220 : 64 }}>
        <div style={s.sidebarHeader}>
          <div style={{ ...s.logoWrap, justifyContent: sidebarOpen ? 'center' : 'center' }}>
            <img
              src="/logo.png"
              alt="Equesto"
              style={sidebarOpen ? s.logoImg : s.logoImgSmall}
            />
          </div>
          <button style={s.toggleBtn} onClick={() => setSidebarOpen(v => !v)} title={sidebarOpen ? 'Recolher' : 'Expandir'}>
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

      <main style={s.main}>
        <div style={s.content}>{children}</div>
      </main>
    </div>
  );
}

const s = {
  wrap: { display: 'flex', minHeight: '100vh', background: colors.background },
  sidebar: {
    background: `linear-gradient(180deg, #1e2a14 0%, ${colors.primary} 60%, #1a2410 100%)`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.2s',
    position: 'sticky',
    top: 0,
    height: '100vh',
    flexShrink: 0,
    boxShadow: '2px 0 12px rgba(0,0,0,0.18)',
  },
  sidebarHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 12px 18px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    position: 'relative',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 4,
  },
  logoImg: {
    width: 64,
    height: 64,
    objectFit: 'contain',
    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
  },
  logoImgSmall: {
    width: 38,
    height: 38,
    objectFit: 'contain',
    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))',
  },
  toggleBtn: {
    position: 'absolute',
    right: 8,
    top: 10,
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    fontSize: 10,
    padding: '3px 6px',
    borderRadius: 6,
    lineHeight: 1,
  },
  nav: { flex: 1, padding: '12px 8px' },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    color: 'rgba(255,255,255,0.65)',
    textDecoration: 'none',
    borderRadius: 9,
    marginBo