import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, signUpWithEmail, db, firebaseAPI } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function PlayerRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    position: '',
    age: '',
    location: '',
    experience: '',
    bio: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Step 1: Create user in Firebase Auth
      const userCredential = await signUpWithEmail(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Step 2: Save to users collection
      await firebaseAPI.createUser(user.uid, {
        uid: user.uid,
        email: formData.email,
        displayName: formData.fullName,
        role: 'player',
        createdAt: new Date().toISOString()
      });
      
      // Step 3: Save to players collection
      await firebaseAPI.createPlayer(user.uid, {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        position: formData.position || 'Not specified',
        age: formData.age || 'Not specified',
        location: formData.location || 'Not specified',
        experience: formData.experience || 'Not specified',
        bio: formData.bio || '',
        goals: 0,
        assists: 0,
        matches: 0,
        rating: 0,
        createdAt: new Date().toISOString()
      });
      
      // Step 4: Store in localStorage
      localStorage.setItem('token', await user.getIdToken());
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: formData.email,
        displayName: formData.fullName,
        role: 'player'
      }));
      
      // Step 5: Redirect to dashboard
      navigate('/player/dashboard');
      
    } catch (err) {
      console.error('Registration error:', err);
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Email already registered. Please login instead.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        case 'auth/operation-not-allowed':
          setError('Email/Password sign-up is disabled. Please enable it in Firebase Console.');
          break;
        default:
          setError(`Registration failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#0A0F1F',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      backgroundColor: '#0A0F1F',
      minHeight: '100vh',
      color: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '40px' }}>
        
        <Link to="/select-role" style={{ color: '#9CA3AF', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
          ← Back
        </Link>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', color: '#00E5FF' }}>Player Registration</h1>
          <p style={{ color: '#9CA3AF' }}>Create your football profile</p>
        </div>
        
        {error && (
          <div style={{
            backgroundColor: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13px'
          }}>
            ❌ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <select name="position" value={formData.position} onChange={handleChange} style={inputStyle}>
              <option value="">Select Position</option>
              <option value="Goalkeeper">Goalkeeper</option>
              <option value="Defender">Defender</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Forward">Forward</option>
              <option value="Striker">Striker</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <select name="location" value={formData.location} onChange={handleChange} style={inputStyle}>
              <option value="">Select Location</option>
              <option value="Colombo">Colombo</option>
              <option value="Kandy">Kandy</option>
              <option value="Galle">Galle</option>
              <option value="Jaffna">Jaffna</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <select name="experience" value={formData.experience} onChange={handleChange} style={inputStyle}>
              <option value="">Select Experience</option>
              <option value="Beginner">Beginner (0-2 years)</option>
              <option value="Amateur">Amateur (2-5 years)</option>
              <option value="Semi-Pro">Semi-Pro (5-10 years)</option>
              <option value="Professional">Professional (10+ years)</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <textarea
              name="bio"
              placeholder="Short Bio (optional)"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#00E5FF',
              color: '#0A0F1F',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '10px'
            }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#9CA3AF' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#00E5FF' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}