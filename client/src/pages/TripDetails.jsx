import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';
import axios from '../api/axios';

const STATUS = {
  planned:   { label: 'Запланировано', bg: '#dbeafe', color: '#1d4ed8' },
  ongoing:   { label: 'В пути',        bg: '#dcfce7', color: '#15803d' },
  completed: { label: 'Завершено',     bg: '#f3f4f6', color: '#6b7280' },
};

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', RUB: '₽', GBP: '£' };

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    axios.get(`/trips/${id}`)
      .then(({ data }) => setTrip(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/trips/${id}`);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  const nights = trip?.startDate && trip?.endDate
    ? Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000)
    : null;

  if (loading) return <div style={s.page}><Navbar /><div style={s.loading}>Загрузка...</div></div>;
  if (!trip) return null;

  const st = STATUS[trip.status] || STATUS.planned;
  const sym = CURRENCY_SYMBOLS[trip.currency] || trip.currency;

  return (
    <div style={s.page}>
      <Navbar />

      <div style={{ ...s.banner, background: trip.coverColor || '#0ea5e9' }}>
        <div style={s.bannerInner}>
          <button onClick={() => navigate(-1)} style={s.back}>← Назад</button>
          <div style={s.bannerContent}>
            <span style={{ ...s.badge, background: 'rgba(255,255,255,0.2)', color: '#fff' }}>{st.label}</span>
            <h1 style={s.destination}>{trip.destination}</h1>
            {trip.description && <p style={s.bannerDesc}>{trip.description}</p>}
          </div>
        </div>
      </div>

      <div style={s.main}>
        <div style={s.grid}>
          <div style={s.leftCol}>
            <div style={s.card}>
              <h2 style={s.cardTitle}>Детали поездки</h2>
              <div style={s.detailsList}>
                <DetailRow
                  icon="https://cdn-icons-png.flaticon.com/512/2693/2693507.png"
                  label="Начало" value={fmt(trip.startDate)} />
                <DetailRow
                  icon="https://cdn-icons-png.flaticon.com/512/2693/2693507.png"
                  label="Конец" value={fmt(trip.endDate)} />
                {nights !== null && (
                  <DetailRow
                    icon="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                    label="Длительность"
                    value={`${nights} ${nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}`} />
                )}
                <DetailRow
                  icon="https://cdn-icons-png.flaticon.com/512/2489/2489914.png"
                  label="Бюджет"
                  value={`${sym}${(trip.budget || 0).toLocaleString()}`} />
              </div>
            </div>

            {trip.placesToVisit?.length > 0 && (
              <div style={s.card}>
                <h2 style={s.cardTitle}>Места для посещения</h2>
                <div style={s.placesList}>
                  {trip.placesToVisit.map((p, i) => (
                    <div key={i} style={s.placeItem}>
                      <div style={s.placeNum}>{i + 1}</div>
                      <span style={s.placeName}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={s.rightCol}>
            <div style={s.card}>
              <h2 style={s.cardTitle}>Действия</h2>
              <div style={s.actionBtns}>
                <button onClick={() => navigate(`/trips/${id}/edit`)} style={s.editBtn}>
                  <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" alt="edit" style={{ width: 16, height: 16 }} />
                  Редактировать
                </button>
                <button onClick={() => setShowConfirm(true)} style={s.delBtn}>
                  <img src="https://cdn-icons-png.flaticon.com/512/3405/3405244.png" alt="del" style={{ width: 16, height: 16 }} />
                  Удалить поездку
                </button>
              </div>
            </div>

            <div style={{ ...s.card, background: trip.coverColor || '#0ea5e9' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Итого бюджет</p>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 32, marginTop: 8 }}>
                {sym}{(trip.budget || 0).toLocaleString()}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>
                {trip.currency}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          message="Поездка будет удалена навсегда."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
      <img src={icon} alt={label} style={{ width: 18, height: 18, opacity: 0.4 }} />
      <span style={{ fontSize: 13, color: '#9ca3af', width: 110, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{value}</span>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#f0f2f5' },
  loading: { textAlign: 'center', padding: 60, color: '#9ca3af' },
  banner: { padding: '40px 24px 36px' },
  bannerInner: { maxWidth: 1200, margin: '0 auto' },
  back: { background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: '6px 14px', borderRadius: 8, marginBottom: 20 },
  bannerContent: { display: 'flex', flexDirection: 'column', gap: 10 },
  badge: { padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, width: 'fit-content' },
  destination: { fontWeight: 800, fontSize: 36, color: '#fff', lineHeight: 1.2 },
  bannerDesc: { color: 'rgba(255,255,255,0.75)', fontSize: 15, maxWidth: 600, lineHeight: 1.6 },
  main: { maxWidth: 1200, margin: '0 auto', padding: '24px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18 },
  leftCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: '#fff', borderRadius: 14, padding: '20px 22px', border: '1px solid #e5e7eb' },
  cardTitle: { fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 16 },
  detailsList: {},
  placesList: { display: 'flex', flexDirection: 'column', gap: 8 },
  placeItem: { display: 'flex', alignItems: 'center', gap: 12 },
  placeNum: { width: 26, height: 26, borderRadius: '50%', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#6b7280', flexShrink: 0 },
  placeName: { fontSize: 14, color: '#374151', fontWeight: 500 },
  actionBtns: { display: 'flex', flexDirection: 'column', gap: 10 },
  editBtn: { padding: '11px 16px', borderRadius: 9, border: '1px solid #e5e7eb', background: '#fff', color: '#111827', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  delBtn: { padding: '11px 16px', borderRadius: 9, border: '1px solid #fee2e2', background: '#fff', color: '#ef4444', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
};
