import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function PlayerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userName, setUserName] = useState('Player');
  const [userRole, setUserRole] = useState('player');
  const [loading, setLoading] = useState(true);
  
  // Player data - make sure everything is properly initialized
  const [player, setPlayer] = useState({
    name: 'Player',
    position: 'Midfielder',
    goals: 0,
    assists: 0,
    matches: 0,
    rating: 0,
    about: 'No bio added yet.',
    experience: [],  // Start as empty array
    skills: [        // Start with default skills
      { name: 'Ball Control', percentage: 0 },
      { name: 'Passing', percentage: 0 },
      { name: 'Vision', percentage: 0 },
      { name: 'Stamina', percentage: 0 }
    ],
    avatar: 'P',
    location: 'Not specified',
    age: 'Not specified',
    height: 'Not specified',
    weight: 'Not specified',
    preferredFoot: 'Right'
  });

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      console.log('User data:', userData);
      
      if (!userData) {
        navigate('/login');
        return;
      }
      
      const user = JSON.parse(userData);
      setUserName(user.displayName || user.email?.split('@')[0] || 'Player');
      setUserRole(user.role || 'player');
      
      // Set player data from localStorage or create default
      setPlayer({
        name: user.displayName || user.email?.split('@')[0] || 'Player',
        position: 'Midfielder',
        goals: 42,
        assists: 28,
        matches: 156,
        rating: 4.5,
        about: 'Passionate midfielder with over 6 years of competitive experience. Known for excellent ball control, vision, and tactical awareness.',
        experience: [  // Make sure this is an array
          { club: 'Manchester City Youth', position: 'Midfielder', period: '2023 - Present', description: 'Key player in the youth development squad' },
          { club: 'Liverpool Academy', position: 'Midfielder', period: '2020 - 2023', description: 'Progressed through youth ranks' }
        ],
        skills: [
          { name: 'Ball Control', percentage: 90 },
          { name: 'Passing', percentage: 85 },
          { name: 'Vision', percentage: 88 },
          { name: 'Stamina', percentage: 92 }
        ],
        avatar: (user.displayName || 'P').charAt(0).toUpperCase(),
        location: 'London, UK',
        age: 23,
        height: "5'9\"",
        weight: '72 kg',
        preferredFoot: 'Right'
      });
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleSendMessage = () => {
    navigate('/messages');
  };

  const handleSavePlayer = () => {
    alert('Player saved to your shortlist!');
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

  // Safely check if experience is an array before using map
  const experienceList = Array.isArray(player.experience) ? player.experience : [];
  const skillsList = Array.isArray(player.skills) ? player.skills : [];

  return (
    <div style={{
      backgroundColor: '#0A0F1F',
      minHeight: '100vh',
      color: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: '#1E1F2A',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => {
                if (userRole === 'club') {
                  navigate('/club/dashboard');
                } else {
                  navigate('/player/dashboard');
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
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#00E5FF',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#0A0F1F' }}>GL</span>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#00E5FF' }}>GoalLink</h1>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {id && (
              <>
                <button
                  onClick={handleSavePlayer}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #00E5FF',
                    color: '#00E5FF',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ⭐ Save Player
                </button>
                <button
                  onClick={handleSendMessage}
                  style={{
                    backgroundColor: '#00E5FF',
                    color: '#0A0F1F',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  💬 Message
                </button>
              </>
            )}
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
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Profile Header */}
        <div style={{
          backgroundColor: '#1E1F2A',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center' }}>
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
              color: '#0A0F1F'
            }}>
              {player.avatar}
            </div>
            
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                {player.name}
              </h1>
              <p style={{ color: '#00E5FF', fontSize: '18px', marginBottom: '8px' }}>
                {player.position}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#9CA3AF', fontSize: '14px' }}>
                <span>📍 {player.location}</span>
                <span>🎂 {player.age} years</span>
                <span>📏 {player.height}</span>
                <span>⚽ {player.preferredFoot} Foot</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#00E5FF' }}>{player.goals}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Goals</div>
          </div>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#00E5FF' }}>{player.assists}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Assists</div>
          </div>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#00E5FF' }}>{player.matches}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Matches</div>
          </div>
          <div style={{ backgroundColor: '#1E1F2A', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#00E5FF' }}>{player.rating}</div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Rating</div>
          </div>
        </div>

        {/* About Section */}
        <div style={{
          backgroundColor: '#1E1F2A',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#00E5FF' }}>About</h2>
          <p style={{ color: '#D1D5DB', fontSize: '14px', lineHeight: '1.6' }}>{player.about}</p>
        </div>

        {/* Experience Section - Fixed with safety check */}
        <div style={{
          backgroundColor: '#1E1F2A',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#00E5FF' }}>Experience</h2>
          {experienceList.length === 0 ? (
            <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>No experience added yet.</p>
          ) : (
            experienceList.map((exp, index) => (
              <div key={index} style={{
                marginBottom: index < experienceList.length - 1 ? '24px' : 0,
                paddingBottom: index < experienceList.length - 1 ? '24px' : 0,
                borderBottom: index < experienceList.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{exp.club || 'Club'}</h3>
                  <span style={{ color: '#00E5FF', fontSize: '13px' }}>{exp.period || 'Year - Year'}</span>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '4px' }}>{exp.position || 'Position'}</p>
                <p style={{ color: '#D1D5DB', fontSize: '13px' }}>{exp.description || 'Description'}</p>
              </div>
            ))
          )}
        </div>

        {/* Skills & Attributes - Fixed with safety check */}
        <div style={{
          backgroundColor: '#1E1F2A',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#00E5FF' }}>Skills & Attributes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {skillsList.length === 0 ? (
              <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>No skills added yet.</p>
            ) : (
              skillsList.map((skill, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#D1D5DB' }}>{skill.name || 'Skill'}</span>
                    <span style={{ fontSize: '14px', color: '#00E5FF', fontWeight: 'bold' }}>{skill.percentage || 0}%</span>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${skill.percentage || 0}%`, backgroundColor: '#00E5FF', height: '100%', borderRadius: '10px' }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Edit Profile Button */}
        {!id && (
          <div style={{
            backgroundColor: 'rgba(0,229,255,0.05)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid rgba(0,229,255,0.2)'
          }}>
            <p style={{ color: '#9CA3AF', marginBottom: '12px' }}>✏️ Want to update your profile?</p>
            <button
              onClick={() => alert('Edit profile feature coming soon!')}
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
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}