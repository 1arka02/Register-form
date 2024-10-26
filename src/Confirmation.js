// confirmation.js

import React from 'react';
import './Confirmation.css';

const Confirmation = () => {
  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="success-icon">✅</div>
        <h1 className="confirmation-message">Registration Successful!</h1>
        <p className="confirmation-details">
          Thank you for registering. Your account has been created successfully.
        </p>
        <a href="/" className="back-to-home">
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default Confirmation;
