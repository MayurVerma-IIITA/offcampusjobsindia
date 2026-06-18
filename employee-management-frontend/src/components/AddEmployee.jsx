import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmployee } from '../api/employeeApi';

const AddEmployee = () => {
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
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Data parsing
      const payload = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null
      };
      await createEmployee(payload);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Add New Employee</h2>
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
            {saving ? 'Saving...' : 'Save Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
