import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategories, createListing, updateListing, getListings } from '../services/api';

const TYPES = ['profissional', 'empresa', 'fornecedor'];
const STATES = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

export default function ListingForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category_id: '',
    type: '',
    description: '',
    services: '',
    city: '',
    state: '',
    whatsapp: '',
    phone: '',
    website: '',
    photo_url: '',
    featured: false,
    active: true,
    approved: false,
    sort_order: 0,
  });

  useEffect(() => {
    getCategories().then(setCategories);
    if (isEdit) {
      // carrega o listing do admin/all pelo id
      // como não temos GET /admin/:id, usamos /api/listings/:id diretamente
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('equesto_token')}` },
      })
        .then(r => r.json())
        .then(data => {
          setForm({
            name: data.name || '',
            category_id: data.category_id || '',
            type: data.type || '',
            description: data.description || '',
            services: (data.services || []).join('\n'),
            city: data.city || '',
            state: data.state || '',
            whatsapp: data.whatsapp || '',
            phone: data.phone || '',
            website: data.website || '',
            photo_url: data.photo_url || '',
            featured: data.featured || false,
            active: data.active !== false,
            approved: data.approved || false,
            sort_order: data.sort_order || 0,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('Nome é obrigatório');
    setSaving(true);
    try {
      const payload = {
        ...form,
        services: form.services
          ? form.services.split('\n').map(s => s.trim()).filter(Boolean)
          : [],
        sort_order: parseInt(form.sort_order) || 0,
      };
      if (isEdit) {
        await updateListing(id, payload);
      } else {
        await createListing(payload);
      }
      navigate('/listings');
    } catch (err) {
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40, color: '#6B6B6B' }}>Carregando...</div>;

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <h1 style={s.h1}>{isEdit ? 'Editar Anúncio' : 'Novo Anúncio'}</h1>
        <button style={s.backBtn} onClick={() => navigate('/listings')}>← Voltar</button>
      </div>

      <form onSubmit={handleSubmit} style={s.form}>
        <div style={s.grid2}>
          <Field label="Nome *">
            <input style={s.input} value={form.name} onChange={e => set('name', e.target.value)} required />
          </Field>
          <Field label="WhatsApp">
            <input style={s.input} value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="5511999999999" />
          </Field>
        </div>

        <div style={s.grid3}>
          <Field label="Categoria">
            <select style={s.input} value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">Selecionar...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Tipo">
            <select style={s.input} value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="">Selecionar...</option>
              {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </Field>
          <Field label="Cidade">
            <input style={s.input} value={form.city} onChange={e => set('city', e.target.value)} />
          </Field>
        </div>

        <div style={s.grid3}>
          <Field label="Estado">
            <select style={s.input} value={form.state} onChange={e => set('state', e.target.value)}>
              <option value="">UF</option>
              {STATES.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </Field>
          <Field label="Telefone">
            <input style={s.input} value={form.phone} onChange={e => set('phone', e.target.value)} />
          </Field>
          <Field label="Site">
            <input style={s.input} value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://..." />
          </Field>
        </div>

        <Field label="URL da Foto / Logo">
          <input style={s.input} value={form.photo_url} onChange={e => set('photo_url', e.target.value)} placeholder="https://..." />
        </Field>

        <Field label="Descrição">
          <textarea style={{ ...s.input, minHeight: 90, resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} />
        </Field>

        <Field label="Serviços (um por linha)">
          <textarea style={{ ...s.input, minHeight: 80, resize: 'vertical' }} value={form.services} onChange={e => set('services', e.target.value)} placeholder="Consultas\nCirurgias\nExames..." />
        </Field>

        <div style={s.checkboxRow}>
          <CheckField label="✅ Aprovado" checked={form.approved} onChange={v => set('approved', v)} />
          <CheckField label="⭐ Destaque" checked={form.featured} onChange={v => set('featured', v)} />
          <CheckField label="🟢 Ativo" checked={form.active} onChange={v => set('active', v)} />
        </div>

        <Field label="Ordem (menor = primeiro)">
          <input style={{ ...s.input, maxWidth: 120 }} type="number" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} />
        </Field>

        <div style={s.actions}>
          <button style={s.cancelBtn} type="button" onClick={() => navigate('/listings')}>Cancelar</button>
          <button style={s.saveBtn} type="submit" disabled={saving}>
            {saving ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Anúncio'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</label>
      {children}
    </div>
  );
}

function CheckField({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: 16, height: 16 }} />
      {label}
    </label>
  );
}

const s = {
  wrap: { maxWidth: 780 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  h1: { fontSize: 22, fontWeight: 800, color: '#1A1A1A' },
  backBtn: { background: 'none', border: '1.5px solid #E8E4DC', borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1B4332' },
  form: { background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 16 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 },
  input: { padding: '9px 12px', border: '1.5px solid #E8E4DC', borderRadius: 8, fontSize: 13, outline: 'none', width: '100%', fontFamily: 'inherit' },
  checkboxRow: { display: 'flex', gap: 24, flexWrap: 'wrap' },
  actions: { display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 },
  cancelBtn: { padding: '10px 20px', border: '1.5px solid #E8E4DC', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  saveBtn: { padding: '10px 24px', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' },
};
