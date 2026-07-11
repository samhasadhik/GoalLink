import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

export default function ClubSavedPlayers() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savedPlayers, setSavedPlayers] = useState([]);
  const [clubId, setClubId] = useState(null);
  const [clubName, setClubName] = useState('');

  useEffect(() => {
    loadSavedPlayers();
  }, []);

  const loadSavedPlayers = async () => {
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
      setClubName(user.displayName || user.email?.split('@')[0] || 'Club');

      // Get saved player IDs from club document
      const clubRef = doc(db, 'clubs', user.uid);
      const clubDoc = await getDoc(clubRef);
      const savedPlayerIds = clubDoc.data()?.savedPlayers || [];

      // Fetch full player details for each saved ID
      const players = [];
      for (const playerId of savedPlayerIds) {
        const playerRef = doc(db, 'players', playerId);
        const playerDoc = await getDoc(playerRef);
        if (playerDoc.exists()) {
          players.push({
            id: playerDoc.id,
            ...playerDoc.data()
          });
        }
      }
      setSavedPlayers(players);
    } catch (error) {
      console.error('Error loading saved players:', error);
      setSavedPlayers(getDemoSavedPlayers());
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (playerId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const clubRef = doc(db, 'clubs', userData.uid);
      const clubDoc = await getDoc(clubRef);
      const currentSaved = clubDoc.data()?.savedPlayers || [];
      
      await updateDoc(clubRef, {
        savedPlayers: currentSaved.filter(id => id !== playerId)
      });
      
      setSavedPlayers(savedPlayers.filter(player => player.id !== playerId));
      alert('Player removed from saved list');
    } catch (error) {
      console.error('Error removing player:', error);
      alert('Failed to remove player');
    }
  };

  const handleMessagePlayer = (playerId, playerName) => {
    navigate(`/messages?player=${playerId}&name=${encodeURIComponent(playerName)}`);
  };

  const handleViewProfile = (playerId) => {
    navigate(`/player/profile/${playerId}`);
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

  const getDemoSavedPlayers = () => [
    { id: 1, fullName: 'Nimal Perera', position: 'Midfielder', location: 'Colombo', experience: 'Semi-Pro', age: 23, rating: 4.5, avatar: 'N' },
    { id: 2, fullName: 'Kamal Silva', position: 'Forward', location: 'Kandy', experience: 'Amateur', age: 21, rating: 4.2, avatar: 'K' }
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
          <p>Loading saved players...</p>
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
          <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Saved Players</span>
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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Saved Players</h1>
          <p style={{ color: '#9CA3AF' }}>Players you have shortlisted for future reference</p>
        </div>

        {savedPlayers.length === 0 ? (
          <div style={{
            backgroundColor: '#1E1F2A',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>⭐</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>No saved players yet</h2>
            <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>
              When you save players from the search results, they will appear here.
            </p>
            <Link to="/club/dashboard">
              <button style={{
                backgroundColor: '#00E5FF',
                color: '#0A0F1F',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Find Players →
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {savedPlayers.map((player) => (
              <div key={player.id} style={{
                backgroundColor: '#1E1F2A',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00E5FF'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#00E5FF',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#0A0F1F'
                  }}>
                    {player.avatar || player.fullName?.charAt(0)}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{player.fullName}</h3>
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        backgroundColor: `${getExperienceColor(player.experience)}20`,
                        color: getExperienceColor(player.experience)
                      }}>
                        {player.experience}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
                      <span style={{ color: '#9CA3AF', fontSize: '13px' }}>⚽ {player.position}</span>
                      <span style={{ color: '#9CA3AF', fontSize: '13px' }}>📍 {player.location}</span>
                      <span style={{ color: '#9CA3AF', fontSize: '13px' }}>🎂 {player.age} years</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1,2,3,4,5].map((_, i) => (
                        <span key={i} style={{ color: i < Math.floor(player.rating || 0) ? '#fbbf24' : '#374151', fontSize: '12px' }}>★</span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleMessagePlayer(player.id, player.fullName)}
                      style={{
                        backgroundColor: '#00E5FF',
                        color: '#0A0F1F',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}
                    >
                      💬 Message
                    </button>
                    <button
                      onClick={() => handleViewProfile(player.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #00E5FF',
                        color: '#00E5FF',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleRemoveSaved(player.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}