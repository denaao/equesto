import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../App';
import { colors } from '../theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const { setAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem('equesto_token', data.token);
      setAdmin(data.admin);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Padrão decorativo de fundo */}
      <div style={s.bgPattern} />

      <div style={s.card}>
        {/* Header com logo */}
        <div style={s.header}>
          <div style={s.logoWrap}>
            <img src="/logo.png" alt="Equesto" style={s.logo} />
          </div>
          <h1 style={s.title}>Equesto Admin</h1>
          <p style={s.subtitle}>Painel administrativo</p>
        </div>

        {/* Divider */}
        <div style={s.divider} />

        <form onSubmit={handleSubmit} style={s.form}>
          {error && (
            <div style={s.errorBox}>
              <span style={s.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <div style={s.fieldWrap}>
            <label style={s.label}>Email</label>
            <input
              style={{
                ...s.input,
                ...(focusField === 'email' ? s.inputFocus : {}),
              }}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@equesto.com.br"
              required
              autoFocus
              onFocus={() => setFocusField('email')}
              onBlur={() => setFocusField(null)}
            />
          </div>

          <div style={s.fieldWrap}>
            <label style={s.label}>Senha</label>
            <input
              style={{
                ...s.input,
                ...(focusField === 'password' ? s.inputFocus : {}),
              }}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              onFocus={() => setFocusField('password')}
              onBlur={() => setFocusField(null)}
            />
          </div>

          <button style={{ ...s.btn, ...(loading ? s.btnLoading : {}) }} type="submit" disabled={loading}>
            {loading ? (
              <span style={s.btnContent}>
                <span style={s.spinner} /> Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: `linear-gradient(145deg, ${colors.primary} 0%, #1a2410 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  bgPattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `radial-gradient(circle at 20% 20%, rgba(184,150,12,0.08) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(184,150,12,0.06) 0%, transparent 50%)`,
    pointerEvents: 'none',
  },
  card: {
    background: colors.surface,
    borderRadius: 20,
    padding: '44px 40px 40px',
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: 24,
  },
  logoWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.background,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  logo: {
    width: 140,
    height: 140,
    objectFit: 'contain',
    display: 'block',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: colors.primary,
    margin: '0 0 6px',
    fontFamily: "'Playfair Display', Georgia, serif",
    letterSpacing: '0.2px',
  },
  subtitle: {
    color: colors.textLight,
    fontSize: 12,
    margin: 0,
    fontWeight: 500,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)`,
    marginBottom: 28,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  fieldWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  input: {
    padding: '12px 14px',
    border: `1.5px solid ${colors.border}`,
    borderRadius: 10,
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    color: colors.text,
    background: colors.background,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  inputFocus: {
    borderColor: colors.accent,
    boxShadow: `0 0 0 3px ${colors.accent}22`,
    background: colors.surface,
  },
  btn: {
    marginTop: 4,
    padding: '14px',
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    letterSpacing: '0.3px',
    boxShadow: `0 4px 16px ${colors.primary}55`,
    transition: 'opacity 0.2s, transform 0.1s',
  },
  btnLoading: {
    opacity: 0.75,
    cursor: 'not-allowed',
  },
  btnContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  spinner: {
    width: 14,
    height: 14,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
  errorBox: {
    background: '#FEF2F2',
    color: colors.error,
    padding: '11px 14px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    border: `1px solid #FECACA`,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  errorIcon: { fontSize: 15 },
};
