export default function EmptyState({ title, description }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
      <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ color: '#6b7280' }}>{description}</p>
    </div>
  );
}