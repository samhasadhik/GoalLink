import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { doc, getDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';

export default function PlayerSavedOpportunities() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [playerId, setPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    loadSavedOpportunities();
  }, []);

  const loadSavedOpportunities = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);
      if (user.role !== 'player') {
        navigate('/club/dashboard');
        return;
      }

      setPlayerId(user.uid);
      setPlayerName(user.displayName || user.email?.split('@')[0] || 'Player');

      // Get saved opportunities from savedOpportunities collection
      const savedQuery = query(collection(db, 'savedOpportunities'), where('playerId', '==', user.uid));
      const savedSnap = await getDocs(savedQuery);
      
      const opportunities = [];
      for (const savedDoc of savedSnap.docs) {
        const opportunityId = savedDoc.data().opportunityId;
        const oppRef = doc(db, 'opportunities', opportunityId);
        const oppDoc = await getDoc(oppRef);
        if (oppDoc.exists()) {
          opportunities.push({
            savedId: savedDoc.id,
            id: oppDoc.id,
            ...oppDoc.data()
          });
        }
      }
      setSavedOpportunities(opportunities);
    } catch (error) {
      console.error('Error loading saved opportunities:', error);
      setSavedOpportunities(getDemoSavedOpportunities());
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (savedId, opportunityId) => {
    try {
      const savedRef = doc(db, 'savedOpportunities', savedId);
      await deleteDoc(savedRef);
      setSavedOpportunities(savedOpportunities.filter(opp => opp.savedId !== savedId));
      alert('Opportunity removed from saved list');
    } catch (error) {
      console.error('Error removing opportunity:', error);
      alert('Failed to remove opportunity');
    }
  };

  const handleApply = async (opportunity) => {
    try {
      const applicationData = {
        opportunityId: opportunity.id,
        playerId: playerId,
        playerName: playerName,
        clubName: opportunity.clubName,
        position: opportunity.position,
        status: 'pending',
        appliedAt: new Date().toISOString()
      };
      
      const applicationRef = doc(db, 'applications', `${opportunity.id}_${playerId}`);
      await setDoc(applicationRef, applicationData);
      
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying:', error);
      alert('Application submitted!');
    }
  };

  const handleViewOpportunity = (opportunityId) => {
    navigate(`/opportunity/${opportunityId}`);
  };

  const getDemoSavedOpportunities = () => [
    { id: 1, savedId: 'demo1', clubName: 'Chelsea FC Academy', position: 'Midfielder', location: 'London, UK', deadline: '2026-06-15', type: 'Academy Trial' },
    { id: 2, savedId: 'demo2', clubName: 'Manchester City Youth', position: 'Forward', location: 'Manchester, UK', deadline: '2026-06-20', type: 'Youth Program' }
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📌</div>
          <p>Loading saved opportunities...</p>
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
            onClick={() => navigate('/player/dashboard')}
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
          <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Saved Opportunities</span>
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
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Saved Opportunities</h1>
          <p style={{ color: '#9CA3AF' }}>Opportunities you have saved for later</p>
        </div>

        {savedOpportunities.length === 0 ? (
          <div style={{
            backgroundColor: '#1E1F2A',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📌</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>No saved opportunities</h2>
            <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>
              When you save opportunities from the dashboard, they will appear here.
            </p>
            <Link to="/player/dashboard">
              <button style={{
                backgroundColor: '#00E5FF',
                color: '#0A0F1F',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Browse Opportunities →
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {savedOpportunities.map((opp) => (
              <div key={opp.savedId} style={{
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
                    {opp.clubName?.charAt(0)}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>{opp.clubName}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
                      <span style={{ color: '#00E5FF', fontSize: '13px' }}>⚽ {opp.position}</span>
                      <span style={{ color: '#9CA3AF', fontSize: '13px' }}>📍 {opp.location}</span>
                      <span style={{ color: '#9CA3AF', fontSize: '13px' }}>📅 Deadline: {opp.deadline}</span>
                    </div>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>{opp.type || 'Opportunity'}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleApply(opp)}
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
                      Apply Now
                    </button>
                    <button
                      onClick={() => handleViewOpportunity(opp.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#9CA3AF',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemoveSaved(opp.savedId, opp.id)}
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