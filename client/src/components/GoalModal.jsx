import { useState, useEffect } from 'react';

const initialForm = { title: '', description: '', deadline: '', progress: 0, status: 'active' };

export default function GoalModal({ goal, onSave, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goal) {
      setForm({
        title: goal.title || '',
        description: goal.description || '',
        deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
        progress: goal.progress ?? 0,
        status: goal.status || 'active',
      });
    }
  }, [goal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'progress' ? Number(value) : value }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setError('Название обязательно');
      return;
    }
    onSave(form);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{goal ? 'Редактировать цель' : 'Новая цель'}</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.fields}>
          <div style={styles.field}>
            <label style={styles.label}>Название *</label>
            <input
              name="title" value={form.title} onChange={handleChange}
              placeholder="Например: выучить испанский"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Описание</label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              placeholder="Подробнее о цели..."
              rows={3} style={{ ...styles.input, resize: 'vertical' }}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Дедлайн</label>
              <input
                type="date" name="deadline" value={form.deadline}
                onChange={handleChange} style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Статус</label>
              <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
                <option value="active">Активна</option>
                <option value="paused">На паузе</option>
                <option value="completed">Завершена</option>
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Прогресс — {form.progress}%</label>
            <input
              type="range" name="progress" min={0} max={100}
              value={form.progress} onChange={handleChange}
              style={{ width: '100%', accentColor: '#6366f1' }}
            />
            <div style={styles.rangeLabels}>
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: 13 }}>{error}</p>}
        </div>

        <div style={styles.modalFooter}>
          <button onClick={onClose} style={styles.cancelBtn}>Отмена</button>
          <button onClick={handleSubmit} style={styles.saveBtn}>
            {goal ? 'Сохранить' : 'Создать цель'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    backdropFilter: 'blur(2px)',
  },
  modal: {
    background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520,
    margin: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px', borderBottom: '1px solid #f0f0f5',
  },
  modalTitle: { fontWeight: 700, fontSize: 18, color: '#1a1a2e' },
  closeBtn: {
    background: 'none', border: 'none', fontSize: 18,
    cursor: 'pointer', color: '#9ca3af', padding: 4,
  },
  fields: { padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  label: { fontSize: 13, fontWeight: 500, color: '#374151' },
  input: {
    padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb',
    fontSize: 14, color: '#1a1a2e', outline: 'none',
  },
  rangeLabels: { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 },
  modalFooter: {
    display: 'flex', gap: 12, justifyContent: 'flex-end',
    padding: '16px 24px', borderTop: '1px solid #f0f0f5',
  },
  cancelBtn: {
    padding: '10px 20px', borderRadius: 8, border: '1px solid #e5e7eb',
    background: '#fff', color: '#374151', cursor: 'pointer', fontWeight: 500, fontSize: 14,
  },
  saveBtn: {
    padding: '10px 24px', borderRadius: 8, border: 'none',
    background: '#6366f1', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14,
  },
};
