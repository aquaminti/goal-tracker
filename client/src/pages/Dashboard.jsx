import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TripCard from '../components/TripCard';
import ConfirmModal from '../components/ConfirmModal';
import axios from '../api/axios';

const FILTERS = [
  { key: 'all',       label: 'Все' },
  { key: 'planned',   label: 'Запланированные' },
  { key: 'ongoing',   label: 'В пути' },
  { key: 'completed', label: 'Завершённые' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchTrips(); }, []);

  const fetchTrips = async () => {
    try {
      const { data } = await axios.get('/trips');
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/trips/${deleteId}`);
      setTrips((prev) => prev.filter((t) => t._id !== deleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = filter === 'all' ? trips : trips.filter((t) => t.status === filter);

  const totalBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0);
  const upcoming = trips.filter((t) => t.status === 'planned').length;
  const completed = trips.filter((t) => t.status === 'completed').length;

  return (
    <div style={s.page}>
      <Navbar />

      <div style={s.hero}>
        <div style={s.heroInner}>
          <h1 style={s.heroTitle}>Привет, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={s.heroSub}>Все твои путешествия в одном месте</p>
        </div>
        <div style={s.stats}>
          <StatBox icon="https://cdn-icons-png.flaticon.com/512/854/854878.png" value={trips.length} label="Поездок" />
          <StatBox icon="https://cdn-icons-png.flaticon.com/512/3132/3132693.png" value={upcoming}     label="Предстоит" />
          <StatBox icon="https://cdn-icons-png.flaticon.com/512/5290/5290058.png" value={completed}    label="Завершено" />
          <StatBox icon="https://cdn-icons-png.flaticon.com/512/2489/2489914.png" value={`$${totalBudget.toLocaleString()}`} label="Бюджет" />
        </div>
      </div>

      <main style={s.main}>
        <div style={s.toolbar}>
          <div style={s.filterRow}>
            {FILTERS.map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                style={{ ...s.filterBtn, ...(filter === f.key ? s.filterActive : {}) }}>
                {f.label}
              </button>
            ))}
          </div>
          <button onClick={() => navigate('/trips/new')} style={s.addBtn}>
            + Добавить поездку
          </button>
        </div>

        {loading ? (
          <div style={s.empty}>Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div style={s.emptyState}>
            <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="empty" style={{ width: 64, height: 64, opacity: 0.2, marginBottom: 16 }} />
            <h3 style={s.emptyTitle}>Поездок нет</h3>
            <p style={s.emptySub}>
              {filter === 'all' ? 'Запланируй своё первое путешествие' : 'В этой категории пока ничего нет'}
            </p>
            {filter === 'all' && (
              <button onClick={() => navigate('/trips/new')} style={s.addBtn}>+ Добавить поездку</button>
            )}
          </div>
        ) : (
          <div style={s.grid}>
            {filtered.map((trip) => (
              <TripCard key={trip._id} trip={trip} onDelete={(id) => setDeleteId(id)} />
            ))}
          </div>
        )}
      </main>

      {deleteId && (
        <ConfirmModal
          message="Поездка будет удалена навсегда. Это действие нельзя отменить."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

function StatBox({ icon, value, label }) {
  return (
    <div style={s.statBox}>
      <img src={icon} alt={label} style={{ width: 20, height: 20, opacity: 0.7, marginBottom: 8 }} />
      <div style={s.statValue}>{value}</div>
      <div style={s.statLabel}>{label}</div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#f0f2f5' },
  hero: { background: '#111827', padding: '32px 24px 28px', display: 'flex', flexDirection: 'column', gap: 24 },
  heroInner: { maxWidth: 1200, margin: '0 auto', width: '100%' },
  heroTitle: { fontWeight: 800, fontSize: 26, color: '#fff' },
  heroSub: { color: '#9ca3af', fontSize: 14, marginTop: 4 },
  stats: { maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 },
  statBox: { background: '#1f2937', borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  statValue: { fontWeight: 800, fontSize: 22, color: '#fff' },
  statLabel: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  main: { maxWidth: 1200, margin: '0 auto', padding: '28px 24px' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  filterRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  filterBtn: { padding: '7px 16px', borderRadius: 99, border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  filterActive: { background: '#111827', color: '#fff', borderColor: '#111827' },
  addBtn: { padding: '10px 20px', borderRadius: 9, border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 },
  empty: { textAlign: 'center', padding: 60, color: '#9ca3af' },
  emptyState: { textAlign: 'center', padding: '64px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' },
  emptyTitle: { fontWeight: 700, fontSize: 18, color: '#374151', marginBottom: 8 },
  emptySub: { color: '#9ca3af', fontSize: 14, marginBottom: 24 },
};
