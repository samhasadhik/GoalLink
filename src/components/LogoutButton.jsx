import { useNavigate } from 'react-router-dom';
import { auth, logOut } from '../services/firebase';

export default function LogoutButton({ variant = 'default' }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await logOut(auth);
      
      // Clear all localStorage data
      localStorage.clear();
      
      // Clear sessionStorage if any
      sessionStorage.clear();
      
      // Redirect to login page
      navigate('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if Firebase logout fails, clear local data and redirect
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    }
  };

  const styles = {
    default: {
      backgroundColor: 'transparent',
      border: '1px solid rgba(255,255,255,0.15)',
      color: '#FFFFFF',
      padding: '8px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit'
    },
    outlined: {
      backgroundColor: 'transparent',
      border: '1px solid #ef4444',
      color: '#ef4444',
      padding: '8px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit'
    },
    solid: {
      backgroundColor: '#ef4444',
      border: 'none',
      color: '#FFFFFF',
      padding: '10px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit'
    },
    icon: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ef4444',
      padding: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: 'inherit'
    }
  };

  const currentStyle = styles[variant] || styles.default;

  return (
    <button
      onClick={handleLogout}
      style={currentStyle}
      onMouseEnter={(e) => {
        if (variant === 'default') {
          e.target.style.borderColor = '#ef4444';
          e.target.style.color = '#ef4444';
        } else if (variant === 'solid') {
          e.target.style.backgroundColor = '#dc2626';
        } else if (variant === 'outlined') {
          e.target.style.backgroundColor = 'rgba(239,68,68,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'default') {
          e.target.style.borderColor = 'rgba(255,255,255,0.15)';
          e.target.style.color = '#FFFFFF';
        } else if (variant === 'solid') {
          e.target.style.backgroundColor = '#ef4444';
        } else if (variant === 'outlined') {
          e.target.style.backgroundColor = 'transparent';
        }
      }}
    >
      {variant === 'icon' ? '🚪 Logout' : 'Logout'}
    </button>
  );
}