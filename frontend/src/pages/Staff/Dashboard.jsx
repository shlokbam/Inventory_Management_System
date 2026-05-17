import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, Package, Search, CreditCard, AlertTriangle, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_bills_today: 0,
    total_revenue_today: 0,
    recent_invoices: [],
    low_stock_alerts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await apiClient.get('/reports/staff-dashboard');
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching staff dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Welcome, {user.username}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Ready for a new sale?</p>
      </div>

      {/* Quick Stats */}
      <div className="stat-grid" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#e0e7ff', padding: '1rem', borderRadius: '0.75rem', color: '#4338ca' }}>
            <FileText size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>My Bills Today</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total_bills_today}</p>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '0.75rem', color: '#15803d' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>My Revenue Today</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{stats.total_revenue_today.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <NavLink to="/staff/billing" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ 
            height: '160px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '1rem',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: 'white',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '1rem' }}>
              <ShoppingCart size={32} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>New Billing (POS)</h2>
          </div>
        </NavLink>

        <NavLink to="/staff/catalog" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ 
            height: '160px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '1rem',
            border: '2px dashed var(--border)',
            background: 'transparent',
            boxShadow: 'none',
            color: 'var(--text-main)',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.backgroundColor = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          >
            <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '1rem', color: 'var(--primary)' }}>
              <Package size={32} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>View Catalog</h2>
          </div>
        </NavLink>
      </div>

      {/* Bottom Grid: Recent Bills & Low Stock */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '2rem' }}>
        {/* Recent Bills */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--primary)" /> Recent Bills
          </h3>
          {stats.recent_invoices.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No bills created yet today.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Bill ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_invoices.map(inv => (
                    <tr key={inv.id}>
                      <td>#{inv.id}</td>
                      <td>{inv.customer_name}</td>
                      <td style={{ fontWeight: 600 }}>₹{inv.total_amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color="#e11d48" /> Low Stock Alerts
          </h3>
          {stats.low_stock_alerts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>All products are well stocked!</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.low_stock_alerts.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>
                        <span className="badge badge-out" style={{ background: '#fee2e2', color: '#ef4444' }}>
                          {item.quantity} left
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
