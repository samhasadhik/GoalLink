import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{
      backgroundColor: '#0A0F1F',
      minHeight: '100vh',
      color: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* ========== NAVIGATION ========== */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#00E5FF' }}>GL<br/><span style={{ fontSize: '12px', color: '#9CA3AF' }}>GoalLink</span></h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link to="/login" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Login</Link>
          <Link to="/select-role" style={{ backgroundColor: '#00E5FF', color: '#0A0F1F', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Get Started</Link>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <div style={{ textAlign: 'center', padding: '80px 20px 60px', maxWidth: '750px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '52px', fontWeight: 'bold', lineHeight: '1.15', marginBottom: '20px', letterSpacing: '-1px' }}>
          Connect. Play. Succeed.
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: '1.7', marginBottom: '40px' }}>
          GoalLink brings players, clubs, and coaches together. Find your next opportunity or discover talented players for your team.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/select-role" style={{
            backgroundColor: '#00E5FF', color: '#0A0F1F', padding: '14px 32px', borderRadius: '8px',
            textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.boxShadow = '0 0 25px rgba(0,229,255,0.5)'}
          onMouseLeave={(e) => e.target.style.boxShadow = 'none'}>
            Get Started Free
          </Link>
          <Link to="/login" style={{
            backgroundColor: 'transparent', color: '#FFFFFF', padding: '14px 32px', borderRadius: '8px',
            textDecoration: 'none', fontSize: '16px', fontWeight: '500', border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => { e.target.style.borderColor = '#00E5FF'; e.target.style.color = '#00E5FF'; }}
          onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.color = '#FFFFFF'; }}>
            Sign In
          </Link>
        </div>
      </div>

      {/* ========== FEATURES SECTION ========== */}
      <div style={{
        maxWidth: '1100px', margin: '0 auto', padding: '0 20px 80px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px'
      }}>
        {/* For Players */}
        <div style={{ backgroundColor: '#1E1F2A', borderRadius: '12px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚽</div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>For Players</h3>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6' }}>Showcase your skills and find the perfect club</p>
        </div>

        {/* Direct Messaging */}
        <div style={{ backgroundColor: '#1E1F2A', borderRadius: '12px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>💬</div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Direct Messaging</h3>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6' }}>Connect instantly with clubs and players</p>
        </div>

        {/* For Clubs */}
        <div style={{ backgroundColor: '#1E1F2A', borderRadius: '12px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>🏢</div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>For Clubs</h3>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6' }}>Discover and recruit talented players</p>
        </div>

        {/* Opportunities */}
        <div style={{ backgroundColor: '#1E1F2A', borderRadius: '12px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>🎯</div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Opportunities</h3>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6' }}>Post trials and find the right match</p>
        </div>
      </div>

      {/* ========== HOW IT WORKS ========== */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '80px 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>How It Works</h2>
        <p style={{ textAlign: 'center', color: '#9CA3AF', marginBottom: '60px', fontSize: '16px' }}>
          Three simple steps to kickstart your football journey
        </p>
        
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
          {/* Step 1 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              backgroundColor: 'rgba(0,229,255,0.15)', color: '#00E5FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: 'bold', margin: '0 auto 20px'
            }}>1</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Create Your Profile</h3>
            <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6' }}>
              Sign up as a player or club and complete your profile with details and achievements
            </p>
          </div>

          {/* Step 2 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              backgroundColor: 'rgba(0,229,255,0.15)', color: '#00E5FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: 'bold', margin: '0 auto 20px'
            }}>2</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Search & Connect</h3>
            <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6' }}>
              Browse opportunities or discover players. Use filters to find the perfect match
            </p>
          </div>

          {/* Step 3 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              backgroundColor: 'rgba(0,229,255,0.15)', color: '#00E5FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: 'bold', margin: '0 auto 20px'
            }}>3</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Start Playing</h3>
            <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6' }}>
              Message directly, arrange trials, and take your football career to the next level
            </p>
          </div>
        </div>
      </div>

      {/* ========== CTA SECTION ========== */}
      <div style={{
        textAlign: 'center', padding: '80px 20px',
        background: 'linear-gradient(180deg, rgba(0,229,255,0.05) 0%, transparent 100%)',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', lineHeight: '1.3' }}>
          Ready to Take Your Game to the<br/>Next Level?
        </h2>
        <p style={{ color: '#9CA3AF', marginBottom: '32px', fontSize: '16px' }}>
          Join thousands of players and clubs already using GoalLink
        </p>
        <Link to="/select-role" style={{
          backgroundColor: '#00E5FF', color: '#0A0F1F', padding: '16px 40px', borderRadius: '8px',
          textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', display: 'inline-block',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => e.target.style.boxShadow = '0 0 30px rgba(0,229,255,0.5)'}
        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}>
          Join GoalLink Today
        </Link>
      </div>

      {/* ========== FOOTER ========== */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '60px 40px 30px',
        backgroundColor: '#080B17'
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Brand */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#00E5FF', marginBottom: '10px' }}>GL</h3>
            <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: '1.6' }}>
              GoalLink<br/>Connecting football talent with opportunities worldwide
            </p>
          </div>

          {/* For Players */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', color: '#FFFFFF' }}>For Players</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ color: '#9CA3AF', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Find Clubs</span>
              <span style={{ color: '#9CA3AF', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Browse Opportunities</span>
              <span style={{ color: '#9CA3AF', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Create Profile</span>
            </div>
          </div>

          {/* For Clubs */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', color: '#FFFFFF' }}>For Clubs</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ color: '#9CA3AF', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Find Players</span>
              <span style={{ color: '#9CA3AF', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Post Opportunities</span>
              <span style={{ color: '#9CA3AF', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Recruitment Tools</span>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', color: '#FFFFFF' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ color: '#9CA3AF', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>About Us</span>
              <span style={{ color: '#9CA3AF', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Contact</span>
              <span style={{ color: '#9CA3AF', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Privacy Policy</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '24px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
            © 2026 GoalLink. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}