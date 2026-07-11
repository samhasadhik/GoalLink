import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../services/firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ClubProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clubId, setClubId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Club stats
  const [stats, setStats] = useState({
    totalPlayersRecruited: 0,
    opportunitiesPosted: 0,
    totalApplications: 0,
    savedPlayers: 0
  });

  // Club profile data
  const [clubProfile, setClubProfile] = useState({
    clubName: '',
    clubType: '',
    location: '',
    founded: '',
    description: '',
    phone: '',
    website: '',
    email: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    achievements: [],
    facilities: [],
    isVerified: false
  });

  // Recent opportunities
  const [recentOpportunities, setRecentOpportunities] = useState([]);

  useEffect(() => {
    loadClubProfile();
  }, []);

  const loadClubProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);
      if (user.role !== 'club') {
        navigate('/player/dashboard');
        return;
      }

      setClubId(user.uid);

      // Load club profile
      const clubRef = doc(db, 'clubs', user.uid);
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
          email: data.email || user.email || '',
          socialMedia: data.socialMedia || { facebook: '', instagram: '', twitter: '' },
          achievements: data.achievements || [],
          facilities: data.facilities || [],
          isVerified: data.isVerified || false
        });
        
        if (data.logo) {
          setImagePreview(data.logo);
        }
      }

      // Load club stats
      await loadClubStats(user.uid);
      
      // Load recent opportunities
      await loadRecentOpportunities(user.uid);
      
    } catch (error) {
      console.error('Error loading club profile:', error);
      setErrorMessage('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const loadClubStats = async (uid) => {
    try {
      // Get opportunities count
      const opportunitiesQuery = query(collection(db, 'opportunities'), where('clubId', '==', uid));
      const opportunitiesSnap = await getDocs(opportunitiesQuery);
      
      // Get total applications for club's opportunities
      let totalApplications = 0;
      for (const oppDoc of opportunitiesSnap.docs) {
        const appsQuery = query(collection(db, 'applications'), where('opportunityId', '==', oppDoc.id));
        const appsSnap = await getDocs(appsQuery);
        totalApplications += appsSnap.size;
      }
      
      // Get saved players count
      const clubRef = doc(db, 'clubs', uid);
      const clubDoc = await getDoc(clubRef);
      const savedPlayers = clubDoc.data()?.savedPlayers || [];
      
      setStats({
        totalPlayersRecruited: opportunitiesSnap.size * 5, // Demo calculation
        opportunitiesPosted: opportunitiesSnap.size,
        totalApplications: totalApplications,
        savedPlayers: savedPlayers.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        totalPlayersRecruited: 24,
        opportunitiesPosted: 8,
        totalApplications: 156,
        savedPlayers: 12
      });
    }
  };

  const loadRecentOpportunities = async (uid) => {
    try {
      const opportunitiesQuery = query(collection(db, 'opportunities'), where('clubId', '==', uid));
      const opportunitiesSnap = await getDocs(opportunitiesQuery);
      const opportunities = opportunitiesSnap.docs.slice(0, 3).map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentOpportunities(opportunities);
    } catch (error) {
      console.error('Error loading opportunities:', error);
      setRecentOpportunities([
        { id: 1, title: 'Open Trials', position: 'Midfielder', deadline: '2026-06-15', applicants: 12 },
        { id: 2, title: 'Youth Academy', position: 'Forward', deadline: '2026-06-20', applicants: 8 }
      ]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setClubProfile(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setClubProfile(prev => ({ ...prev, [name]: value }));
    }
    setErrorMessage('');
  };

  const handleArrayAdd = (field, value) => {
    if (value && value.trim()) {
      setClubProfile(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const handleArrayRemove = (field, index) => {
    setClubProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
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
      const imageRef = ref(storage, `club-logos/${clubId}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      setImagePreview(downloadURL);
      
      const clubRef = doc(db, 'clubs', clubId);
      await updateDoc(clubRef, { logo: downloadURL });
      
      setSuccessMessage('Logo uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const clubRef = doc(db, 'clubs', clubId);
      await updateDoc(clubRef, {
        clubName: clubProfile.clubName,
        clubType: clubProfile.clubType,
        location: clubProfile.location,
        founded: parseInt(clubProfile.founded) || new Date().getFullYear(),
        description: clubProfile.description,
        phone: clubProfile.phone,
        website: clubProfile.website,
        socialMedia: clubProfile.socialMedia,
        achievements: clubProfile.achievements,
        facilities: clubProfile.facilities,
        updatedAt: new Date().toISOString()
      });

      // Update user display name
      const userRef = doc(db, 'users', clubId);
      await updateDoc(userRef, {
        displayName: clubProfile.clubName,
        updatedAt: new Date().toISOString()
      });

      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      storedUser.displayName = clubProfile.clubName;
      localStorage.setItem('user', JSON.stringify(storedUser));

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏟️</div>
          <p>Loading club profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#0A0F1F',
      minHeight: '100vh',
      color: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#1E1F2A',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/club/dashboard')}
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
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#00E5FF',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#0A0F1F' }}>GL</span>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#00E5FF' }}>GoalLink</h1>
          <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Club Profile</span>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            padding: '6px 16px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Header with Edit/Save Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Club Profile</h1>
            <p style={{ color: '#9CA3AF' }}>Manage your club's information and visibility</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                backgroundColor: '#00E5FF',
                color: '#0A0F1F',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={saving}
                style={{
                  backgroundColor: '#00E5FF',
                  color: '#0A0F1F',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Success/Error Messages */}
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

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5FF' }}>{stats.totalPlayersRecruited}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Players Recruited</div>
          </div>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📢</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5FF' }}>{stats.opportunitiesPosted}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Opportunities</div>
          </div>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5FF' }}>{stats.totalApplications}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Applications</div>
          </div>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5FF' }}>{stats.savedPlayers}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Saved Players</div>
          </div>
        </div>

        {/* Logo Upload Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Club Logo</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{
              width: '120px',
              height: '120px',
              backgroundColor: '#00E5FF',
              borderRadius: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#0A0F1F',
              backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              {!imagePreview && clubProfile.clubName?.charAt(0)}
            </div>
            {isEditing && (
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
                  {uploadingImage ? 'Uploading...' : 'Upload Logo'}
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
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Basic Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Club Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="clubName"
                  value={clubProfile.clubName}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Club name"
                />
              ) : (
                <p style={{ color: '#FFFFFF', padding: '12px 0' }}>{clubProfile.clubName || 'Not specified'}</p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <p style={{ color: '#9CA3AF', padding: '12px 0' }}>{clubProfile.email}</p>
            </div>
            <div>
              <label style={labelStyle}>Club Type</label>
              {isEditing ? (
                <select name="clubType" value={clubProfile.clubType} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Type</option>
                  <option value="Professional">Professional Club</option>
                  <option value="Semi-Professional">Semi-Professional Club</option>
                  <option value="Amateur">Amateur Club</option>
                  <option value="Academy">Youth Academy</option>
                  <option value="Training">Training Center</option>
                </select>
              ) : (
                <p style={{ color: '#FFFFFF', padding: '12px 0' }}>{clubProfile.clubType || 'Not specified'}</p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={clubProfile.location}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="City, District"
                />
              ) : (
                <p style={{ color: '#FFFFFF', padding: '12px 0' }}>{clubProfile.location || 'Not specified'}</p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Founded Year</label>
              {isEditing ? (
                <input
                  type="number"
                  name="founded"
                  value={clubProfile.founded}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Year founded"
                />
              ) : (
                <p style={{ color: '#FFFFFF', padding: '12px 0' }}>{clubProfile.founded || 'Not specified'}</p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={clubProfile.phone}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Contact number"
                />
              ) : (
                <p style={{ color: '#FFFFFF', padding: '12px 0' }}>{clubProfile.phone || 'Not specified'}</p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Website</label>
              {isEditing ? (
                <input
                  type="url"
                  name="website"
                  value={clubProfile.website}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="https://yourclub.com"
                />
              ) : (
                <p style={{ color: '#FFFFFF', padding: '12px 0' }}>
                  {clubProfile.website ? (
                    <a href={clubProfile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#00E5FF' }}>
                      {clubProfile.website}
                    </a>
                  ) : 'Not specified'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Social Media</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Facebook</label>
              {isEditing ? (
                <input
                  type="text"
                  name="socialMedia.facebook"
                  value={clubProfile.socialMedia.facebook}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Facebook URL"
                />
              ) : (
                <p style={{ color: '#FFFFFF', padding: '12px 0' }}>
                  {clubProfile.socialMedia.facebook ? (
                    <a href={clubProfile.socialMedia.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#00E5FF' }}>
                      {clubProfile.socialMedia.facebook}
                    </a>
                  ) : 'Not specified'}
                </p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Instagram</label>
              {isEditing ? (
                <input
                  type="text"
                  name="socialMedia.instagram"
                  value={clubProfile.socialMedia.instagram}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Instagram URL"
                />
              ) : (
                <p style={{ color: '#FFFFFF', padding: '12px 0' }}>
                  {clubProfile.socialMedia.instagram || 'Not specified'}
                </p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Twitter/X</label>
              {isEditing ? (
                <input
                  type="text"
                  name="socialMedia.twitter"
                  value={clubProfile.socialMedia.twitter}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Twitter URL"
                />
              ) : (
                <p style={{ color: '#FFFFFF', padding: '12px 0' }}>
                  {clubProfile.socialMedia.twitter || 'Not specified'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Club Description */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>About the Club</h2>
          {isEditing ? (
            <textarea
              name="description"
              value={clubProfile.description}
              onChange={handleChange}
              rows="5"
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="Tell players about your club's history, facilities, achievements, and what you're looking for..."
            />
          ) : (
            <p style={{ color: '#D1D5DB', lineHeight: '1.6' }}>
              {clubProfile.description || 'No description added yet.'}
            </p>
          )}
        </div>

        {/* Achievements */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🏆 Achievements</h2>
          {isEditing ? (
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  id="newAchievement"
                  placeholder="Add an achievement..."
                  style={{ ...inputStyle, flex: 1 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleArrayAdd('achievements', e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('newAchievement');
                    handleArrayAdd('achievements', input.value);
                    input.value = '';
                  }}
                  style={{
                    backgroundColor: '#00E5FF',
                    color: '#0A0F1F',
                    border: 'none',
                    padding: '0 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {clubProfile.achievements.map((item, index) => (
                  <span key={index} style={{
                    backgroundColor: 'rgba(0,229,255,0.1)',
                    border: '1px solid rgba(0,229,255,0.2)',
                    color: '#00E5FF',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {item}
                    <button
                      onClick={() => handleArrayRemove('achievements', index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {clubProfile.achievements.length > 0 ? (
                clubProfile.achievements.map((item, index) => (
                  <span key={index} style={{
                    backgroundColor: 'rgba(0,229,255,0.1)',
                    border: '1px solid rgba(0,229,255,0.2)',
                    color: '#00E5FF',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '13px'
                  }}>
                    {item}
                  </span>
                ))
              ) : (
                <p style={{ color: '#9CA3AF' }}>No achievements added yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Facilities */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🛠️ Facilities</h2>
          {isEditing ? (
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  id="newFacility"
                  placeholder="Add a facility..."
                  style={{ ...inputStyle, flex: 1 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleArrayAdd('facilities', e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('newFacility');
                    handleArrayAdd('facilities', input.value);
                    input.value = '';
                  }}
                  style={{
                    backgroundColor: '#00E5FF',
                    color: '#0A0F1F',
                    border: 'none',
                    padding: '0 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {clubProfile.facilities.map((item, index) => (
                  <span key={index} style={{
                    backgroundColor: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    color: '#10b981',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {item}
                    <button
                      onClick={() => handleArrayRemove('facilities', index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {clubProfile.facilities.length > 0 ? (
                clubProfile.facilities.map((item, index) => (
                  <span key={index} style={{
                    backgroundColor: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    color: '#10b981',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '13px'
                  }}>
                    {item}
                  </span>
                ))
              ) : (
                <p style={{ color: '#9CA3AF' }}>No facilities added yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Recent Opportunities */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📢 Recent Opportunities</h2>
          {recentOpportunities.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentOpportunities.map((opp) => (
                <div key={opp.id} style={{
                  backgroundColor: '#0A0F1F',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{opp.title}</h3>
                      <p style={{ color: '#9CA3AF', fontSize: '13px' }}>{opp.position} • {opp.location}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#00E5FF', fontSize: '13px', fontWeight: 'bold' }}>{opp.applicants || 0} applicants</span>
                      <p style={{ color: '#6b7280', fontSize: '11px' }}>📅 Deadline: {opp.deadline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>
              No opportunities posted yet. 
              <Link to="/club/opportunities" style={{ color: '#00E5FF', marginLeft: '8px' }}>Post your first opportunity →</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}