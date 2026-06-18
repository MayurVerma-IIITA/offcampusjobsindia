import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllEmployees, searchEmployees, deleteEmployee } from '../api/employeeApi';
import SearchEmployee from './SearchEmployee';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getAllEmployees();
      setEmployees(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (kw) => {
    setKeyword(kw);
    if (!kw.trim()) {
      fetchEmployees();
      return;
    }
    try {
      const data = await searchEmployees(kw);
      setEmployees(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        fetchEmployees(); // Refresh list after deletion
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="container">
      <div className="top-bar">
        <h2>Directory</h2>
        <SearchEmployee keyword={keyword} onSearch={handleSearch} />
      </div>
      
      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading directory...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Job Title</th>
                <th>Salary</th>
                <th>Date of Joining</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td style={{fontWeight: 500}}>{emp.firstName} {emp.lastName}</td>
                    <td style={{color: 'var(--text-secondary)'}}>{emp.email}</td>
                    <td>{emp.phone || '-'}</td>
                    <td>{emp.department || '-'}</td>
                    <td>{emp.jobTitle || '-'}</td>
                    <td>{emp.salary ? `$${emp.salary.toLocaleString()}` : '-'}</td>
                    <td>{emp.dateOfJoining || '-'}</td>
                    <td>
                      <span className={`status-badge ${emp.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <Link to={`/edit/${emp.id}`} className="btn btn-secondary btn-icon" title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                          </svg>
                        </Link>
                        <button onClick={() => handleDelete(emp.id)} className="btn btn-danger btn-icon" title="Delete">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="empty-state">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
