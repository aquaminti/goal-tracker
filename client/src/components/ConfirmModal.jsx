export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={s.overlay} onClick={onCancel}>
      <div style={s.box} onClick={(e) => e.stopPropagation()}>
        <div style={s.iconWrap}>
          <img src="https://cdn-icons-png.flaticon.com/512/6711/6711656.png" alt="warn" style={{ width: 44, height: 44 }} />
        </div>
        <h3 style={s.title}>Удалить поездку?</h3>
        <p style={s.msg}>{message}</p>
        <div style={s.btns}>
          <button onClick={onCancel} style={s.cancel}>Отмена</button>
          <button onClick={onConfirm} style={s.confirm}>Да, удалить</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' },
  box: { background: '#fff', borderRadius: 18, padding: '36px 32px', maxWidth: 380, width: '100%', margin: 16, textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' },
  iconWrap: { marginBottom: 16 },
  title: { fontWeight: 700, fontSize: 20, color: '#111827', marginBottom: 8 },
  msg: { fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 28 },
  btns: { display: 'flex', gap: 10 },
  cancel: { flex: 1, padding: '11px', borderRadius: 9, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  confirm: { flex: 1, padding: '11px', borderRadius: 9, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
};
