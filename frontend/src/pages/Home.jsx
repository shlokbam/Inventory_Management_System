import React from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, Users, Shield, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      {/* Navbar */}
      <header style={{ 
        padding: '1.5rem 2rem', 
        backgroundColor: 'var(--bg-card)', 
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem', color: 'white' }}>
            <Package size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>IMS Pro</h1>
        </div>
        <div>
          <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Login to Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1 }}>
        <section style={{ 
          padding: '6rem 2rem', 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, var(--bg-main) 0%, #e0e7ff 100%)' 
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="hero-title">
              Smart Inventory Management for Modern Businesses
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
              Streamline your stock, track sales, and manage your staff with our powerful, intuitive platform designed to scale with your business.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem', textDecoration: 'none' }}>
                Get Started <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ padding: '5rem 2rem', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h3 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '3rem' }}>Why Choose IMS Pro?</h3>
            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              
              <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                <div style={{ background: '#e0e7ff', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                  <TrendingUp size={32} />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Real-time Tracking</h4>
                <p style={{ color: 'var(--text-muted)' }}>Monitor your inventory levels in real-time, preventing stockouts and overstocking automatically.</p>
              </div>

              <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                <div style={{ background: '#dcfce7', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--success)' }}>
                  <Users size={32} />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Staff Management</h4>
                <p style={{ color: 'var(--text-muted)' }}>Assign roles, track staff performance, and manage permissions with our multi-tier access system.</p>
              </div>

              <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                <div style={{ background: '#fee2e2', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--danger)' }}>
                  <Shield size={32} />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Secure & Reliable</h4>
                <p style={{ color: 'var(--text-muted)' }}>Your data is protected with enterprise-grade security, ensuring your business information stays safe.</p>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#1e293b', 
        color: 'white', 
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Package size={24} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>IMS Pro</h2>
        </div>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Making inventory management effortless.</p>
        <div style={{ borderTop: '1px solid #334155', paddingTop: '2rem', color: '#64748b', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} IMS Pro. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
