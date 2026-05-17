import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { Plus, Trash2, PieChart } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get('/products')
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/categories', { name });
      setName('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error adding category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await apiClient.delete(`/categories/${id}`);
        fetchData();
      } catch (err) {
        alert('Cannot delete category with active products');
      }
    }
  };

  const getProductCount = (categoryId) => {
    return products.filter(p => p.category_id === categoryId).length;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Category Management</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2rem' }}>
        
        {/* Left Side: Form and Table */}
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem' }}>
              <input 
                placeholder="New Category Name" 
                style={{ flex: 1 }} 
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                <Plus size={20} /> Add
              </button>
            </form>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)' }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No categories found. Create one above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Insights */}
        <div>
          <div className="card" style={{ height: '100%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={20} /> Category Insights
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categories.length > 0 ? categories.map(c => {
                const count = getProductCount(c.id);
                // Calculate percentage for a visual progress bar effect
                const maxCount = Math.max(...categories.map(cat => getProductCount(cat.id)), 1);
                const percentage = (count / maxCount) * 100;

                return (
                  <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '500' }}>{c.name}</span>
                      <span className="badge" style={{ background: count > 0 ? '#dcfce7' : '#f1f5f9', color: count > 0 ? '#166534' : '#64748b' }}>
                        {count} Product{count !== 1 && 's'}
                      </span>
                    </div>
                    {/* Visual Bar */}
                    <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${percentage}%`, 
                        background: 'var(--primary)',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                );
              }) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  Add categories to see insights
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminCategories;
