import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&auto=format&fit=crop"
          alt="travel"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={s.overlay}>
          <div style={s.quote}>
            <p style={s.quoteText}>«Мир — это книга. Кто не путешествует — читает лишь одну страницу.»</p>
            <span style={s.quoteAuthor}>— Блаженный Августин</span>
          </div>
        </div>
      </div>

      <div style={s.right}>
        <div style={s.form}>
          <div style={s.brand}>
            <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="logo" style={{ width: 32, height: 32 }} />
            <span style={s.brandName}>Wanderly</span>
          </div>

          <h1 style={s.heading}>С возвращением</h1>
          <p style={s.sub}>Войди в свой аккаунт</p>

          <form onSubmit={handleSubmit} style={s.fields}>
            <div style={s.field}>
              <label style={s.label}>Email</label>
              <input
                type="email" value={form.email} placeholder="you@example.com"
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                style={s.input} required
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Пароль</label>
              <input
                type="password" value={form.password} placeholder="••••••••"
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                style={s.input} required
              />
            </div>
            {error && <div style={s.error}>{error}</div>}
            <button type="submit" style={s.btn} disabled={loading}>
              {loading ? 'Входим...' : 'Войти'}
            </button>
          </form>

          <p style={s.footer}>
            Нет аккаунта?{' '}
            <Link to="/register" style={s.link}>Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', minHeight: '100vh' },
  left: { flex: 1, position: 'relative', display: 'none', '@media(min-width:768px)': { display: 'block' } },
  overlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)', display: 'flex', alignItems: 'flex-end', padding: 40 },
  quote: {},
  quoteText: { color: '#fff', fontSize: 16, fontStyle: 'italic', lineHeight: 1.6, marginBottom: 8 },
  quoteAuthor: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  right: { width: '100%', maxWidth: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '40px 24px' },
  form: { width: '100%', maxWidth: 360 },
  brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 },
  brandName: { fontWeight: 800, fontSize: 20, color: '#111827' },
  heading: { fontWeight: 800, fontSize: 28, color: '#111827', marginBottom: 6 },
  sub: { color: '#6b7280', fontSize: 14, marginBottom: 32 },
  fields: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  input: { padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, color: '#111827', outline: 'none', transition: 'border-color 0.2s' },
  error: { background: '#fef2f2', color: '#ef4444', fontSize: 13, padding: '10px 14px', borderRadius: 9 },
  btn: { padding: '13px', borderRadius: 10, border: 'none', background: '#111827', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 4 },
  footer: { textAlign: 'center', marginTop: 28, fontSize: 14, color: '#6b7280' },
  link: { color: '#0ea5e9', fontWeight: 600, textDecoration: 'none' },
};
