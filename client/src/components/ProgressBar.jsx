export default function ProgressBar({ value }) {
  const color =
    value >= 100 ? '#10b981' :
    value >= 60  ? '#6366f1' :
    value >= 30  ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ background: '#e5e7eb', borderRadius: 99, height: 8, overflow: 'hidden' }}>
      <div
        style={{
          width: `${value}%`,
          height: '100%',
          background: color,
          borderRadius: 99,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
}
