import { useNavigate } from 'react-router-dom';

const STATUS = {
  planned:   { label: 'Запланировано', bg: '#dbeafe', color: '#1d4ed8' },
  ongoing:   { label: 'В пути',        bg: '#dcfce7', color: '#15803d' },
  completed: { label: 'Завершено',     bg: '#f3f4f6', color: '#6b7280' },
};

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', RUB: '₽', GBP: '£' };

export default function TripCard({ trip, onDelete }) {
  const navigate = useNavigate();
  const st = STATUS[trip.status] || STATUS.planned;
  const sym = CURRENCY_SYMBOLS[trip.currency] || trip.currency;

  const nights =
    trip.startDate && trip.endDate
      ? Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000)
      : null;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

  return (
    <div style={s.card} onClick={() => navigate(`/trips/${trip._id}`)}>
      <div style={{ ...s.colorBar, background: trip.coverColor || '#0ea5e9' }} />

      <div style={s.body}>
        <div style={s.topRow}>
          <span style={{ ...s.badge, background: st.bg, color: st.color }}>{st.label}</span>
          {nights !== null && (
            <span style={s.nights}>{nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}</span>
          )}
        </div>

        <h3 style={s.destination}>{trip.destination}</h3>
        {trip.description && <p style={s.desc}>{trip.description}</p>}

        {(trip.startDate || trip.endDate) && (
          <div style={s.dates}>
            <img src="https://cdn-icons-png.flaticon.com/512/2693/2693507.png" alt="cal" style={{ width: 13, height: 13, opacity: 0.5 }} />
            <span>{formatDate(trip.startDate)}{trip.endDate ? ` — ${formatDate(trip.endDate)}` : ''}</span>
          </div>
        )}

        {trip.placesToVisit?.length > 0 && (
          <div style={s.places}>
            {trip.placesToVisit.slice(0, 3).map((p, i) => (
              <span key={i} style={s.placeTag}>{p}</span>
            ))}
            {trip.placesToVisit.length > 3 && (
              <span style={s.placeTag}>+{trip.placesToVisit.length - 3}</span>
            )}
          </div>
        )}

        <div style={s.footer}>
          <div style={s.budget}>
            <img src="https://cdn-icons-png.flaticon.com/512/2489/2489914.png" alt="budget" style={{ width: 14, height: 14, opacity: 0.5 }} />
            <span>{sym}{trip.budget?.toLocaleString()}</span>
          </div>
          <div style={s.actions} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => navigate(`/trips/${trip._id}/edit`)} style={s.editBtn}>
              Изменить
            </button>
            <button onClick={() => onDelete(trip._id)} style={s.delBtn}>
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: {
    background: '#fff', borderRadius: 16, overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb',
    cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
    display: 'flex', flexDirection: 'column',
  },
  colorBar: { height: 6, flexShrink: 0 },
  body: { padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: { padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600 },
  nights: { fontSize: 12, color: '#9ca3af' },
  destination: { fontWeight: 700, fontSize: 18, color: '#111827', lineHeight: 1.3 },
  desc: { fontSize: 13, color: '#6b7280', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  dates: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' },
  places: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  placeTag: { background: '#f3f4f6', color: '#374151', fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 500 },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 12, borderTop: '1px solid #f3f4f6' },
  budget: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, fontWeight: 700, color: '#111827' },
  actions: { display: 'flex', gap: 6 },
  editBtn: { padding: '6px 12px', borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 12, fontWeight: 500, cursor: 'pointer' },
  delBtn: { padding: '6px 12px', borderRadius: 7, border: '1px solid #fee2e2', background: '#fff', color: '#ef4444', fontSize: 12, fontWeight: 500, cursor: 'pointer' },
};
