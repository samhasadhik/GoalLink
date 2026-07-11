import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userRole, setUserRole] = useState('player');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Player profile state
  const [playerProfile, setPlayerProfile] = useState({
    fullName: '',
    position: '',
    age: '',
    location: '',
    experience: '',
    preferredFoot: 'Right',
    height: '',
    weight: '',
    bio: '',
    goals: 0,
    assists: 0,
    matches: 0,
    rating: 0,
    email: ''
  });

  // Club profile state
  const [clubProfile, setClubProfile] = useState({
    clubName: '',
    clubType: '',
    location: '',
    founded: '',
    description: '',
    phone: '',
    website: '',
    email: ''
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);
      setUserRole(user.role || 'player');

      if (user.role === 'player') {
        await loadPlayerProfile(user.uid);
      } else {
        await loadClubProfile(user.uid);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setErrorMessage('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const loadPlayerProfile = async (uid) => {
    try {
      const playerRef = doc(db, 'players', uid);
      const playerDoc = await getDoc(playerRef);
      
      if (playerDoc.exists()) {
        const data = playerDoc.data();
        setPlayerProfile({
          fullName: data.fullName || '',
          position: data.position || '',
          age: data.age || '',
          location: data.location || '',
          experience: data.experience || '',
          preferredFoot: data.preferredFoot || 'Right',
          height: data.height || '',
          weight: data.weight || '',
          bio: data.bio || '',
          goals: data.goals || 0,
          assists: data.assists || 0,
          matches: data.matches || 0,
          rating: data.rating || 0,
          email: data.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading player profile:', error);
    }
  };

  const loadClubProfile = async (uid) => {
    try {
      const clubRef = doc(db, 'clubs', uid);
      const clubDoc = await getDoc(clubRef);
      
      if (clubDoc.exists()) {
        const data = clubDoc.data();
        setClubProfile({
          clubName: data.clubName || '',
          clubType: data.clubType || '',
          location: data.location || '',
          founded: data.founded || '',
          description: data.description || '',
          phone: data.phone || '',
          website: data.website || '',
          email: data.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading club profile:', error);
    }
  };

  const handlePlayerChange = (e) => {
    const { name, value } = e.target;
    setPlayerProfile(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleClubChange = (e) => {
    const { name, value } = e.target;
    setClubProfile(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setErrorMessage('');

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const imageRef = ref(storage, `profile-images/${userData.uid}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      setImagePreview(downloadURL);
      
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, { photoURL: downloadURL });
      
      setSuccessMessage('Profile image uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const savePlayerProfile = async () => {
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const playerRef = doc(db, 'players', userData.uid);
      
      await updateDoc(playerRef, {
        fullName: playerProfile.fullName,
        position: playerProfile.position,
        age: playerProfile.age,
        location: playerProfile.location,
        experience: playerProfile.experience,
        preferredFoot: playerProfile.preferredFoot,
        height: playerProfile.height,
        weight: playerProfile.weight,
        bio: playerProfile.bio,
        goals: parseInt(playerProfile.goals) || 0,
        assists: parseInt(playerProfile.assists) || 0,
        matches: parseInt(playerProfile.matches) || 0,
        rating: parseFloat(playerProfile.rating) || 0,
        updatedAt: new Date().toISOString()
      });

      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, {
        displayName: playerProfile.fullName,
        updatedAt: new Date().toISOString()
      });

      const storedUser = JSON.parse(localStorage.getItem('user'));
      storedUser.displayName = playerProfile.fullName;
      localStorage.setItem('user', JSON.stringify(storedUser));

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const saveClubProfile = async () => {
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const clubRef = doc(db, 'clubs', userData.uid);
      
      await updateDoc(clubRef, {
        clubName: clubProfile.clubName,
        clubType: clubProfile.clubType,
        location: clubProfile.location,
        founded: parseInt(clubProfile.founded) || new Date().getFullYear(),
        description: clubProfile.description,
        phone: clubProfile.phone,
        website: clubProfile.website,
        updatedAt: new Date().toISOString()
      });

      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, {
        displayName: clubProfile.clubName,
        updatedAt: new Date().toISOString()
      });

      const storedUser = JSON.parse(localStorage.getItem('user'));
      storedUser.displayName = clubProfile.clubName;
      localStorage.setItem('user', JSON.stringify(storedUser));

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#0A0F1F',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: '6px'
  };

  const sectionStyle = {
    backgroundColor: '#1E1F2A',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#0A0F1F',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00E5FF'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚽</div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#0A0F1F',
      minHeight: '100vh',
      color: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button
            onClick={() => {
              if (userRole === 'player') {
                navigate('/player/dashboard');
              } else {
                navigate('/club/dashboard');
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5FF' }}>Edit Profile</h1>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div style={{
            backgroundColor: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            color: '#10b981',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            ✅ {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div style={{
            backgroundColor: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            ❌ {errorMessage}
          </div>
        )}

        {/* Profile Image Upload */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Profile Picture</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{
              width: '100px',
              height: '100px',
              backgroundColor: '#00E5FF',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#0A0F1F',
              backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              {!imagePreview && (userRole === 'player' ? playerProfile.fullName?.charAt(0) : clubProfile.clubName?.charAt(0))}
            </div>
            <div>
              <label style={{
                backgroundColor: '#00E5FF',
                color: '#0A0F1F',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingImage}
                />
              </label>
              <p style={{ color: '#6b7280', fontSize: '11px', marginTop: '8px' }}>
                JPG, PNG or GIF. Max 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Player Profile Form */}
        {userRole === 'player' && (
          <>
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Basic Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={playerProfile.fullName}
                    onChange={handlePlayerChange}
                    style={inputStyle}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    value={playerProfile.email}
                    style={{ ...inputStyle, opacity: 0.7 }}
                    disabled
                  />
                </div>
                <div>
                  <label style={labelStyle}>Position *</label>
                  <select name="position" value={playerProfile.position} onChange={handlePlayerChange} style={inputStyle}>
                    <option value="">Select Position</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Defender">Defender</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Forward">Forward</option>
                    <option value="Striker">Striker</option>
                    <option value="Winger">Winger</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={playerProfile.age}
                    onChange={handlePlayerChange}
                    style={inputStyle}
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={playerProfile.location}
                    onChange={handlePlayerChange}
                    style={inputStyle}
                    placeholder="City, District"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Experience Level</label>
                  <select name="experience" value={playerProfile.experience} onChange={handlePlayerChange} style={inputStyle}>
                    <option value="">Select Experience</option>
                    <option value="Beginner">Beginner (0-2 years)</option>
                    <option value="Amateur">Amateur (2-5 years)</option>
                    <option value="Semi-Pro">Semi-Pro (5-10 years)</option>
                    <option value="Professional">Professional (10+ years)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Preferred Foot</label>
                  <select name="preferredFoot" value={playerProfile.preferredFoot} onChange={handlePlayerChange} style={inputStyle}>
                    <option value="Right">Right Foot</option>
                    <option value="Left">Left Foot</option>
                    <option value="Both">Both Feet</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Height</label>
                  <input
                    type="text"
                    name="height"
                    value={playerProfile.height}
                    onChange={handlePlayerChange}
                    style={inputStyle}
                    placeholder={'e.g., 5\'9" or 175cm'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Weight</label>
                  <input
                    type="text"
                    name="weight"
                    value={playerProfile.weight}
                    onChange={handlePlayerChange}
                    style={inputStyle}
                    placeholder="e.g., 70kg"
                  />
                </div>
              </div>
            </div>

            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Career Statistics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Goals</label>
                  <input
                    type="number"
                    name="goals"
                    value={playerProfile.goals}
                    onChange={handlePlayerChange}
                    style={inputStyle}
                    placeholder="Total goals"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Assists</label>
                  <input
                    type="number"
                    name="assists"
                    value={playerProfile.assists}
                    onChange={handlePlayerChange}
                    style={inputStyle}
                    placeholder="Total assists"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Matches Played</label>
                  <input
                    type="number"
                    name="matches"
                    value={playerProfile.matches}
                    onChange={handlePlayerChange}
                    style={inputStyle}
                    placeholder="Total matches"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Rating (1-5)</label>
                  <input
                    type="number"
                    name="rating"
                    step="0.1"
                    min="0"
                    max="5"
                    value={playerProfile.rating}
                    onChange={handlePlayerChange}
                    style={inputStyle}
                    placeholder="Player rating"
                  />
                </div>
              </div>
            </div>

            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Bio</h2>
              <div>
                <label style={labelStyle}>About Me</label>
                <textarea
                  name="bio"
                  value={playerProfile.bio}
                  onChange={handlePlayerChange}
                  rows="5"
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Tell clubs about your playing style, strengths, achievements, and football journey..."
                />
              </div>
            </div>
          </>
        )}

        {/* Club Profile Form */}
        {userRole !== 'player' && (
          <>
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Basic Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Club Name *</label>
                  <input
                    type="text"
                    name="clubName"
                    value={clubProfile.clubName}
                    onChange={handleClubChange}
                    style={inputStyle}
                    placeholder="Club name"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    value={clubProfile.email}
                    style={{ ...inputStyle, opacity: 0.7 }}
                    disabled
                  />
                </div>
                <div>
                  <label style={labelStyle}>Club Type</label>
                  <select name="clubType" value={clubProfile.clubType} onChange={handleClubChange} style={inputStyle}>
                    <option value="">Select Type</option>
                    <option value="Professional">Professional Club</option>
                    <option value="Semi-Professional">Semi-Professional Club</option>
                    <option value="Amateur">Amateur Club</option>
                    <option value="Academy">Youth Academy</option>
                    <option value="Training">Training Center</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={clubProfile.location}
                    onChange={handleClubChange}
                    style={inputStyle}
                    placeholder="City, District"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Founded Year</label>
                  <input
                    type="number"
                    name="founded"
                    value={clubProfile.founded}
                    onChange={handleClubChange}
                    style={inputStyle}
                    placeholder="Year founded"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={clubProfile.phone}
                    onChange={handleClubChange}
                    style={inputStyle}
                    placeholder="Contact number"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Website</label>
                  <input
                    type="url"
                    name="website"
                    value={clubProfile.website}
                    onChange={handleClubChange}
                    style={inputStyle}
                    placeholder="https://yourclub.com"
                  />
                </div>
              </div>
            </div>

            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Club Description</h2>
              <div>
                <label style={labelStyle}>About the Club</label>
                <textarea
                  name="description"
                  value={clubProfile.description}
                  onChange={handleClubChange}
                  rows="5"
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Tell players about your club's history, facilities, achievements, and what you're looking for..."
                />
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <button
            onClick={() => {
              if (userRole === 'player') {
                navigate('/player/dashboard');
              } else {
                navigate('/club/dashboard');
              }
            }}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#FFFFFF',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#9CA3AF'}
            onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
          >
            Cancel
          </button>
          <button
            onClick={userRole === 'player' ? savePlayerProfile : saveClubProfile}
            disabled={saving}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: '#00E5FF',
              color: '#0A0F1F',
              border: 'none',
              borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              opacity: saving ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!saving) e.target.style.boxShadow = '0 0 20px rgba(0,229,255,0.4)';
            }}
            onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}