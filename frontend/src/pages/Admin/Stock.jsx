import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { Plus, Database, History } from 'lucide-react';

const AdminStock = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    product_id: location.state?.preSelectId || '',
    batch_number: '',
    expiry_date: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : `${dateStr}Z`);
  };

  const fetchData = async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        apiClient.get('/products'),
        apiClient.get('/transactions')
      ]);
      setProducts(pRes.data);
      setTransactions(tRes.data.filter(t => t.type === 'IN').slice(0, 10));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/batches', {
        ...formData,
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity),
        expiry_date: new Date(formData.expiry_date).toISOString()
      });
      setSuccess('Stock added successfully!');
      setFormData({ product_id: '', batch_number: '', expiry_date: '', quantity: '' });
      fetchData(); // Refresh history
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.detail || 'Error adding stock');
    }
  };

  const getProductName = (id) => {
    return products.find(p => p.id === id)?.name || `ID: ${id}`;
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading stock data...</p>
    </div>
  );

  const displayedTransactions = formData.product_id 
    ? transactions.filter(t => t.product_id === parseInt(formData.product_id))
    : transactions.slice(0, 10);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Stock Management (IN)</h1>
      
      {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2rem' }}>
        {/* Left Side: Form */}
        <div>
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} /> Add New Batch
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Product</label>
                <select 
                  required 
                  style={{ width: '100%' }} 
                  value={formData.product_id}
                  onChange={e => setFormData({...formData, product_id: e.target.value})}
                >
                  <option value="">-- Choose Product --</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Batch Number</label>
                  <input 
                    required 
                    style={{ width: '100%' }} 
                    placeholder="e.g. B-001"
                    value={formData.batch_number}
                    onChange={e => setFormData({...formData, batch_number: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Expiry Date</label>
                  <input 
                    type="date" 
                    required 
                    style={{ width: '100%' }} 
                    value={formData.expiry_date}
                    onChange={e => setFormData({...formData, expiry_date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Quantity IN</label>
                <input 
                  type="number" 
                  required 
                  min="1"
                  style={{ width: '100%' }} 
                  placeholder="0"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                <Database size={20} /> Add to Inventory
              </button>
            </form>
          </div>
          
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '0.75rem', color: '#92400e', fontSize: '0.875rem' }}>
            <strong>Note:</strong> Adding stock creates a new batch for the product. Stock reduction will follow FIFO logic based on expiry date.
          </div>
        </div>

        {/* Right Side: History */}
        <div>
          <div className="card" style={{ height: '100%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={20} /> {formData.product_id ? 'Product Stock History' : 'Recent Stock IN History'}
            </h2>
            
            <div className="table-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    <th>Product</th>
                    <th>QTY</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTransactions.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 500 }}>{getProductName(t.product_id)}</td>
                      <td>
                        <span className="badge badge-in">+{t.quantity}</span>
                      </td>
                      <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {formatDate(t.timestamp)?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {displayedTransactions.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        {formData.product_id ? 'No stock history found for this product.' : 'No recent stock additions.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStock;
