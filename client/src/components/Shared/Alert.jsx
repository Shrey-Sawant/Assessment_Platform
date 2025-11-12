// src/components/Shared/Alert.jsx
import React from 'react';

const Alert = ({ message, type }) => {
  if (!message) return null;
  
  let baseClasses = 'p-3 rounded-lg text-sm mb-4';
  let colorClasses = '';

  switch (type) {
    case 'success':
      colorClasses = 'bg-green-100 text-green-700';
      break;
    case 'error':
      colorClasses = 'bg-red-100 text-red-700';
      break;
    case 'info':
    default:
      colorClasses = 'bg-blue-100 text-blue-700';
      break;
  }

  return (
    <div className={`${baseClasses} ${colorClasses}`} role="alert">
      {message}
    </div>
  );
};

export default Alert;