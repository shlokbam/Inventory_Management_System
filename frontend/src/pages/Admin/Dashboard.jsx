import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { Package, IndianRupee, AlertTriangle, Activity, Download, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [inventoryStatus, setInventoryStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : `${dateStr}Z`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, invRes, statusRes] = await Promise.all([
          apiClient.get('/reports/stats'),
          apiClient.get('/invoices'),
          apiClient.get('/reports/inventory-status')
        ]);
        setStats(statsRes.data);
        setInvoices(invRes.data);
        setInventoryStatus(statusRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExport = async (type) => {
    try {
      const response = await apiClient.get(`/reports/export/${type}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const processRevenueData = () => {
    const days = 7;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayInvoices = invoices.filter(inv => {
        const invDate = formatDate(inv.created_at);
        return invDate && invDate.toISOString().split('T')[0] === dateStr;
      });
      
      const total = dayInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
      data.push({
        date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        revenue: total
      });
    }
    return data;
  };

  const processCategoryData = () => {
    const categoryMap = {};
    inventoryStatus.forEach(item => {
      const value = item.current_stock * item.price;
      if (value > 0) {
        categoryMap[item.category] = (categoryMap[item.category] || 0) + value;
      }
    });
    return Object.keys(categoryMap).map(key => ({
      name: key,
      value: categoryMap[key]
    })).sort((a, b) => b.value - a.value);
  };

  const COLORS = ['#4f46e5', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

  if (loading) return <div>Loading dashboard...</div>;

  const revenueData = processRevenueData();
  const categoryData = processCategoryData();

  return (
    <div>
      <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => handleExport('products')} className="btn btn-secondary" style={{ width: 'auto' }}>
            <Download size={18} /> Products CSV
          </button>
          <button onClick={() => handleExport('sales')} className="btn btn-secondary" style={{ width: 'auto' }}>
            <Download size={18} /> Sales CSV
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#e0e7ff', padding: '1rem', borderRadius: '1rem' }}>
            <Package color="#4f46e5" size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Products</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{stats?.total_products}</h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '1rem' }}>
            <IndianRupee color="#22c55e" size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Inventory Value</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', wordBreak: 'break-word' }}>
              ₹{stats?.total_inventory_value?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '1rem' }}>
            <AlertTriangle color="#ef4444" size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Low Stock Items</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{stats?.low_stock_alerts.length}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', border: stats?.expired_products?.length > 0 ? '1px solid #fca5a5' : undefined }}>
          <div style={{ background: '#ffe4e6', padding: '1rem', borderRadius: '1rem' }}>
            <Clock color="#e11d48" size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Expired Items</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: stats?.expired_products?.length > 0 ? '#e11d48' : 'inherit' }}>
              {stats?.expired_products?.length ?? 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid-2-1" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Revenue (Last 7 Days)</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                <RechartsTooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Inventory Value by Category</h2>
          <div style={{ width: '100%', height: 300 }}>
            {categoryData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 'Value']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No inventory data available
              </div>
            )}
            
            {/* Custom Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
              {categoryData.slice(0, 4).map((entry, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2-1">
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Low Stock Alerts</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.low_stock_alerts.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td><span className="badge badge-low">Low Stock</span></td>
                  </tr>
                ))}
                {stats?.low_stock_alerts.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center' }}>No low stock alerts</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Transactions</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>QTY</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent_transactions.map(t => (
                  <tr key={t.id}>
                    <td>
                      <span className={`badge badge-${t.type.toLowerCase()}`}>
                        {t.type}
                      </span>
                    </td>
                    <td>{t.quantity}</td>
                    <td style={{ fontSize: '0.875rem' }}>{formatDate(t.timestamp)?.toLocaleTimeString()}</td>
                  </tr>
                ))}
                {stats?.recent_transactions.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center' }}>No recent activity</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Expired Products Section */}
      <div className="card" style={{ borderLeft: '4px solid #e11d48' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Clock color="#e11d48" size={22} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#e11d48' }}>Expired Products</h2>
          {stats?.expired_products?.length > 0 && (
            <span style={{
              background: '#fee2e2',
              color: '#e11d48',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px'
            }}>
              {stats.expired_products.length} batch{stats.expired_products.length !== 1 ? 'es' : ''} expired
            </span>
          )}
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Batch Number</th>
                <th>Expiry Date</th>
                <th>Qty in Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.expired_products?.length > 0 ? (
                stats.expired_products.map((item, idx) => (
                  <tr key={item.id} style={{ background: '#fff5f5' }}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{idx + 1}</td>
                    <td style={{ fontWeight: '600' }}>{item.product_name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{item.batch_number}</td>
                    <td style={{ color: '#e11d48', fontWeight: '600' }}>
                      {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td>{item.quantity}</td>
                    <td>
                      <span style={{
                        background: '#fee2e2',
                        color: '#b91c1c',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        letterSpacing: '0.03em'
                      }}>EXPIRED</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    ✅ No expired products in stock
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
