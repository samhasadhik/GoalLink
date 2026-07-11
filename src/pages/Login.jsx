import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signInWithEmail, signInWithGoogle, googleProvider, firebaseAPI } from '../services/firebase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('player');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmail(auth, email, password);
      const user = userCredential.user;
      
      localStorage.setItem('token', await user.getIdToken());
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        role: selectedRole
      }));
      
      if (selectedRole === 'club') {
        navigate('/club/dashboard');
      } else {
        navigate('/player/dashboard');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found. Please sign up first.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await signInWithGoogle(auth, googleProvider);
      const user = result.user;
      
      localStorage.setItem('token', await user.getIdToken());
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: selectedRole
      }));
      
      if (selectedRole === 'club') {
        navigate('/club/dashboard');
      } else {
        navigate('/player/dashboard');
      }
      
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px 12px 44px',
    backgroundColor: '#0A0F1F',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  };

  const handleFocus = (e) => e.target.style.borderColor = '#00E5FF';
  const handleBlur = (e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)';

  return (
    <div style={{
      backgroundColor: '#0A0F1F',
      minHeight: '100vh',
      color: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '440px', margin: '0 auto', paddingTop: '40px' }}>
        <Link to="/" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', marginBottom: '32px', display: 'inline-block' }}>
          ← Back to home
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#00E5FF', marginBottom: '4px', letterSpacing: '2px' }}>GL</h1>
          <p style={{ color: '#9CA3AF', fontSize: '12px' }}>GoalLink</p>
        </div>

        <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '6px' }}>Welcome Back</h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>Sign in to continue to GoalLink</p>

          {/* Role Selector */}
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'rgba(0,229,255,0.05)', borderRadius: '12px', border: '1px solid rgba(0,229,255,0.2)' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#00E5FF', marginBottom: '12px' }}>🎯 Login as:</label>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="radio" value="player" checked={selectedRole === 'player'} onChange={(e) => setSelectedRole(e.target.value)} style={{ accentColor: '#00E5FF' }} />
                <span>⚽ Player</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="radio" value="club" checked={selectedRole === 'club'} onChange={(e) => setSelectedRole(e.target.value)} style={{ accentColor: '#00E5FF' }} />
                <span>🏆 Club / Coach</span>
              </label>
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '6px', display: 'block' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>☑</span>
                <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} placeholder="your@email.com" required />
              </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '6px', display: 'block' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>🔒</span>
                <input type={showPassword ? 'text' : 'password'} style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '28px' }}>
              <button type="button" style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '13px', cursor: 'pointer' }}>Forgot password?</button>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: '#00E5FF', color: '#0A0F1F', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '24px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
            <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Or continue with</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
          </div>

          <button onClick={handleGoogleSignIn} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>G</span> Sign in with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#9CA3AF' }}>
            Don't have an account?{' '}
            <Link to="/select-role" style={{ color: '#00E5FF', textDecoration: 'none' }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}