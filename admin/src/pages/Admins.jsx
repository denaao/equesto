import React, { useState, useEffect } from 'react';
import { getAdmins, createAdmin, deleteAdmin } from '../services/api';
import { useAuth } from '../App';
import { colors } from '../theme';

const EMPTY = { email: '', name: '', password: '', confirm: '' };

export default function Admins() {
  const { admin: me } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    getAdmins()
      .then(setAdmins)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== form.confirm) {
      setError('As senhas não conferem');
      return;
    }
    setSaving(true);
    try {
      await createAdmin({ email: form.email, name: form.name, password: form.password });
      setSuccess(`Admin ${form.email} criado com sucesso.`);
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err.message || 'Erro ao criar admin');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Remover admin "${email}"? Esta ação não pode ser desfeita.`)) return;
    setDeletingId(id);
    try {
      await deleteAdmin(id);
      setAdmins(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert(err.message || 'Erro ao remover');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <h1 style={s.h1}>Administradores</h1>
        <p style={s.subtitle}>Gerencie os usuários com acesso ao painel.</p>
      </div>

      <div style={s.grid}>
        {/* Formulário de novo admin */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Novo Administrador</h2>

          {error && <div style={s.errorBox}><span>⚠️</span> {error}</div>}
          {success && <div style={s.successBox}><span>✅</span> {success}</div>}

          <form onSubmit={handleCreate} style={s.form}>
            <Field label="Nome">
              <input
                style={s.input}
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Nome completo"
              />
            </Field>

            <Field label="Email *">
              <input
                style={s.input}
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="admin@equesto.com.br"
                required
              />
            </Field>

            <Field label="Senha *">
              <input
                style={s.input}
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
              />
            </Field>

            <Field label="Confirmar senha *">
              <input
                style={s.input}
                type="password"
                value={form.confirm}
                onChange={e => set('confirm', e.target.value)}
                placeholder="Repita a senha"
                required
              />
            </Field>

            <button style={s.btn} type="submit" disabled={saving}>
              {saving ? 'Criando...' : '+ Criar Admin'}
            </button>
          </form>
        </div>

        {/* Lista de admins */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Admins cadastrados</h2>

          {loading ? (
            <p style={s.empty}>Carregando...</p>
          ) : admins.length === 0 ? (
            <p style={s.empty}>Nenhum admin encontrado.</p>
          ) : (
            <div style={s.list}>
              {admins.map(a => (
                <div key={a.id} style={s.row}>
                  <div style={s.rowInfo}>
                    <div style={s.rowName}>{a.name || '—'}</div>
                    <div style={s.rowEmail}>{a.email}</div>
                    <div style={s.rowDate}>
                      Criado em {new Date(a.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div style={s.rowActions}>
                    {a.id === me?.id ? (
                      <span style={s.youBadge}>Você</span>
                    ) : (
                      <button
                        style={s.deleteBtn}
                        onClick={() => handleDelete(a.id, a.email)}
                        disabled={deletingId === a.id}
                        title="Remover admin"
                      >
                        {deletingId === a.id ? '...' : '🗑'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const s = {
  wrap: { maxWidth: 900 },
  header: { marginBottom: 28 },
  h1: { fontSize: 22, fontWeight: 800, color: colors.text, margin: '0 0 4px' },
  subtitle: { color: colors.textSecondary, fontSize: 14, margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' },
  card: {
    background: colors.surface,
    borderRadius: 14,
    padding: 28,
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    border: `1px solid ${colors.border}`,
  },
  cardTitle: { fontSize: 15, fontWeight: 700, color: colors.text, margin: '0 0 20px', paddingBottom: 12, borderBottom: `1px solid ${colors.border}` },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  input: {
    padding: '9px 12px',
    border: `1.5px solid ${colors.border}`,
    borderRadius: 8,
    fontSize: 13,
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    color: colors.text,
    background: colors.background,
  },
  btn: {
    marginTop: 6,
    padding: '11px 18px',
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
    color: '#fff',
    border: 'none',
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    letterSpacing: '0.2px',
  },
  errorBox: {
    background: '#FEF2F2',
    color: colors.error,
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    border: '1px solid #FECACA',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  successBox: {
    background: '#F0FDF4',
    color: colors.success,
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    border: '1px solid #BBF7D0',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  empty: { color: colors.textLight, fontSize: 14, textAlign: 'center', padding: '24px 0', margin: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: 0 },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 0',
    borderBottom: `1px solid ${colors.border}`,
  },
  rowInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
  rowName: { fontSize: 14, fontWeight: 600, color: colors.text },
  rowEmail: { fontSize: 13, color: colors.textSecondary },
  rowDate: { fontSize: 11, color: colors.textLight },
  rowActions: { flexShrink: 0 },
  youBadge: {
    fontSize: 11,
    fontWeight: 700,
    background: `${colors.accent}22`,
    color: colors.accent,
    border: `1px solid ${colors.accent}44`,
    borderRadius: 20,
    padding: '3px 10px',
    letterSpacing: '0.3px',
  },
  deleteBtn: {
    background: 'none',
    border: '1.5px solid #FECACA',
    borderRadius: 7,
    color: colors.error,
    cursor: 'pointer',
    fontSize: 14,
    padding: '4px 8px',
  },
};
