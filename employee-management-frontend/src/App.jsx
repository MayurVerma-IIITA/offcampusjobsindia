import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddEmployeePage from './pages/AddEmployeePage';
import UpdateEmployeePage from './pages/UpdateEmployeePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddEmployeePage />} />
        <Route path="/edit/:id" element={<UpdateEmployeePage />} />
      </Routes>
    </Router>
  );
}

export default App;
