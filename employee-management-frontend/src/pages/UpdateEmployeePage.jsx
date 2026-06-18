import React from 'react';
import Navbar from '../components/Navbar';
import UpdateEmployee from '../components/UpdateEmployee';

const UpdateEmployeePage = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <UpdateEmployee />
      </div>
    </>
  );
};

export default UpdateEmployeePage;
