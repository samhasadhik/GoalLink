import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#0A0F1F',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1E1F2A',
        borderRadius: '24px',
        padding: '48px',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>🔍</div>
        <h1 style={{ fontSize: '72px', fontWeight: 'bold', color: '#00E5FF', marginBottom: '16px' }}>404</h1>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>Page Not Found</h2>
        <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '32px' }}>
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/player/dashboard')}
          style={{
            backgroundColor: '#00E5FF',
            color: '#0A0F1F',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '30px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}