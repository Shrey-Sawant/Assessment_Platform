import React from 'react';

const DataList = ({ title, columns, data }) => (
    <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            {/* Assuming row keys match the column order for simplicity */}
                            {Object.values(row).map((val, i) => (
                                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {val}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length === 0 && (
                <p className="text-center py-6 text-gray-500">No data available.</p>
            )}
        </div>
    </div>
);

export default DataList;