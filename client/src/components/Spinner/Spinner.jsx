// Spinner.js
import React from 'react';
import { ClipLoader } from 'react-spinners';
import '../../Styles/Spinner.css';

const Spinner = ({ loading }) => {
  return (
    <div className="spinner">
      <ClipLoader color={"#123abc"} loading={loading} size={100} />
    </div>
  );
};

export default Spinner;