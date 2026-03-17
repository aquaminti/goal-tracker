import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={s.header}>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
            alt="map"
            style={{ width: 24, height: 24, filter: 'brightness(0) invert(1)' }}
          />
          <span>Wanderly</span>
        </Link>

        <nav style={s.nav}>
          <Link to="/" style={s.navLink}>Мои поездки</Link>
          <Link to="/trips/new" style={s.newBtn}>+ Новая поездка</Link>
          <div style={s.userChip}>
            <div style={s.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
            <button onClick={() => { logout(); navigate('/login'); }} style={s.logoutBtn}>
              Выйти
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

const s = {
  header: {
    background: '#111827',
    borderBottom: '1px solid #1f2937',
    position: 'sticky', top: 0, zIndex: 100,
  },
  inner: {
    maxWidth: 1200, margin: '0 auto',
    padding: '0 24px', height: 60,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    textDecoration: 'none', color: '#fff',
    fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px',
  },
  nav: { display: 'flex', alignItems: 'center', gap: 8 },
  navLink: {
    color: '#9ca3af', textDecoration: 'none', fontSize: 14,
    fontWeight: 500, padding: '6px 12px', borderRadius: 8,
    transition: 'color 0.2s',
  },
  newBtn: {
    background: '#0ea5e9', color: '#fff', textDecoration: 'none',
    padding: '8px 16px', borderRadius: 8, fontSize: 13,
    fontWeight: 600, marginLeft: 8,
  },
  userChip: { display: 'flex', alignItems: 'center', gap: 10, marginLeft: 16 },
  avatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: '#374151', color: '#e5e7eb',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 13,
  },
  logoutBtn: {
    background: 'none', border: 'none', color: '#6b7280',
    cursor: 'pointer', fontSize: 13, fontWeight: 500,
  },
};
