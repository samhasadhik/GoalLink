import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, firebaseAPI } from '../services/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

export default function PlayerDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Player');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playerProfile, setPlayerProfile] = useState(null);
  
  // Stats data from database
  const [stats, setStats] = useState({
    profileViews: 0,
    applications: 0,
    messages: 0,
    notifications: 0
  });
  
  // Opportunities from database
  const [opportunities, setOpportunities] = useState([]);
  
  // Messages from database
  const [messages, setMessages] = useState([]);
  
  // Saved opportunities
  const [savedOpportunities, setSavedOpportunities] = useState([]);

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

  const checkUserAndLoadData = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }
      
      const user = JSON.parse(userData);
      
      // If user is not a player, redirect to club dashboard
      if (user.role !== 'player') {
        navigate('/club/dashboard');
        return;
      }
      
      setUserName(user.displayName || user.email?.split('@')[0] || 'Player');
      setUserId(user.uid);
      
      // Load all player data
      await loadPlayerProfile(user.uid);
      await loadPlayerStats(user.uid);
      await loadOpportunities();
      await loadPlayerMessages(user.uid);
      await loadSavedOpportunities(user.uid);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load player profile from Firestore
  const loadPlayerProfile = async (uid) => {
    try {
      const playerData = await firebaseAPI.getPlayer(uid);
      if (playerData) {
        setPlayerProfile(playerData);
      } else {
        const defaultProfile = {
          uid: uid,
          fullName: userName,
          email: JSON.parse(localStorage.getItem('user'))?.email || '',
          position: 'Not specified',
          age: 'Not specified',
          location: 'Not specified',
          experience: 'Not specified',
          bio: '',
          goals: 0,
          assists: 0,
          matches: 0,
          rating: 0,
          profileViews: 0,
          createdAt: new Date().toISOString()
        };
        await firebaseAPI.createPlayer(uid, defaultProfile);
        setPlayerProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error loading player profile:', error);
    }
  };

  // Load player stats from Firestore
  const loadPlayerStats = async (uid) => {
    try {
      const playerRef = doc(db, 'players', uid);
      const playerDoc = await getDoc(playerRef);
      const playerData = playerDoc.data();
      
      const applicationsQuery = query(collection(db, 'applications'), where('playerId', '==', uid));
      const applicationsSnap = await getDocs(applicationsQuery);
      
      const messagesQuery = query(collection(db, 'messages'), where('receiverId', '==', uid));
      const messagesSnap = await getDocs(messagesQuery);
      
      const notificationsQuery = query(collection(db, 'notifications'), where('userId', '==', uid), where('isRead', '==', false));
      const notificationsSnap = await getDocs(notificationsQuery);
      
      setStats({
        profileViews: playerData?.profileViews || 0,
        applications: applicationsSnap.size,
        messages: messagesSnap.size,
        notifications: notificationsSnap.size
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        profileViews: 156,
        applications: 12,
        messages: 8,
        notifications: 5
      });
    }
  };

  // Load opportunities from Firestore
  const loadOpportunities = async () => {
    try {
      const opportunitiesSnap = await getDocs(collection(db, 'opportunities'));
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

  // Load player messages
  const loadPlayerMessages = async (uid) => {
    try {
      const messagesQuery = query(collection(db, 'messages'), where('receiverId', '==', uid));
      const messagesSnap = await getDocs(messagesQuery);
      const messagesList = messagesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesList.length > 0 ? messagesList : getDemoMessages());
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages(getDemoMessages());
    }
  };

  // Load saved opportunities
  const loadSavedOpportunities = async (uid) => {
    try {
      const savedQuery = query(collection(db, 'savedOpportunities'), where('playerId', '==', uid));
      const savedSnap = await getDocs(savedQuery);
      setSavedOpportunities(savedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error loading saved opportunities:', error);
      setSavedOpportunities([]);
    }
  };

  // Apply for opportunity
  const handleApply = async (opportunityId, opportunity) => {
    try {
      const applicationData = {
        opportunityId: opportunityId,
        playerId: userId,
        playerName: userName,
        clubName: opportunity.clubName,
        position: opportunity.position,
        status: 'pending',
        appliedAt: new Date().toISOString(),
        message: ''
      };
      
      await firebaseAPI.createApplication(applicationData);
      setStats(prev => ({ ...prev, applications: prev.applications + 1 }));
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying:', error);
      alert('Application submitted! (Demo mode)');
    }
  };

  // Save opportunity for later
  const handleSaveOpportunity = async (opportunityId) => {
    try {
      await firebaseAPI.saveOpportunity(userId, opportunityId);
      await loadSavedOpportunities(userId);
      alert('Opportunity saved!');
    } catch (error) {
      console.error('Error saving opportunity:', error);
      alert('Opportunity saved! (Demo mode)');
    }
  };

  // Demo data functions
  const getDemoOpportunities = () => [
    { id: 1, clubName: 'Chelsea FC Academy', position: 'Midfielder', location: 'London, UK', timeAgo: '2 days ago', logo: 'C', type: 'Academy Trial' },
    { id: 2, clubName: 'Manchester City Youth', position: 'Forward', location: 'Manchester, UK', timeAgo: '1 week ago', logo: 'M', type: 'Youth Program' },
    { id: 3, clubName: 'Liverpool Academy', position: 'Winger', location: 'Liverpool, UK', timeAgo: '3 days ago', logo: 'L', type: 'Development Squad' }
  ];

  const getDemoMessages = () => [
    { id: 1, clubName: 'Liverpool FC', message: 'We are interested in your profile...', timeAgo: '2h ago', unread: true, avatar: 'L' },
    { id: 2, clubName: 'Tottenham Hotspur', message: 'Thank you for your application...', timeAgo: '1d ago', unread: false, avatar: 'T' },
    { id: 3, clubName: 'Brighton & Hove', message: 'When are you available for a trial?', timeAgo: '2d ago', unread: false, avatar: 'B' }
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚽</div>
          <p>Loading your dashboard...</p>
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
          <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Player Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/player/profile" style={{ color: '#9CA3AF', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(0,229,255,0.1)'; e.target.style.color = '#00E5FF'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#9CA3AF'; }}>
            My Profile
          </Link>
          <Link to="/player/profile/edit" style={{ color: '#9CA3AF', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(0,229,255,0.1)'; e.target.style.color = '#00E5FF'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#9CA3AF'; }}>
            Edit Profile
          </Link>
          <Link to="/messages" style={{ color: '#9CA3AF', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(0,229,255,0.1)'; e.target.style.color = '#00E5FF'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#9CA3AF'; }}>
            Messages
            {stats.messages > 0 && (
              <span style={{
                backgroundColor: '#00E5FF',
                color: '#0A0F1F',
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '10px',
                marginLeft: '6px'
              }}>
                {stats.messages}
              </span>
            )}
          </Link>
          <Link to="/player/saved" style={{ color: '#9CA3AF', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(0,229,255,0.1)'; e.target.style.color = '#00E5FF'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#9CA3AF'; }}>
            Saved ({savedOpportunities.length})
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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Welcome Section with Profile Completion */}
        <div style={{
          background: 'linear-gradient(135deg, #1E1F2A 0%, #0A0F1F 100%)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Welcome back, {userName}!</h1>
          <p style={{ color: '#9CA3AF', marginBottom: '16px' }}>Here's what's happening with your profile</p>
          
          {/* Profile Completion Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Profile Completion</span>
              <span style={{ color: '#00E5FF', fontSize: '13px', fontWeight: 'bold' }}>
                {playerProfile?.fullName && playerProfile?.position !== 'Not specified' ? '65%' : '35%'}
              </span>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                width: playerProfile?.fullName && playerProfile?.position !== 'Not specified' ? '65%' : '35%',
                backgroundColor: '#00E5FF',
                height: '100%',
                borderRadius: '10px'
              }}></div>
            </div>
            <Link to="/player/profile/edit" style={{ color: '#00E5FF', fontSize: '12px', marginTop: '8px', display: 'inline-block', textDecoration: 'none' }}>
              Complete your profile →
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
            onClick={() => navigate('/player/profile')}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👁️</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5FF' }}>{stats.profileViews}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Profile Views</div>
          </div>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5FF' }}>{stats.applications}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Applications</div>
          </div>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
            onClick={() => navigate('/messages')}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5FF' }}>{stats.messages}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Messages</div>
          </div>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔔</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5FF' }}>{stats.notifications}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Notifications</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px'
        }}>
          
          {/* Left Column - Recommended Opportunities */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Recommended Opportunities</h2>
              <Link to="/opportunities" style={{ color: '#00E5FF', textDecoration: 'none', fontSize: '13px' }}>View All →</Link>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  style={{
                    backgroundColor: '#1E1F2A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#00E5FF';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      backgroundColor: '#00E5FF',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#0A0F1F'
                    }}>
                      {opp.logo || opp.clubName?.charAt(0)}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {opp.clubName}
                      </h3>
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ color: '#00E5FF', fontSize: '13px' }}>⚽ {opp.position}</span>
                        <span style={{ color: '#9CA3AF', fontSize: '13px' }}>📍 {opp.location}</span>
                      </div>
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>🕐 {opp.timeAgo || 'Recently posted'}</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleSaveOpportunity(opp.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#9CA3AF',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleApply(opp.id, opp)}
                        style={{
                          backgroundColor: '#00E5FF',
                          color: '#0A0F1F',
                          border: 'none',
                          padding: '8px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 'bold'
                        }}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Messages & Quick Actions */}
          <div>
            {/* Recent Messages */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Recent Messages</h2>
                <Link to="/messages" style={{ color: '#00E5FF', textDecoration: 'none', fontSize: '13px' }}>View All →</Link>
                <Link to="/player/profile/edit" style={{ color: '#9CA3AF', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}>
  Edit Profile
</Link>
<Link to="/player/saved" style={{ color: '#9CA3AF', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}>
  Saved ({savedOpportunities.length})
</Link>

              </div>
              
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.slice(0, 3).map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => navigate('/messages')}
                    style={{
                      backgroundColor: msg.unread ? 'rgba(0,229,255,0.05)' : '#1E1F2A',
                      border: msg.unread ? '1px solid rgba(0,229,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#00E5FF',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#0A0F1F'
                      }}>
                        {msg.avatar || msg.clubName?.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>
                          {msg.clubName}
                          {msg.unread && (
                            <span style={{
                              display: 'inline-block',
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#00E5FF',
                              borderRadius: '50%',
                              marginLeft: '8px'
                            }}></span>
                          )}
                        </h4>
                        <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
                          {msg.message}
                        </p>
                      </div>
                      <span style={{ color: '#6b7280', fontSize: '11px' }}>{msg.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                backgroundColor: '#1E1F2A',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>My Stats</h3>
                <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '16px' }}>
                  View your performance metrics
                </p>
                <button
                  onClick={() => navigate('/player/stats')}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #00E5FF',
                    color: '#00E5FF',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  View Stats →
                </button>
              </div>
              
              <div style={{
                backgroundColor: '#1E1F2A',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📹</div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Add Highlight</h3>
                <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '16px' }}>
                  Upload your best moments
                </p>
                <button
                  onClick={() => navigate('/player/highlights')}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #00E5FF',
                    color: '#00E5FF',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Upload Video →
                </button>
              </div>
            </div>

            {/* Profile Tips */}
            <div style={{
              backgroundColor: 'rgba(0,229,255,0.05)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(0,229,255,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px' }}>💡</span>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Pro Tip</h3>
              </div>
              <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '12px' }}>
                Complete your profile with a photo and highlight video to get 3x more views from clubs!
              </p>
              <Link to="/player/profile/edit" style={{ color: '#00E5FF', fontSize: '13px', textDecoration: 'none' }}>
                Update Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}