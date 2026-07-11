import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { doc, getDoc, collection, getDocs, query, where, addDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';

export default function ClubOpportunities() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [clubId, setClubId] = useState(null);
  const [clubName, setClubName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, expired

  // Form state for add/edit
  const [formData, setFormData] = useState({
    title: '',
    position: '',
    location: '',
    description: '',
    requirements: '',
    deadline: '',
    type: 'trial', // trial, vacancy, match
    status: 'active'
  });

  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Striker', 'Winger', 'Any'];
  const opportunityTypes = [
    { value: 'trial', label: '⚽ Open Trials', color: '#00E5FF' },
    { value: 'vacancy', label: '📢 Player Vacancy', color: '#10b981' },
    { value: 'match', label: '🏆 Match Opportunity', color: '#f59e0b' }
  ];

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
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

      // Load opportunities from Firestore
      const opportunitiesQuery = query(
        collection(db, 'opportunities'),
        where('clubId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const opportunitiesSnap = await getDocs(opportunitiesQuery);
      
      const opportunitiesList = opportunitiesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setOpportunities(opportunitiesList.length > 0 ? opportunitiesList : getDemoOpportunities());
    } catch (error) {
      console.error('Error loading opportunities:', error);
      setOpportunities(getDemoOpportunities());
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      position: '',
      location: '',
      description: '',
      requirements: '',
      deadline: '',
      type: 'trial',
      status: 'active'
    });
    setEditingOpportunity(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (opportunity) => {
    setFormData({
      title: opportunity.title || '',
      position: opportunity.position || '',
      location: opportunity.location || '',
      description: opportunity.description || '',
      requirements: opportunity.requirements || '',
      deadline: opportunity.deadline || '',
      type: opportunity.type || 'trial',
      status: opportunity.status || 'active'
    });
    setEditingOpportunity(opportunity);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.position || !formData.location || !formData.deadline) {
      setErrorMessage('Please fill all required fields');
      return;
    }

    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (editingOpportunity) {
        // Update existing opportunity
        const oppRef = doc(db, 'opportunities', editingOpportunity.id);
        await updateDoc(oppRef, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
        setSuccessMessage('Opportunity updated successfully!');
      } else {
        // Create new opportunity
        await addDoc(collection(db, 'opportunities'), {
          ...formData,
          clubId: userData.uid,
          clubName: clubName,
          applicants: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setSuccessMessage('Opportunity posted successfully!');
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      await loadOpportunities();
      resetForm();
    } catch (error) {
      console.error('Error saving opportunity:', error);
      setErrorMessage('Failed to save opportunity');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (opportunityId) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await deleteDoc(doc(db, 'opportunities', opportunityId));
        setOpportunities(opportunities.filter(opp => opp.id !== opportunityId));
        setSuccessMessage('Opportunity deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting opportunity:', error);
        setErrorMessage('Failed to delete opportunity');
      }
    }
  };

  const handleToggleStatus = async (opportunity) => {
    const newStatus = opportunity.status === 'active' ? 'closed' : 'active';
    try {
      const oppRef = doc(db, 'opportunities', opportunity.id);
      await updateDoc(oppRef, { status: newStatus });
      setOpportunities(opportunities.map(opp => 
        opp.id === opportunity.id ? { ...opp, status: newStatus } : opp
      ));
      setSuccessMessage(`Opportunity ${newStatus === 'active' ? 'activated' : 'closed'}!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error toggling status:', error);
      setErrorMessage('Failed to update status');
    }
  };

  const getFilteredOpportunities = () => {
    if (filter === 'all') return opportunities;
    return opportunities.filter(opp => opp.status === filter);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'trial': return '⚽';
      case 'vacancy': return '📢';
      case 'match': return '🏆';
      default: return '📋';
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return { color: '#10b981', bg: 'rgba(16,185,129,0.1)', text: 'Active' };
    }
    return { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', text: 'Closed' };
  };

  const getDemoOpportunities = () => [
    { 
      id: 'demo1', 
      title: 'Open Trials', 
      position: 'Midfielder', 
      location: 'Colombo', 
      description: 'Looking for talented midfielders for first team trials.',
      requirements: 'Minimum 3 years experience',
      deadline: '2026-06-15', 
      type: 'trial', 
      status: 'active',
      applicants: 12,
      createdAt: new Date().toISOString()
    },
    { 
      id: 'demo2', 
      title: 'Youth Academy Intake', 
      position: 'Forward', 
      location: 'Kandy', 
      description: 'Seeking young forwards for our youth academy.',
      requirements: 'Age 16-19',
      deadline: '2026-06-20', 
      type: 'vacancy', 
      status: 'active',
      applicants: 8,
      createdAt: new Date().toISOString()
    }
  ];

  const filteredOpportunities = getFilteredOpportunities();

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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📢</div>
          <p>Loading opportunities...</p>
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
          <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Opportunities</span>
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
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Club Opportunities</h1>
            <p style={{ color: '#9CA3AF' }}>Post and manage trials, vacancies, and match opportunities</p>
          </div>
          <button
            onClick={handleAdd}
            style={{
              backgroundColor: '#00E5FF',
              color: '#0A0F1F',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            + Post New Opportunity
          </button>
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

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '12px'
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              background: 'none',
              border: 'none',
              color: filter === 'all' ? '#00E5FF' : '#9CA3AF',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: filter === 'all' ? 'bold' : 'normal',
              padding: '8px 16px'
            }}
          >
            All ({opportunities.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            style={{
              background: 'none',
              border: 'none',
              color: filter === 'active' ? '#00E5FF' : '#9CA3AF',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: filter === 'active' ? 'bold' : 'normal',
              padding: '8px 16px'
            }}
          >
            Active ({opportunities.filter(o => o.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('closed')}
            style={{
              background: 'none',
              border: 'none',
              color: filter === 'closed' ? '#00E5FF' : '#9CA3AF',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: filter === 'closed' ? 'bold' : 'normal',
              padding: '8px 16px'
            }}
          >
            Closed ({opportunities.filter(o => o.status === 'closed').length})
          </button>
        </div>

        {/* Opportunities List */}
        {filteredOpportunities.length === 0 ? (
          <div style={{
            backgroundColor: '#1E1F2A',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📢</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>No opportunities found</h2>
            <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>
              {filter === 'all' ? 'Post your first opportunity to start recruiting players.' : 'No opportunities in this category.'}
            </p>
            {filter === 'all' && (
              <button
                onClick={handleAdd}
                style={{
                  backgroundColor: '#00E5FF',
                  color: '#0A0F1F',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                + Post Opportunity
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredOpportunities.map((opp) => {
              const statusBadge = getStatusBadge(opp.status);
              return (
                <div
                  key={opp.id}
                  style={{
                    backgroundColor: '#1E1F2A',
                    borderRadius: '16px',
                    padding: '24px',
                    border: `1px solid ${opp.status === 'active' ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00E5FF'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = opp.status === 'active' ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.1)'}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '28px' }}>{getTypeIcon(opp.type)}</span>
                      <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{opp.title}</h2>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                          <span style={{ color: '#00E5FF', fontSize: '13px' }}>⚽ {opp.position}</span>
                          <span style={{ color: '#9CA3AF', fontSize: '13px' }}>📍 {opp.location}</span>
                          <span style={{ color: '#6b7280', fontSize: '13px' }}>📅 Deadline: {opp.deadline}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{
                        backgroundColor: statusBadge.bg,
                        color: statusBadge.color,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {statusBadge.text}
                      </span>
                      <span style={{
                        backgroundColor: 'rgba(0,229,255,0.1)',
                        color: '#00E5FF',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px'
                      }}>
                        {opp.applicants || 0} Applicants
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ color: '#D1D5DB', fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>
                    {opp.description}
                  </p>

                  {/* Requirements */}
                  {opp.requirements && (
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ color: '#9CA3AF', fontSize: '13px', fontWeight: 'bold' }}>Requirements:</span>
                      <p style={{ color: '#D1D5DB', fontSize: '13px', marginTop: '4px' }}>{opp.requirements}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                      onClick={() => handleToggleStatus(opp)}
                      style={{
                        backgroundColor: opp.status === 'active' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                        border: `1px solid ${opp.status === 'active' ? '#ef4444' : '#10b981'}`,
                        color: opp.status === 'active' ? '#ef4444' : '#10b981',
                        padding: '8px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}
                    >
                      {opp.status === 'active' ? 'Close Opportunity' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(opp)}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #00E5FF',
                        color: '#00E5FF',
                        padding: '8px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/opportunity/${opp.id}/applications`)}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFFFFF',
                        padding: '8px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      View Applications
                    </button>
                    <button
                      onClick={() => handleDelete(opp.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        padding: '8px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div style={{
            backgroundColor: '#1E1F2A',
            borderRadius: '20px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#00E5FF' }}>
                {editingOpportunity ? 'Edit Opportunity' : 'Post New Opportunity'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Opportunity Type */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Opportunity Type *</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {opportunityTypes.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: formData.type === type.value ? type.color : 'transparent',
                        border: `1px solid ${formData.type === type.value ? type.color : 'rgba(255,255,255,0.1)'}`,
                        color: formData.type === type.value ? '#0A0F1F' : '#FFFFFF',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: formData.type === type.value ? 'bold' : 'normal',
                        transition: 'all 0.2s'
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="e.g., Open Trials, Youth Academy Intake"
                />
              </div>

              {/* Position & Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Position *</label>
                  <select name="position" value={formData.position} onChange={handleInputChange} style={inputStyle}>
                    <option value="">Select Position</option>
                    {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    style={inputStyle}
                    placeholder="City, District"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Application Deadline *</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Describe the opportunity, what you're looking for, benefits, etc."
                />
              </div>

              {/* Requirements */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Requirements</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows="3"
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Experience level, age requirements, certifications, etc."
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#00E5FF',
                    color: '#0A0F1F',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    opacity: saving ? 0.7 : 1
                  }}
                >
                  {saving ? 'Saving...' : (editingOpportunity ? 'Update' : 'Post')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
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