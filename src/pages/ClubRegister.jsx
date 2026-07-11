import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signUpWithEmail, firebaseAPI } from '../services/firebase';

export default function ClubRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clubName: '',
    email: '',
    password: '',
    confirmPassword: '',
    clubType: '',
    location: '',
    founded: '',
    description: '',
    phone: '',
    website: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.clubName || !formData.email || !formData.password) {
        return setError('Please fill all required fields');
      }
      if (formData.password !== formData.confirmPassword) {
        return setError('Passwords do not match');
      }
      if (formData.password.length < 6) {
        return setError('Password must be at least 6 characters');
      }
    }
    if (step === 2) {
      if (!formData.clubType || !formData.location || !formData.founded) {
        return setError('Please fill all club details');
      }
    }
    setError('');
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description) {
      return setError('Please write a club description');
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
        displayName: formData.clubName,
        role: 'club',
        createdAt: new Date().toISOString()
      });
      
      // Step 3: Save to clubs collection
      await firebaseAPI.createClub(user.uid, {
        uid: user.uid,
        clubName: formData.clubName,
        email: formData.email,
        clubType: formData.clubType,
        location: formData.location,
        founded: parseInt(formData.founded),
        description: formData.description,
        phone: formData.phone || '',
        website: formData.website || '',
        logo: '',
        isVerified: false,
        createdAt: new Date().toISOString()
      });
      
      // Step 4: Store in localStorage
      localStorage.setItem('token', await user.getIdToken());
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: formData.email,
        displayName: formData.clubName,
        role: 'club'
      }));
      
      // Step 5: Redirect to club dashboard
      navigate('/club/dashboard');
      
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

  // Shared input style
  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
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

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: '6px'
  };

  return (
    <div style={{
      backgroundColor: '#0A0F1F',
      minHeight: '100vh',
      color: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', paddingTop: '40px' }}>

        {/* Back link */}
        <Link to="/select-role" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#9CA3AF',
          textDecoration: 'none',
          fontSize: '14px',
          marginBottom: '32px',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
        onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>
          ← Back
        </Link>

        {/* Card */}
        <div style={{
          backgroundColor: '#1E1F2A',
          borderRadius: '16px',
          padding: '40px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '6px' }}>Club Registration</h1>
            <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Step {step} of 3</p>

            {/* Progress Bar */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <div style={{
                height: '4px',
                flex: 1,
                borderRadius: '2px',
                backgroundColor: step >= 1 ? '#00E5FF' : 'rgba(255,255,255,0.1)',
                transition: 'background-color 0.3s'
              }}></div>
              <div style={{
                height: '4px',
                flex: 1,
                borderRadius: '2px',
                backgroundColor: step >= 2 ? '#00E5FF' : 'rgba(255,255,255,0.1)',
                transition: 'background-color 0.3s'
              }}></div>
              <div style={{
                height: '4px',
                flex: 1,
                borderRadius: '2px',
                backgroundColor: step >= 3 ? '#00E5FF' : 'rgba(255,255,255,0.1)',
                transition: 'background-color 0.3s'
              }}></div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ===== STEP 1: Basic Info ===== */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#FFFFFF' }}>
                  Basic Information
                </h2>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Club Name *</label>
                  <input 
                    name="clubName" 
                    type="text" 
                    style={inputStyle}
                    value={formData.clubName} 
                    onChange={handleChange}
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                    placeholder="Manchester United FC" 
                    required 
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Email *</label>
                  <input 
                    name="email" 
                    type="email" 
                    style={inputStyle}
                    value={formData.email} 
                    onChange={handleChange}
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                    placeholder="club@email.com" 
                    required 
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Password *</label>
                  <input 
                    name="password" 
                    type="password" 
                    style={inputStyle}
                    value={formData.password} 
                    onChange={handleChange}
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                    placeholder="Min 6 characters" 
                    required 
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Confirm Password *</label>
                  <input 
                    name="confirmPassword" 
                    type="password" 
                    style={inputStyle}
                    value={formData.confirmPassword} 
                    onChange={handleChange}
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                    placeholder="••••••••" 
                    required 
                  />
                </div>
              </div>
            )}

            {/* ===== STEP 2: Club Details ===== */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#FFFFFF' }}>
                  Club Details
                </h2>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Club Type *</label>
                  <select 
                    name="clubType" 
                    style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                    value={formData.clubType} 
                    onChange={handleChange}
                    onFocus={handleFocus} 
                    onBlur={handleBlur} 
                    required
                  >
                    <option value="" style={{ backgroundColor: '#0A0F1F' }}>Select type</option>
                    <option value="Professional" style={{ backgroundColor: '#0A0F1F' }}>Professional Club</option>
                    <option value="Semi-Professional" style={{ backgroundColor: '#0A0F1F' }}>Semi-Professional Club</option>
                    <option value="Amateur" style={{ backgroundColor: '#0A0F1F' }}>Amateur Club</option>
                    <option value="Academy" style={{ backgroundColor: '#0A0F1F' }}>Youth Academy</option>
                    <option value="Training" style={{ backgroundColor: '#0A0F1F' }}>Training Center</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Location *</label>
                  <select 
                    name="location" 
                    style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                    value={formData.location} 
                    onChange={handleChange}
                    onFocus={handleFocus} 
                    onBlur={handleBlur} 
                    required
                  >
                    <option value="" style={{ backgroundColor: '#0A0F1F' }}>Select location</option>
                    <option value="Colombo" style={{ backgroundColor: '#0A0F1F' }}>Colombo</option>
                    <option value="Gampaha" style={{ backgroundColor: '#0A0F1F' }}>Gampaha</option>
                    <option value="Kalutara" style={{ backgroundColor: '#0A0F1F' }}>Kalutara</option>
                    <option value="Kandy" style={{ backgroundColor: '#0A0F1F' }}>Kandy</option>
                    <option value="Matale" style={{ backgroundColor: '#0A0F1F' }}>Matale</option>
                    <option value="Galle" style={{ backgroundColor: '#0A0F1F' }}>Galle</option>
                    <option value="Matara" style={{ backgroundColor: '#0A0F1F' }}>Matara</option>
                    <option value="Jaffna" style={{ backgroundColor: '#0A0F1F' }}>Jaffna</option>
                    <option value="Kurunegala" style={{ backgroundColor: '#0A0F1F' }}>Kurunegala</option>
                    <option value="Anuradhapura" style={{ backgroundColor: '#0A0F1F' }}>Anuradhapura</option>
                    <option value="Badulla" style={{ backgroundColor: '#0A0F1F' }}>Badulla</option>
                    <option value="Ratnapura" style={{ backgroundColor: '#0A0F1F' }}>Ratnapura</option>
                    <option value="Negombo" style={{ backgroundColor: '#0A0F1F' }}>Negombo</option>
                    <option value="Batticaloa" style={{ backgroundColor: '#0A0F1F' }}>Batticaloa</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Founded Year *</label>
                  <input 
                    name="founded" 
                    type="number" 
                    style={inputStyle}
                    value={formData.founded} 
                    onChange={handleChange}
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                    placeholder="1878" 
                    required 
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Phone (Optional)</label>
                  <input 
                    name="phone" 
                    type="tel" 
                    style={inputStyle}
                    value={formData.phone} 
                    onChange={handleChange}
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                    placeholder="+94 XX XXX XXXX" 
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Website (Optional)</label>
                  <input 
                    name="website" 
                    type="url" 
                    style={inputStyle}
                    value={formData.website} 
                    onChange={handleChange}
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                    placeholder="https://www.yourclub.com" 
                  />
                </div>
              </div>
            )}

            {/* ===== STEP 3: Description & Summary ===== */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#FFFFFF' }}>
                  Complete Your Profile
                </h2>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Club Description *</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                    placeholder="Tell players about your club, facilities, achievements, and what you're looking for..."
                    required 
                  />
                </div>

                {/* Summary Card */}
                <div style={{
                  backgroundColor: 'rgba(0,229,255,0.05)',
                  border: '1px solid rgba(0,229,255,0.15)',
                  borderRadius: '10px',
                  padding: '20px'
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#00E5FF',
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Club Summary
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9CA3AF' }}>Club:</span>
                      <span style={{ color: '#FFFFFF', fontWeight: '500' }}>{formData.clubName || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9CA3AF' }}>Type:</span>
                      <span style={{ color: '#FFFFFF', fontWeight: '500' }}>{formData.clubType || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9CA3AF' }}>Location:</span>
                      <span style={{ color: '#FFFFFF', fontWeight: '500' }}>{formData.location || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9CA3AF' }}>Founded:</span>
                      <span style={{ color: '#FFFFFF', fontWeight: '500' }}>{formData.founded || '—'}</span>
                    </div>
                    {formData.phone && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9CA3AF' }}>Phone:</span>
                        <span style={{ color: '#FFFFFF', fontWeight: '500' }}>{formData.phone}</span>
                      </div>
                    )}
                    {formData.website && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9CA3AF' }}>Website:</span>
                        <span style={{ color: '#FFFFFF', fontWeight: '500' }}>{formData.website}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== Buttons ===== */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={handleBack} 
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: 'transparent',
                    color: '#9CA3AF',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#00E5FF';
                    e.target.style.color = '#00E5FF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.target.style.color = '#9CA3AF';
                  }}
                >
                  ← Back
                </button>
              )}
              {step < 3 ? (
                <button 
                  type="button" 
                  onClick={handleNext} 
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: '#00E5FF',
                    color: '#0A0F1F',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.boxShadow = '0 0 20px rgba(0,229,255,0.4)'}
                  onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                  Next →
                </button>
              ) : (
                <button 
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: '#00E5FF',
                    color: '#0A0F1F',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.target.style.boxShadow = '0 0 20px rgba(0,229,255,0.4)';
                  }}
                  onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              )}
            </div>

            {/* Login Link */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#00E5FF', textDecoration: 'none' }}>
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}