import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from '../api/axios';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
const CURRENCIES = ['USD', 'EUR', 'RUB', 'GBP'];

const empty = { destination: '', description: '', startDate: '', endDate: '', budget: '', currency: 'USD', placesToVisit: [], status: 'planned', coverColor: '#0ea5e9' };

export default function TripForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(empty);
  const [placeInput, setPlaceInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    axios.get(`/trips/${id}`)
      .then(({ data }) => {
        setForm({
          destination: data.destination || '',
          description: data.description || '',
          startDate: data.startDate ? data.startDate.split('T')[0] : '',
          endDate: data.endDate ? data.endDate.split('T')[0] : '',
          budget: data.budget ?? '',
          currency: data.currency || 'USD',
          placesToVisit: data.placesToVisit || [],
          status: data.status || 'planned',
          coverColor: data.coverColor || '#0ea5e9',
        });
      })
      .catch(() => navigate('/'))
      .finally(() => setFetching(false));
  }, [id, isEdit, navigate]);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const addPlace = () => {
    const val = placeInput.trim();
    if (!val || form.placesToVisit.includes(val)) return;
    set('placesToVisit', [...form.placesToVisit, val]);
    setPlaceInput('');
  };

  const removePlace = (p) => set('placesToVisit', form.placesToVisit.filter((x) => x !== p));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.destination.trim()) { setError('Укажи место назначения'); return; }
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/trips/${id}`, form);
      } else {
        await axios.post('/trips', form);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={s.page}><Navbar /><div style={s.loading}>Загрузка...</div></div>;

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.wrapper}>
        <div style={s.header}>
          <button onClick={() => navigate(-1)} style={s.back}>← Назад</button>
          <h1 style={s.title}>{isEdit ? 'Редактировать поездку' : 'Новая поездка'}</h1>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.grid2}>
            <div style={s.card}>
              <h2 style={s.cardTitle}>Основная информация</h2>
              <div style={s.fields}>
                <Field label="Место назначения *">
                  <input value={form.destination} onChange={(e) => set('destination', e.target.value)}
                    placeholder="Например: Токио, Япония" style={s.input} />
                </Field>
                <Field label="Описание">
                  <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
                    placeholder="Расскажи о поездке..." rows={4} style={{ ...s.input, resize: 'vertical' }} />
                </Field>
                <Field label="Статус">
                  <select value={form.status} onChange={(e) => set('status', e.target.value)} style={s.input}>
                    <option value="planned">Запланировано</option>
                    <option value="ongoing">В пути</option>
                    <option value="completed">Завершено</option>
                  </select>
                </Field>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={s.card}>
                <h2 style={s.cardTitle}>Даты и бюджет</h2>
                <div style={s.fields}>
                  <div style={s.row2}>
                    <Field label="Дата начала">
                      <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} style={s.input} />
                    </Field>
                    <Field label="Дата окончания">
                      <input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} style={s.input} />
                    </Field>
                  </div>
                  <div style={s.row2}>
                    <Field label="Бюджет">
                      <input type="number" min={0} value={form.budget} onChange={(e) => set('budget', e.target.value)}
                        placeholder="0" style={s.input} />
                    </Field>
                    <Field label="Валюта">
                      <select value={form.currency} onChange={(e) => set('currency', e.target.value)} style={s.input}>
                        {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>
              </div>

              <div style={s.card}>
                <h2 style={s.cardTitle}>Цвет карточки</h2>
                <div style={s.colorRow}>
                  {COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => set('coverColor', c)}
                      style={{ ...s.colorDot, background: c, outline: form.coverColor === c ? `3px solid ${c}` : 'none', outlineOffset: 2 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={s.card}>
            <h2 style={s.cardTitle}>Места для посещения</h2>
            <div style={s.placeInputRow}>
              <input value={placeInput} onChange={(e) => setPlaceInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPlace(); }}}
                placeholder="Название места..." style={{ ...s.input, flex: 1 }} />
              <button type="button" onClick={addPlace} style={s.addPlaceBtn}>Добавить</button>
            </div>
            {form.placesToVisit.length > 0 && (
              <div style={s.tags}>
                {form.placesToVisit.map((p) => (
                  <div key={p} style={s.tag}>
                    <span>{p}</span>
                    <button type="button" onClick={() => removePlace(p)} style={s.tagRemove}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <div style={s.error}>{error}</div>}

          <div style={s.formFooter}>
            <button type="button" onClick={() => navigate(-1)} style={s.cancelBtn}>Отмена</button>
            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? 'Сохраняем...' : isEdit ? 'Сохранить изменения' : 'Создать поездку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</label>
      {children}
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#f0f2f5' },
  loading: { textAlign: 'center', padding: 60, color: '#9ca3af' },
  wrapper: { maxWidth: 900, margin: '0 auto', padding: '28px 24px' },
  header: { marginBottom: 24 },
  back: { background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: 0, marginBottom: 10 },
  title: { fontWeight: 800, fontSize: 24, color: '#111827' },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card: { background: '#fff', borderRadius: 14, padding: '20px 22px', border: '1px solid #e5e7eb' },
  cardTitle: { fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 16 },
  fields: { display: 'flex', flexDirection: 'column', gap: 14 },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  input: { padding: '10px 12px', borderRadius: 9, border: '1.5px solid #e5e7eb', fontSize: 14, color: '#111827', outline: 'none', width: '100%' },
  colorRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  colorDot: { width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer' },
  placeInputRow: { display: 'flex', gap: 10, marginBottom: 12 },
  addPlaceBtn: { padding: '10px 18px', borderRadius: 9, border: 'none', background: '#111827', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tag: { display: 'flex', alignItems: 'center', gap: 6, background: '#f0f2f5', borderRadius: 8, padding: '5px 10px', fontSize: 13, color: '#374151', fontWeight: 500 },
  tagRemove: { background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0 },
  error: { background: '#fef2f2', color: '#ef4444', fontSize: 13, padding: '12px 16px', borderRadius: 9 },
  formFooter: { display: 'flex', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { padding: '12px 24px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  submitBtn: { padding: '12px 28px', borderRadius: 10, border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' },
};
