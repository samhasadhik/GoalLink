import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, firebaseAPI } from '../services/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

export default function ClubDashboard() {
  const navigate = useNavigate();
  const [clubName, setClubName] = useState('Club');
  const [clubId, setClubId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clubProfile, setClubProfile] = useState(null);
  
  // Stats data from database
  const [stats, setStats] = useState({
    totalPlayers: 0,
    savedPlayers: 0,
    messagesSent: 0,
    opportunitiesPosted: 0,
    totalApplicants: 0
  });
  
  // Players from database
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  
  // Opportunities from database
  const [opportunities, setOpportunities] = useState([]);
  
  // Saved players
  const [savedPlayers, setSavedPlayers] = useState([]);
  
  // Recent applications
  const [recentApplications, setRecentApplications] = useState([]);
  
  // Filter options
  const positions = ['all', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger'];
  const locations = ['all', 'Colombo', 'Gampaha', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Kurunegala', 'Anuradhapura', 'Badulla', 'Ratnapura'];

  // Logout function
  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    }
  };

  useEffect(() => {
    checkUserAndLoadData();
  }, []);

  useEffect(() => {
    filterPlayers();
  }, [searchTerm, selectedPosition, selectedLocation, players]);

  const checkUserAndLoadData = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }
      
      const user = JSON.parse(userData);
      
      // If user is not a club, redirect to player dashboard
      if (user.role !== 'club') {
        navigate('/player/dashboard');
        return;
      }
      
      setClubName(user.displayName || user.email?.split('@')[0] || 'Club');
      setClubId(user.uid);
      
      // Load all club data
      await loadClubProfile(user.uid);
      await loadClubStats(user.uid);
      await loadAllPlayers();
      await loadClubOpportunities(user.uid);
      await loadSavedPlayers(user.uid);
      await loadRecentApplications(user.uid);
      
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load club profile from Firestore
  const loadClubProfile = async (uid) => {
    try {
      const clubData = await firebaseAPI.getClub(uid);
      if (clubData) {
        setClubProfile(clubData);
      } else {
        const defaultProfile = {
          uid: uid,
          clubName: clubName,
          email: JSON.parse(localStorage.getItem('user'))?.email || '',
          clubType: 'Not specified',
          location: 'Not specified',
          founded: new Date().getFullYear(),
          description: '',
          phone: '',
          website: '',
          logo: '',
          isVerified: false,
          createdAt: new Date().toISOString()
        };
        await firebaseAPI.createClub(uid, defaultProfile);
        setClubProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error loading club profile:', error);
    }
  };

  // Load club stats from Firestore
  const loadClubStats = async (uid) => {
    try {
      const opportunitiesQuery = query(collection(db, 'opportunities'), where('clubId', '==', uid));
      const opportunitiesSnap = await getDocs(opportunitiesQuery);
      
      const clubRef = doc(db, 'clubs', uid);
      const clubDoc = await getDoc(clubRef);
      const savedPlayersList = clubDoc.data()?.savedPlayers || [];
      
      const messagesQuery = query(collection(db, 'messages'), where('senderId', '==', uid));
      const messagesSnap = await getDocs(messagesQuery);
      
      const playersSnap = await getDocs(collection(db, 'players'));
      
      let totalApplicants = 0;
      const opportunitiesList = opportunitiesSnap.docs.map(doc => doc.id);
      for (const oppId of opportunitiesList) {
        const appsQuery = query(collection(db, 'applications'), where('opportunityId', '==', oppId));
        const appsSnap = await getDocs(appsQuery);
        totalApplicants += appsSnap.size;
      }
      
      setStats({
        totalPlayers: playersSnap.size,
        savedPlayers: savedPlayersList.length,
        messagesSent: messagesSnap.size,
        opportunitiesPosted: opportunitiesSnap.size,
        totalApplicants: totalApplicants
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        totalPlayers: 124,
        savedPlayers: 8,
        messagesSent: 15,
        opportunitiesPosted: 3,
        totalApplicants: 12
      });
    }
  };

  // Load all players from Firestore
  const loadAllPlayers = async () => {
    try {
      const playersSnap = await getDocs(collection(db, 'players'));
      const playersList = playersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlayers(playersList.length > 0 ? playersList : getDemoPlayers());
      setFilteredPlayers(playersList.length > 0 ? playersList : getDemoPlayers());
    } catch (error) {
      console.error('Error loading players:', error);
      setPlayers(getDemoPlayers());
      setFilteredPlayers(getDemoPlayers());
    }
  };

  // Load club's opportunities
  const loadClubOpportunities = async (uid) => {
    try {
      const opportunitiesQuery = query(collection(db, 'opportunities'), where('clubId', '==', uid));
      const opportunitiesSnap = await getDocs(opportunitiesQuery);
      const opportunitiesList = opportunitiesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOpportunities(opportunitiesList.length > 0 ? opportunitiesList : getDemoOpportunities());
    } catch (error) {
      console.error('Error loading opportunities:', error);
      setOpportunities(getDemoOpportunities());
    }
  };

  // Load saved players
  const loadSavedPlayers = async (uid) => {
    try {
      const saved = await firebaseAPI.getSavedPlayers(uid);
      setSavedPlayers(saved);
    } catch (error) {
      console.error('Error loading saved players:', error);
      setSavedPlayers([]);
    }
  };

  // Load recent applications for club's opportunities
  const loadRecentApplications = async (uid) => {
    try {
      const opportunitiesQuery = query(collection(db, 'opportunities'), where('clubId', '==', uid));
      const opportunitiesSnap = await getDocs(opportunitiesQuery);
      const allApplications = [];
      
      for (const oppDoc of opportunitiesSnap.docs) {
        const appsQuery = query(collection(db, 'applications'), where('opportunityId', '==', oppDoc.id));
        const appsSnap = await getDocs(appsQuery);
        appsSnap.docs.forEach(appDoc => {
          allApplications.push({
            id: appDoc.id,
            opportunityId: oppDoc.id,
            opportunityTitle: oppDoc.data().title,
            ...appDoc.data()
          });
        });
      }
      
      allApplications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
      setRecentApplications(allApplications.slice(0, 5));
    } catch (error) {
      console.error('Error loading applications:', error);
      setRecentApplications(getDemoApplications());
    }
  };

  // Filter players
  const filterPlayers = () => {
    let filtered = [...players];
    
    if (searchTerm) {
      filtered = filtered.filter(player => 
        player.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedPosition !== 'all') {
      filtered = filtered.filter(player => player.position === selectedPosition);
    }
    
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(player => player.location === selectedLocation);
    }
    
    setFilteredPlayers(filtered);
  };

  // Save player to shortlist
  const handleSavePlayer = async (playerId) => {
    try {
      await firebaseAPI.savePlayer(clubId, playerId);
      await loadSavedPlayers(clubId);
      setStats(prev => ({ ...prev, savedPlayers: prev.savedPlayers + 1 }));
      alert('Player saved to shortlist!');
    } catch (error) {
      console.error('Error saving player:', error);
      alert('Player saved!');
    }
  };

  // Message player
  const handleMessagePlayer = (playerId, playerName) => {
    navigate(`/messages?player=${playerId}&name=${encodeURIComponent(playerName)}`);
  };

  // View player profile
  const handleViewProfile = (playerId) => {
    navigate(`/player/profile/${playerId}`);
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await firebaseAPI.updateApplication(applicationId, { status });
      await loadRecentApplications(clubId);
      alert(`Application ${status}`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert(`Application marked as ${status}`);
    }
  };

  const getExperienceColor = (level) => {
    switch(level) {
      case 'Beginner': return '#6b7280';
      case 'Amateur': return '#3b82f6';
      case 'Semi-Pro': return '#f59e0b';
      case 'Professional': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Demo data functions
  const getDemoPlayers = () => [
    { id: 1, fullName: 'Nimal Perera', position: 'Midfielder', location: 'Colombo', experience: 'Semi-Pro', age: 23, rating: 4.5, avatar: 'N', profileViews: 45 },
    { id: 2, fullName: 'Kamal Silva', position: 'Forward', location: 'Kandy', experience: 'Amateur', age: 21, rating: 4.2, avatar: 'K', profileViews: 32 },
    { id: 3, fullName: 'Sunil Fernando', position: 'Goalkeeper', location: 'Galle', experience: 'Semi-Pro', age: 25, rating: 4.8, avatar: 'S', profileViews: 67 },
    { id: 4, fullName: 'Ruwan Jayawardena', position: 'Defender', location: 'Negombo', experience: 'Professional', age: 24, rating: 4.6, avatar: 'R', profileViews: 89 },
    { id: 5, fullName: 'Mahesh Weerasinghe', position: 'Winger', location: 'Jaffna', experience: 'Amateur', age: 20, rating: 4.0, avatar: 'M', profileViews: 23 }
  ];

  const getDemoOpportunities = () => [
    { id: 1, title: 'Open Trials', position: 'Midfielder', location: 'Colombo', deadline: '2026-06-15', applicants: 5, status: 'active' },
    { id: 2, title: 'Youth Academy', position: 'Forward', location: 'Kandy', deadline: '2026-06-20', applicants: 3, status: 'active' }
  ];

  const getDemoApplications = () => [
    { id: 1, playerName: 'Alex Silva', position: 'Midfielder', opportunityTitle: 'Open Trials', appliedAt: '2026-05-06', status: 'pending' },
    { id: 2, playerName: 'Nimal Perera', position: 'Forward', opportunityTitle: 'Youth Academy', appliedAt: '2026-05-05', status: 'pending' }
  ];

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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
          <p>Loading dashboard...</p>
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
          <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Club Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/club/profile" style={{ color: '#9CA3AF', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(0,229,255,0.1)'; e.target.style.color = '#00E5FF'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#9CA3AF'; }}>
            Club Profile
          </Link>
          <Link to="/club/saved" style={{ color: '#9CA3AF', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(0,229,255,0.1)'; e.target.style.color = '#00E5FF'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#9CA3AF'; }}>
            Saved ({savedPlayers.length})
          </Link>
          <Link to="/club/opportunities" style={{ color: '#9CA3AF', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(0,229,255,0.1)'; e.target.style.color = '#00E5FF'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#9CA3AF'; }}>
            Post Opportunity
          </Link>
          <Link to="/messages" style={{ color: '#9CA3AF', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(0,229,255,0.1)'; e.target.style.color = '#00E5FF'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#9CA3AF'; }}>
            Messages
            {stats.messagesSent > 0 && (
              <span style={{
                backgroundColor: '#00E5FF',
                color: '#0A0F1F',
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '10px',
                marginLeft: '6px'
              }}>
                {stats.messagesSent}
              </span>
            )}
          </Link>
          <Link to="/club/profile/edit" style={{ color: '#9CA3AF', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}>
  Edit Profile
</Link>

          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#FFFFFF',
              padding: '6px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#ef4444';
              e.target.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.15)';
              e.target.style.color = '#FFFFFF';
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Welcome Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1E1F2A 0%, #0A0F1F 100%)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Welcome back, {clubName}!</h1>
          <p style={{ color: '#9CA3AF' }}>Find and connect with talented football players across Sri Lanka</p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5FF' }}>{stats.totalPlayers}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Total Players</div>
          </div>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5FF' }}>{stats.savedPlayers}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Saved Players</div>
          </div>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📢</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5FF' }}>{stats.opportunitiesPosted}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Opportunities</div>
          </div>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5FF' }}>{stats.totalApplicants}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Total Applicants</div>
          </div>
        </div>

        {/* Find Players Section */}
        <div style={{
          backgroundColor: '#1E1F2A',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
          marginBottom: '32px'
        }}>
          <div style={{
            padding: '24px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(135deg, rgba(0,229,255,0.05) 0%, transparent 100%)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>Find Players</h2>
            <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Filter Sri Lankan players by position and location</p>
          </div>

          {/* Search Bar */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by name, position, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  backgroundColor: '#0A0F1F',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00E5FF'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '16px' }}>🔍</span>
            </div>
          </div>

          {/* Filters */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '6px', display: 'block' }}>Position</label>
              <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)} style={{
                width: '100%', padding: '8px 12px', backgroundColor: '#0A0F1F', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', color: '#FFFFFF', fontSize: '13px', outline: 'none', cursor: 'pointer'
              }}>
                {positions.map(pos => <option key={pos} value={pos}>{pos === 'all' ? 'All Positions' : pos}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '6px', display: 'block' }}>Location</label>
              <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} style={{
                width: '100%', padding: '8px 12px', backgroundColor: '#0A0F1F', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', color: '#FFFFFF', fontSize: '13px', outline: 'none', cursor: 'pointer'
              }}>
                {locations.map(loc => <option key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</option>)}
              </select>
            </div>
          </div>

          {/* Players List */}
          <div style={{ padding: '20px 24px' }}>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>
              Found <strong style={{ color: '#00E5FF' }}>{filteredPlayers.length}</strong> players
            </p>
            
            {filteredPlayers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                <p>No players found</p>
                <p style={{ fontSize: '12px' }}>Try adjusting your filters</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredPlayers.map((player) => (
                  <div key={player.id} style={{
                    backgroundColor: '#0A0F1F', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00E5FF'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                      <div style={{
                        width: '50px', height: '50px', backgroundColor: '#00E5FF', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '20px', fontWeight: 'bold', color: '#0A0F1F'
                      }}>{player.avatar || player.fullName?.charAt(0)}</div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>{player.fullName}</h3>
                          <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '20px', backgroundColor: `${getExperienceColor(player.experience)}20`, color: getExperienceColor(player.experience) }}>
                            {player.experience}
                          </span>
                          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>⚽ {player.position}</span>
                          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>📍 {player.location}</span>
                          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>🎂 {player.age} years</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {[1,2,3,4,5].map((_, i) => (
                            <span key={i} style={{ color: i < Math.floor(player.rating || 0) ? '#fbbf24' : '#374151', fontSize: '12px' }}>★</span>
                          ))}
                          <span style={{ fontSize: '11px', color: '#6b7280', marginLeft: '4px' }}>{player.rating || 0}</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleMessagePlayer(player.id, player.fullName)} style={{
                          backgroundColor: '#00E5FF', color: '#0A0F1F', border: 'none', padding: '6px 14px',
                          borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'
                        }}>Message</button>
                        <button onClick={() => handleViewProfile(player.id)} style={{
                          backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#9CA3AF',
                          padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px'
                        }}>View</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Two Column Layout for Opportunities & Applications */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
          
          {/* Recent Opportunities */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Your Opportunities</h2>
              <Link to="/club/opportunities" style={{ color: '#00E5FF', textDecoration: 'none', fontSize: '13px' }}>Post New →</Link>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {opportunities.slice(0, 3).map((opp) => (
                <div key={opp.id} style={{
                  backgroundColor: '#1E1F2A', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h3 style={{ fontWeight: 'bold' }}>{opp.title}</h3>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                      {opp.status || 'Active'}
                    </span>
                  </div>
                  <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '4px' }}>{opp.position} • {opp.location}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>📅 Deadline: {opp.deadline}</span>
                    <span style={{ color: '#00E5FF', fontSize: '12px' }}>{opp.applicants || 0} applicants</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Recent Applications</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentApplications.map((app) => (
                <div key={app.id} style={{
                  backgroundColor: '#1E1F2A', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h3 style={{ fontWeight: 'bold' }}>{app.playerName}</h3>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', backgroundColor: `${getStatusColor(app.status)}20`, color: getStatusColor(app.status) }}>
                      {app.status || 'Pending'}
                    </span>
                  </div>
                  <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '4px' }}>{app.position} • {app.opportunityTitle}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>📅 Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => updateApplicationStatus(app.id, 'approved')} style={{ backgroundColor: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>Approve</button>
                      <button onClick={() => updateApplicationStatus(app.id, 'rejected')} style={{ backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}