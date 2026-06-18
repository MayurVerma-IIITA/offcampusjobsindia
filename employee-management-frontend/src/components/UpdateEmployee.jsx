import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmployeeById, updateEmployee } from '../api/employeeApi';

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    jobTitle: '',
    salary: '',
    dateOfJoining: '',
    status: 'ACTIVE'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const data = await getEmployeeById(id);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        department: data.department || '',
        jobTitle: data.jobTitle || '',
        salary: data.salary || '',
        dateOfJoining: data.dateOfJoining || '',
        status: data.status || 'ACTIVE'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null
      };
      await updateEmployee(id, payload);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="empty-state">Loading employee data...</div>;

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Update Employee</h2>
      </div>
      
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>First Name *</label>
            <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input type="text" name="department" className="form-control" value={formData.department} onChange={handleChange} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Job Title</label>
            <input type="text" name="jobTitle" className="form-control" value={formData.jobTitle} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Salary</label>
            <input type="number" step="0.01" name="salary" className="form-control" value={formData.salary} onChange={handleChange} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Date of Joining</label>
            <input type="date" name="dateOfJoining" className="form-control" value={formData.dateOfJoining} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn" onClick={() => navigate('/')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Updating...' : 'Update Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployee;
