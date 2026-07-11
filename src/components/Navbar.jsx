import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px'
      }}>
        <Link to="/dashboard" style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#2563eb',
          textDecoration: 'none'
        }}>
          ⚽ GoalLink
        </Link>
        
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/search" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>
              Search
            </Link>
            <Link to="/messages" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>
              Messages
            </Link>
            <Link to="/dashboard" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn-danger">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}