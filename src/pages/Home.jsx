import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      backgroundColor: '#0A0F1F',
      minHeight: '100vh',
      color: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden'
    }}>
      
      {/* ========== ANIMATED BACKGROUND GRID ========== */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* ========== GLOW ORBS ========== */}
      <div style={{
        position: 'fixed',
        top: '10%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* ========== NAVIGATION ========== */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: scrollY > 50 ? '16px 40px' : '24px 40px',
        borderBottom: scrollY > 50 ? '1px solid rgba(0,229,255,0.15)' : '1px solid transparent',
        backgroundColor: scrollY > 50 ? 'rgba(10,15,31,0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.3s ease'
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            backgroundColor: '#00E5FF',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 0 20px rgba(0,229,255,0.4)'
          }}>
            ⚽
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#FFFFFF', margin: 0, letterSpacing: '1px' }}>
              Goal<span style={{ color: '#00E5FF' }}>Link</span>
            </h1>
            <p style={{ fontSize: '10px', color: '#9CA3AF', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Football Network
            </p>
          </div>
        </Link>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }}
          onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
          onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>
            Features
          </a>
          <a href="#how-it-works" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }}
          onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
          onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>
            How It Works
          </a>
          <Link to="/login" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            Sign In
          </Link>
          <Link to="/select-role" style={{
            backgroundColor: '#00E5FF',
            color: '#0A0F1F',
            padding: '10px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            boxShadow: '0 0 20px rgba(0,229,255,0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 0 30px rgba(0,229,255,0.6)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 0 20px rgba(0,229,255,0.3)';
            e.target.style.transform = 'translateY(0)';
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ========== HERO SECTION WITH BIG GOALLINK LOGO ========== */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        padding: '80px 20px 60px',
        maxWidth: '1000px',
        margin: '0 auto',
        zIndex: 1
      }}>
        
        {/* ========== BIG GOALLINK LOGO - SPORTIVE STYLE ========== */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
          position: 'relative'
        }}>
          
          {/* Glowing ring behind logo */}
          <div style={{
            position: 'absolute',
            width: '340px',
            height: '340px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,229,255,0.25) 0%, transparent 65%)',
            filter: 'blur(40px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: -1
          }} />
          
          {/* Football icon above logo */}
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            filter: 'drop-shadow(0 0 20px rgba(0,229,255,0.6))',
            animation: 'float 3s ease-in-out infinite'
          }}>
            ⚽
          </div>

          {/* Main GOALLINK Wordmark */}
          <h1 style={{
            fontSize: '110px',
            fontWeight: '900',
            margin: 0,
            lineHeight: '0.9',
            letterSpacing: '-4px',
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #00E5FF 50%, #0099CC 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 40px rgba(0,229,255,0.3))',
            position: 'relative',
            display: 'inline-block'
          }}>
            GOAL<span style={{ 
              WebkitTextStroke: '2px #00E5FF',
              WebkitTextFillColor: 'transparent',
              fontStyle: 'italic'
            }}>LINK</span>
          </h1>

          {/* Sportive divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '24px',
            marginBottom: '24px'
          }}>
            <div style={{
              height: '2px',
              width: '80px',
              background: 'linear-gradient(90deg, transparent, #00E5FF)'
            }} />
            <span style={{
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '8px',
              color: '#00E5FF',
              textTransform: 'uppercase'
            }}>
              EST. 2026
            </span>
            <div style={{
              height: '2px',
              width: '80px',
              background: 'linear-gradient(90deg, #00E5FF, transparent)'
            }} />
          </div>

          {/* Tagline below logo */}
          <p style={{
            fontSize: '18px',
            color: '#9CA3AF',
            fontWeight: '500',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            margin: 0
          }}>
            Sri Lanka's Premier Football Platform
          </p>
        </div>

        {/* Headline */}
        <h2 style={{
          fontSize: '52px',
          fontWeight: '900',
          lineHeight: '1.1',
          marginBottom: '24px',
          letterSpacing: '-1.5px',
          color: '#FFFFFF'
        }}>
          Where Talent Meets <span style={{ color: '#00E5FF', fontStyle: 'italic' }}>Opportunity</span>
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: '18px',
          color: '#9CA3AF',
          lineHeight: '1.7',
          marginBottom: '40px',
          maxWidth: '650px',
          margin: '0 auto 40px'
        }}>
          The professional network connecting Sri Lankan football players, clubs, and coaches. 
          Build your career, discover talent, and take your game to the next level.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
          <Link to="/select-role" style={{
            backgroundColor: '#00E5FF',
            color: '#0A0F1F',
            padding: '16px 40px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 30px rgba(0,229,255,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,229,255,0.5)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,229,255,0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            Start Your Journey
            <span style={{ fontSize: '20px' }}>→</span>
          </Link>
          <Link to="/login" style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: '#FFFFFF',
            padding: '16px 40px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
            border: '1px solid rgba(255,255,255,0.15)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#00E5FF';
            e.currentTarget.style.color = '#00E5FF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.color = '#FFFFFF';
          }}>
            Sign In
          </Link>
        </div>

        {/* Trust Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '60px',
          flexWrap: 'wrap',
          paddingTop: '40px',
          borderTop: '1px solid rgba(255,255,255,0.08)'
        }}>
          {[
            { value: '500+', label: 'Active Players' },
            { value: '120+', label: 'Partner Clubs' },
            { value: '200+', label: 'Opportunities' },
            { value: '95%', label: 'Success Rate' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#00E5FF', marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== FEATURES SECTION ========== */}
      <div id="features" style={{
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 20px',
        zIndex: 1
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(0,229,255,0.1)',
            color: '#00E5FF',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '20px'
          }}>
            Why GoalLink
          </div>
          <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px', lineHeight: '1.1' }}>
            Everything You Need<br />
            To <span style={{ color: '#00E5FF' }}>Succeed</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '17px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            A complete professional platform built for the modern football ecosystem
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { icon: '⚽', title: 'Professional Player Profiles', desc: 'Build a comprehensive football CV with stats, achievements, highlights, and career history. Get discovered by top clubs.' },
            { icon: '🔍', title: 'Smart Talent Discovery', desc: 'Advanced filters by position, location, experience, and skills. Find the perfect match for your team instantly.' },
            { icon: '💬', title: 'Direct Communication', desc: 'Message players and clubs directly. Negotiate trials, discuss opportunities, all within the platform.' },
            { icon: '🎯', title: 'Opportunity Board', desc: 'Browse trials, vacancies, and match opportunities. Apply directly and track your application status.' },
            { icon: '🏆', title: 'Club Recruitment Tools', desc: 'Post opportunities, save talented players to shortlists, and manage applications all in one place.' },
            { icon: '✓', title: 'Trusted & Secure', desc: 'Verified clubs, secure authentication, and safe communication. Your data and privacy protected.' }
          ].map((feature, index) => (
            <div key={index} style={{
              backgroundColor: '#1E1F2A',
              borderRadius: '20px',
              padding: '36px',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00E5FF';
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,229,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(0,229,255,0.1)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '24px'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>{feature.title}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: '1.6' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========== HOW IT WORKS ========== */}
      <div id="how-it-works" style={{
        position: 'relative',
        padding: '100px 20px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(30,31,42,0.3)',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '70px' }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: 'rgba(0,229,255,0.1)',
              color: '#00E5FF',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}>
              Simple Process
            </div>
            <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px' }}>
              Start Playing in 3 Steps
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '17px', maxWidth: '600px', margin: '0 auto' }}>
              From sign-up to signed contract in record time
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            {[
              { num: '1', title: 'Create Profile', desc: 'Sign up in seconds and build your professional football profile with all your stats and achievements' },
              { num: '2', title: 'Connect & Explore', desc: 'Browse opportunities or discover talent. Use smart filters to find the perfect match' },
              { num: '3', title: 'Make Your Move', desc: 'Message directly, apply to trials, and take your football career to new heights' }
            ].map((step, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(0,229,255,0.2) 0%, rgba(0,229,255,0.05) 100%)',
                  border: '2px solid rgba(0,229,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#00E5FF',
                  margin: '0 auto 28px',
                  boxShadow: '0 0 30px rgba(0,229,255,0.2)'
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '14px' }}>{step.title}</h3>
                <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: '1.7', maxWidth: '280px', margin: '0 auto' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== CTA SECTION ========== */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        padding: '120px 20px',
        background: 'linear-gradient(180deg, rgba(0,229,255,0.03) 0%, transparent 100%)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '56px',
            fontWeight: '900',
            marginBottom: '24px',
            lineHeight: '1.1',
            letterSpacing: '-1.5px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #00E5FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Ready to Take Your<br />
            Game to the Next Level?
          </h2>
          <p style={{ color: '#9CA3AF', marginBottom: '40px', fontSize: '18px', lineHeight: '1.6' }}>
            Join the fastest growing football network in Sri Lanka.<br />
            Free to join. No credit card required.
          </p>
          <Link to="/select-role" style={{
            backgroundColor: '#00E5FF',
            color: '#0A0F1F',
            padding: '18px 48px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '17px',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s',
            boxShadow: '0 10px 40px rgba(0,229,255,0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,229,255,0.6)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,229,255,0.4)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            Join GoalLink Today
            <span style={{ fontSize: '22px' }}>→</span>
          </Link>
        </div>
      </div>

      {/* ========== FOOTER ========== */}
      <footer style={{
        position: 'relative',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '60px 40px 30px',
        backgroundColor: '#080B17',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#00E5FF',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                ⚽
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', margin: 0 }}>
                Goal<span style={{ color: '#00E5FF' }}>Link</span>
              </h3>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: '1.7' }}>
              Sri Lanka's premier football recruitment and networking platform. Connecting talent with opportunity.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', color: '#FFFFFF', letterSpacing: '0.5px' }}>FOR PLAYERS</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Create Profile', 'Find Clubs', 'Browse Opportunities', 'Player Dashboard'].map((item) => (
                <span key={item} style={{ color: '#9CA3AF', fontSize: '13px', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', color: '#FFFFFF', letterSpacing: '0.5px' }}>FOR CLUBS</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Find Players', 'Post Opportunities', 'Recruitment Tools', 'Club Dashboard'].map((item) => (
                <span key={item} style={{ color: '#9CA3AF', fontSize: '13px', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', color: '#FFFFFF', letterSpacing: '0.5px' }}>COMPANY</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <span key={item} style={{ color: '#9CA3AF', fontSize: '13px', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', textAlign: 'center' }}>
          <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
            © 2026 GoalLink. All rights reserved. Made with ⚽ in Sri Lanka
          </p>
        </div>
      </footer>

      {/* ========== ANIMATION STYLES ========== */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}