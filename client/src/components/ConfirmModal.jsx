export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.iconWrap}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/6711/6711656.png"
            alt="delete"
            style={{ width: 48, height: 48 }}
          />
        </div>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button onClick={onCancel} style={styles.cancelBtn}>Отмена</button>
          <button onClick={onConfirm} style={styles.confirmBtn}>Удалить</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2000, backdropFilter: 'blur(3px)',
  },
  modal: {
    background: '#fff', borderRadius: 20, padding: '36px 32px',
    width: '100%', maxWidth: 380, textAlign: 'center',
    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
    animation: 'fadeIn 0.15s ease',
  },
  iconWrap: { marginBottom: 16 },
  title: { fontWeight: 700, fontSize: 20, color: '#1a1a2e', marginBottom: 8 },
  message: { fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 28 },
  actions: { display: 'flex', gap: 12 },
  cancelBtn: {
    flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #e5e7eb',
    background: '#fff', color: '#374151', cursor: 'pointer', fontWeight: 600, fontSize: 14,
  },
  confirmBtn: {
    flex: 1, padding: '12px', borderRadius: 10, border: 'none',
    background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14,
  },
};
