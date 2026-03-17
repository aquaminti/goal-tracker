import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3132/3132693.png"
          alt="logo"
          style={{ width: 28, height: 28 }}
        />
        <span>GoalTracker</span>
      </div>
      <button onClick={handleLogout} style={styles.btn}>Выйти</button>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 32px', height: 64,
    background: '#fff', borderBottom: '1px solid #e5e7eb',
    position: 'sticky', top: 0, zIndex: 100,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontWeight: 700, fontSize: 20, color: '#6366f1', letterSpacing: '-0.5px',
  },
  btn: {
    padding: '8px 18px', borderRadius: 8, border: 'none',
    background: '#f3f4f6', color: '#374151', cursor: 'pointer',
    fontWeight: 500, fontSize: 14,
  },
};
