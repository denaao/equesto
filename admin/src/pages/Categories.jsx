import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

const GROUPS = ['Profissionais', 'Serviços', 'Estrutura e Criação', 'Fornecedores', 'Mercado', 'Informação', 'Outros'];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | { ...category }
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', group_name: '', icon: '', sort_order: 0, active: true });

  const load = () => getCategories().then(setCategories);
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ name: '', slug: '', group_name: '', icon: '', sort_order: 0, active: true });
    setEditing('new');
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug, group_name: cat.group_name || '', icon: cat.icon || '', sort_order: cat.sort_order || 0, active: cat.active });
    setEditing(cat);
  };

  const handleSlug = (name) => {
    return name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const set = (k, v) => {
    setForm(prev => {
      const next = { ...prev, [k]: v };
      if (k === 'name' && editing === 'new') next.slug = handleSlug(v);
      return next;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.slug) return alert('Nome e slug são obrigatórios');
    setSaving(true);
    try {
      if (editing === 'new') {
        await createCategory(form);
      } else {
        await updateCategory(editing.id, form);
      }
      setEditing(null);
      load();
    } catch (err) {
      alert('Erro: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Excluir "${name}"?`)) return;
    try {
      await deleteCategory(id);
      load();
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const grouped = GROUPS.reduce((acc, g) => {
    acc[g] = categories.filter(c => c.group_name === g);
    return acc;
  }, {});

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.h1}>Categorias</h1>
        <button style={s.newBtn} onClick={openNew}>+ Nova Categoria</button>
      </div>

      {/* Modal de edição */}
      {editing && (
        <div style={s.overlay} onClick={() => setEditing(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>{editing === 'new' ? 'Nova Categoria' : 'Editar Categoria'}</h2>
            <form onSubmit={handleSave} style={s.form}>
              <div style={s.grid2}>
                <Field label="Nome *">
                  <input style={s.input} value={form.name} onChange={e => set('name', e.target.value)} required autoFocus />
                </Field>
                <Field label="Slug *">
                  <input style={s.input} value={form.slug} onChange={e => set('slug', e.target.value)} required />
                </Field>
              </div>
              <div style={s.grid2}>
                <Field label="Grupo">
                  <select style={s.input} value={form.group_name} onChange={e => set('group_name', e.target.value)}>
                    <option value="">Selecionar...</option>
                    {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label="Ícone">
                  <input style={s.input} value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="ex: stethoscope" />
                </Field>
              </div>
              <div style={s.grid2}>
                <Field label="Ordem">
                  <input style={s.input} type="number" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} />
                </Field>
                <Field label="">
                  <label style={s.checkLabel}>
                    <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} />
                    Ativa
                  </label>
                </Field>
              </div>
              <div style={s.actions}>
                <button type="button" style={s.cancelBtn} onClick={() => setEditing(null)}>Cancelar</button>
                <button type="submit" style={s.saveBtn} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista por grupo */}
      {Object.entries(grouped).map(([group, cats]) => cats.length > 0 && (
        <div key={group} style={s.groupSection}>
          <h2 style={s.groupTitle}>{group}</h2>
          <div style={s.tableWrap}>
            {cats.map(cat => (
              <div key={cat.id} style={s.row}>
                <span style={s.catName}>{cat.name}</span>
                <span style={s.catSlug}>{cat.slug}</span>
                <span style={{ ...s.badge, ...(cat.active ? s.badgeGreen : s.badgeGray) }}>
                  {cat.active ? 'Ativa' : 'Inativa'}
                </span>
                <div style={s.rowActions}>
                  <button style={s.editBtn} onClick={() => openEdit(cat)}>Editar</button>
                  <button style={s.deleteBtn} onClick={() => handleDelete(cat.id, cat.name)}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</label>}
      {children}
    </div>
  );
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  h1: { fontSize: 24, fontWeight: 800, color: '#1A1A1A' },
  newBtn: { background: '#1B4332', color: '#fff', padding: '9px 18px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  groupSection: { marginBottom: 24 },
  groupTitle: { fontSize: 13, fontWeight: 700, color: '#C9A227', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  tableWrap: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  row: { display: 'flex', alignItems: 'center', gap: 16, padding: '11px 16px', borderBottom: '1px solid #E8E4DC' },
  catName: { flex: 2, fontSize: 14, fontWeight: 600, color: '#1A1A1A' },
  catSlug: { flex: 2, fontSize: 12, color: '#9E9E9E', fontFamily: 'monospace' },
  badge: { fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 },
  badgeGreen: { background: '#E8F5E9', color: '#2E7D32' },
  badgeGray: { background: '#F5F5F5', color: '#9E9E9E' },
  rowActions: { display: 'flex', gap: 10, marginLeft: 'auto' },
  editBtn: { color: '#1B4332', background: 'none', border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer' },
  deleteBtn: { color: '#C62828', background: 'none', border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 520, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalTitle: { fontSize: 18, fontWeight: 800, color: '#1A1A1A', marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  input: { padding: '8px 12px', border: '1.5px solid #E8E4DC', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 20 },
  actions: { display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 },
  cancelBtn: { padding: '9px 18px', border: '1.5px solid #E8E4DC', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  saveBtn: { padding: '9px 22px', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' },
};
