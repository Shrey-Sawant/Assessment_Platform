// src/components/Shared/DataCard.jsx
import React from 'react';

const DataCard = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold text-indigo-700 mb-4 border-b pb-2">{title}</h3>
      {children}
    </div>
  );
};

export default DataCard;