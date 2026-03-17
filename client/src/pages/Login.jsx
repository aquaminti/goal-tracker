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

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <img src="https://cdn-icons-png.flaticon.com/512/3132/3132693.png" alt="logo" style={{ width: 36, height: 36 }} />
          <span>GoalTracker</span>
        </div>
        <h1 style={styles.heading}>Добро пожаловать</h1>
        <p style={styles.sub}>Войди, чтобы продолжить</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com"
              style={styles.input} required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Пароль</label>
            <input
              type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="••••••••"
              style={styles.input} required
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <p style={styles.footer}>
          Нет аккаунта?{' '}
          <Link to="/register" style={styles.link}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
    padding: 16,
  },
  card: {
    background: '#fff', borderRadius: 20, padding: '40px 36px',
    width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(99,102,241,0.1)',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontWeight: 800, fontSize: 22, color: '#6366f1', marginBottom: 24,
  },
  heading: { fontWeight: 700, fontSize: 26, color: '#1a1a2e', marginBottom: 6 },
  sub: { color: '#6b7280', fontSize: 14, marginBottom: 28 },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: '#374151' },
  input: {
    padding: '12px 14px', borderRadius: 10, border: '1px solid #e5e7eb',
    fontSize: 14, color: '#1a1a2e', outline: 'none',
  },
  error: { color: '#ef4444', fontSize: 13, background: '#fef2f2', padding: '10px 12px', borderRadius: 8 },
  btn: {
    padding: '13px', borderRadius: 10, border: 'none',
    background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: 15,
    cursor: 'pointer', marginTop: 4,
  },
  footer: { textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b7280' },
  link: { color: '#6366f1', fontWeight: 600, textDecoration: 'none' },
};
