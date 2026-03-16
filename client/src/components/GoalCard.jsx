import ProgressBar from './ProgressBar';

const statusConfig = {
  active:    { bg: '#eff6ff', text: '#3b82f6', label: 'Активна' },
  completed: { bg: '#f0fdf4', text: '#10b981', label: 'Завершена' },
  paused:    { bg: '#fefce8', text: '#f59e0b', label: 'На паузе' },
};

export default function GoalCard({ goal, onEdit, onDelete }) {
  const deadline = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && goal.status !== 'completed';
  const s = statusConfig[goal.status] || statusConfig.active;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={{ flex: 1 }}>
          <h3 style={styles.title}>{goal.title}</h3>
          {goal.description && <p style={styles.desc}>{goal.description}</p>}
        </div>
        <span style={{ ...styles.badge, background: s.bg, color: s.text }}>
          {s.label}
        </span>
      </div>

      <div style={{ margin: '16px 0 8px' }}>
        <div style={styles.progressLabel}>
          <span style={{ color: '#6b7280', fontSize: 13 }}>Прогресс</span>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>{goal.progress}%</span>
        </div>
        <ProgressBar value={goal.progress} />
      </div>

      {deadline && (
        <div style={{ ...styles.deadlineRow, color: isOverdue ? '#ef4444' : '#9ca3af' }}>
          <img
            src={
              isOverdue
                ? 'https://cdn-icons-png.flaticon.com/512/2797/2797387.png'
                : 'https://cdn-icons-png.flaticon.com/512/2693/2693507.png'
            }
            alt="deadline"
            style={{ width: 14, height: 14 }}
          />
          <span>{isOverdue ? 'Просрочено · ' : ''}{deadline}</span>
        </div>
      )}

      <div style={styles.actions}>
        <button onClick={() => onEdit(goal)} style={styles.editBtn}>
          <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" alt="edit" style={{ width: 14, height: 14 }} />
          Редактировать
        </button>
        <button onClick={() => onDelete(goal._id)} style={styles.deleteBtn}>
          <img src="https://cdn-icons-png.flaticon.com/512/3405/3405244.png" alt="delete" style={{ width: 14, height: 14 }} />
          Удалить
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff', borderRadius: 14, padding: '20px 24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1px solid #f0f0f5',
    transition: 'box-shadow 0.2s',
  },
  header: { display: 'flex', gap: 12, alignItems: 'flex-start' },
  title: { fontWeight: 600, fontSize: 16, color: '#1a1a2e', marginBottom: 4 },
  desc: { fontSize: 13, color: '#6b7280', lineHeight: 1.5 },
  badge: {
    padding: '4px 10px', borderRadius: 99, fontSize: 12,
    fontWeight: 600, whiteSpace: 'nowrap',
  },
  progressLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
  deadlineRow: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, marginTop: 10 },
  actions: { display: 'flex', gap: 8, marginTop: 16 },
  editBtn: {
    flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid #e5e7eb',
    background: '#fff', color: '#374151', cursor: 'pointer', fontWeight: 500, fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  deleteBtn: {
    flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid #fee2e2',
    background: '#fff', color: '#ef4444', cursor: 'pointer', fontWeight: 500, fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
};
