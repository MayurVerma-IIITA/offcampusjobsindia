import React from 'react';
import Navbar from '../components/Navbar';
import AddEmployee from '../components/AddEmployee';

const AddEmployeePage = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <AddEmployee />
      </div>
    </>
  );
};

export default AddEmployeePage;
