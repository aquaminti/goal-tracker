import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GoalCard from '../components/GoalCard';
import GoalModal from '../components/GoalModal';
import ConfirmModal from '../components/ConfirmModal';
import axios from '../api/axios';

const FILTERS = [
  { key: 'all',       label: 'Все' },
  { key: 'active',    label: 'Активные' },
  { key: 'paused',    label: 'На паузе' },
  { key: 'completed', label: 'Завершённые' },
];

export default function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data } = await axios.get('/goals');
      setGoals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form) => {
    try {
      if (editingGoal) {
        const { data } = await axios.put(`/goals/${editingGoal._id}`, form);
        setGoals((prev) => prev.map((g) => (g._id === data._id ? data : g)));
      } else {
        const { data } = await axios.post('/goals', form);
        setGoals((prev) => [data, ...prev]);
      }
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/goals/${confirmId}`);
      setGoals((prev) => prev.filter((g) => g._id !== confirmId));
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmId(null);
    }
  };

  const openCreate = () => { setEditingGoal(null); setModalOpen(true); };
  const openEdit = (goal) => { setEditingGoal(goal); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingGoal(null); };

  const filtered = filter === 'all' ? goals : goals.filter((g) => g.status === filter);

  const stats = {
    total: goals.length,
    completed: goals.filter((g) => g.status === 'completed').length,
    active: goals.filter((g) => g.status === 'active').length,
    avgProgress: goals.length
      ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)
      : 0,
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.topRow}>
          <div>
            <h1 style={styles.heading}>Мои цели</h1>
            <p style={styles.sub}>Отслеживай прогресс и достигай большего</p>
          </div>
          <button onClick={openCreate} style={styles.newBtn}>+ Новая цель</button>
        </div>

        <div style={styles.statsRow}>
          <StatCard icon="https://cdn-icons-png.flaticon.com/512/3132/3132693.png" label="Всего целей"    value={stats.total}               color="#6366f1" />
          <StatCard icon="https://cdn-icons-png.flaticon.com/512/3176/3176394.png" label="Активных"      value={stats.active}              color="#3b82f6" />
          <StatCard icon="https://cdn-icons-png.flaticon.com/512/5290/5290058.png" label="Завершено"     value={stats.completed}           color="#10b981" />
          <StatCard icon="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" label="Средний прогресс" value={`${stats.avgProgress}%`} color="#f59e0b" />
        </div>

        <div style={styles.filterRow}>
          {FILTERS.map((f) => (
            <button
              key={f.key} onClick={() => setFilter(f.key)}
              style={{ ...styles.filterBtn, ...(filter === f.key ? styles.filterActive : {}) }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={styles.empty}>Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
              alt="empty"
              style={{ width: 72, height: 72, opacity: 0.4, marginBottom: 16 }}
            />
            <h3 style={styles.emptyTitle}>Целей пока нет</h3>
            <p style={styles.emptySub}>
              {filter === 'all' ? 'Создай первую цель и начни отслеживать прогресс' : `Нет целей в этой категории`}
            </p>
            {filter === 'all' && (
              <button onClick={openCreate} style={styles.newBtn}>+ Создать цель</button>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((goal) => (
              <GoalCard key={goal._id} goal={goal} onEdit={openEdit} onDelete={(id) => setConfirmId(id)} />
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <GoalModal goal={editingGoal} onSave={handleSave} onClose={closeModal} />
      )}

      {confirmId && (
        <ConfirmModal
          title="Удалить цель?"
          message="Это действие нельзя отменить. Цель будет удалена навсегда."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTop}>
        <img src={icon} alt={label} style={{ width: 32, height: 32 }} />
        <span style={{ ...styles.statValue, color }}>{value}</span>
      </div>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fc' },
  main: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  heading: { fontWeight: 700, fontSize: 28, color: '#1a1a2e' },
  sub: { color: '#6b7280', fontSize: 14, marginTop: 4 },
  newBtn: {
    padding: '11px 22px', borderRadius: 10, border: 'none',
    background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: 14,
    cursor: 'pointer', whiteSpace: 'nowrap',
  },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 },
  statCard: {
    background: '#fff', borderRadius: 12, padding: '18px 20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex',
    flexDirection: 'column', gap: 8,
  },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statValue: { fontWeight: 700, fontSize: 26 },
  statLabel: { fontSize: 13, color: '#6b7280' },
  filterRow: { display: 'flex', gap: 8, marginBottom: 24 },
  filterBtn: {
    padding: '8px 18px', borderRadius: 99, border: '1px solid #e5e7eb',
    background: '#fff', color: '#6b7280', cursor: 'pointer', fontWeight: 500, fontSize: 13,
  },
  filterActive: { background: '#6366f1', color: '#fff', borderColor: '#6366f1' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
  empty: { textAlign: 'center', padding: 60, color: '#9ca3af' },
  emptyState: {
    textAlign: 'center', padding: '60px 20px', background: '#fff',
    borderRadius: 16, border: '1px solid #f0f0f5',
  },
  emptyTitle: { fontWeight: 600, fontSize: 18, color: '#374151', marginBottom: 8 },
  emptySub: { color: '#9ca3af', fontSize: 14, marginBottom: 24 },
};
