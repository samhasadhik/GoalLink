import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function PlayerRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    position: '',
    age: '',
    location: '',
    experience: '',
    bio: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.password) {
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
      if (!formData.position || !formData.age || !formData.location || !formData.experience) {
        return setError('Please fill all player details');
      }
    }
    setError('');
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bio) {
      return setError('Please write a short bio');
    }
    setError('');
    navigate('/dashboard');
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
            <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '6px' }}>Player Registration</h1>
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
                  <label style={labelStyle}>Full Name</label>
                  <input name="fullName" type="text" style={inputStyle}
                    value={formData.fullName} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    placeholder="John Doe" required />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Email</label>
                  <input name="email" type="email" style={inputStyle}
                    value={formData.email} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    placeholder="your@email.com" required />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Password</label>
                  <input name="password" type="password" style={inputStyle}
                    value={formData.password} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    placeholder="Min 6 characters" required />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Confirm Password</label>
                  <input name="confirmPassword" type="password" style={inputStyle}
                    value={formData.confirmPassword} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    placeholder="••••••••" required />
                </div>
              </div>
            )}

            {/* ===== STEP 2: Player Details ===== */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#FFFFFF' }}>
                  Player Details
                </h2>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Position</label>
                  <select name="position" style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                    value={formData.position} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur} required>
                    <option value="" style={{ backgroundColor: '#0A0F1F' }}>Select position</option>
                    <option value="Goalkeeper" style={{ backgroundColor: '#0A0F1F' }}>Goalkeeper</option>
                    <option value="Defender" style={{ backgroundColor: '#0A0F1F' }}>Defender</option>
                    <option value="Midfielder" style={{ backgroundColor: '#0A0F1F' }}>Midfielder</option>
                    <option value="Forward" style={{ backgroundColor: '#0A0F1F' }}>Forward</option>
                    <option value="Striker" style={{ backgroundColor: '#0A0F1F' }}>Striker</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Age</label>
                  <input name="age" type="number" style={inputStyle}
                    value={formData.age} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    placeholder="25" required />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Location (District/City)</label>
                  <select name="location" style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                    value={formData.location} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur} required>
                    <option value="" style={{ backgroundColor: '#0A0F1F' }}>Select location</option>
                    <option value="Colombo" style={{ backgroundColor: '#0A0F1F' }}>Colombo</option>
                    <option value="Gampaha" style={{ backgroundColor: '#0A0F1F' }}>Gampaha</option>
                    <option value="Kandy" style={{ backgroundColor: '#0A0F1F' }}>Kandy</option>
                    <option value="Galle" style={{ backgroundColor: '#0A0F1F' }}>Galle</option>
                    <option value="Jaffna" style={{ backgroundColor: '#0A0F1F' }}>Jaffna</option>
                    <option value="Kurunegala" style={{ backgroundColor: '#0A0F1F' }}>Kurunegala</option>
                    <option value="Kalutara" style={{ backgroundColor: '#0A0F1F' }}>Kalutara</option>
                    <option value="Matara" style={{ backgroundColor: '#0A0F1F' }}>Matara</option>
                    <option value="Negombo" style={{ backgroundColor: '#0A0F1F' }}>Negombo</option>
                    <option value="Batticaloa" style={{ backgroundColor: '#0A0F1F' }}>Batticaloa</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Experience Level</label>
                  <select name="experience" style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                    value={formData.experience} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur} required>
                    <option value="" style={{ backgroundColor: '#0A0F1F' }}>Select experience</option>
                    <option value="Beginner" style={{ backgroundColor: '#0A0F1F' }}>Beginner (0-2 years)</option>
                    <option value="Intermediate" style={{ backgroundColor: '#0A0F1F' }}>Intermediate (3-5 years)</option>
                    <option value="Advanced" style={{ backgroundColor: '#0A0F1F' }}>Advanced (6-10 years)</option>
                    <option value="Professional" style={{ backgroundColor: '#0A0F1F' }}>Professional (10+ years)</option>
                  </select>
                </div>
              </div>
            )}

            {/* ===== STEP 3: Bio & Summary ===== */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#FFFFFF' }}>
                  Complete Your Profile
                </h2>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows={5}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                    onFocus={handleFocus} onBlur={handleBlur}
                    placeholder="Tell clubs about yourself, your playing style, achievements, and goals..."
                    required />
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
                    Profile Summary
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9CA3AF' }}>Name:</span>
                      <span style={{ color: '#FFFFFF', fontWeight: '500' }}>{formData.fullName || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9CA3AF' }}>Position:</span>
                      <span style={{ color: '#FFFFFF', fontWeight: '500' }}>{formData.position || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9CA3AF' }}>Age:</span>
                      <span style={{ color: '#FFFFFF', fontWeight: '500' }}>{formData.age || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9CA3AF' }}>Location:</span>
                      <span style={{ color: '#FFFFFF', fontWeight: '500' }}>{formData.location || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9CA3AF' }}>Experience:</span>
                      <span style={{ color: '#FFFFFF', fontWeight: '500' }}>{formData.experience || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== Buttons ===== */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              {step > 1 && (
                <button type="button" onClick={handleBack} style={{
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
                }}>
                  ← Back
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={handleNext} style={{
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
                onMouseLeave={(e) => e.target.style.boxShadow = 'none'}>
                  Next →
                </button>
              ) : (
                <button type="submit" style={{
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
                onMouseLeave={(e) => e.target.style.boxShadow = 'none'}>
                  Complete Registration
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}