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
    