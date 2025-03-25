import React, { useState } from 'react';

const TokenChart = ({ tokenAddress, connection }) => {
  const [timeRange, setTimeRange] = useState('1d'); // 1h, 1d, 1w, 1m options

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Price Chart</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded text-sm ${timeRange === '1h' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeRange('1h')}
          >
            1H
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${timeRange === '1d' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeRange('1d')}
          >
            1D
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${timeRange === '1w' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeRange('1w')}
          >
            1W
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${timeRange === '1m' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeRange('1m')}
          >
            1M
          </button>
        </div>
      </div>
      
      <div className="flex justify-center items-center h-64 bg-gray-50">
        <p className="text-gray-500">
          {tokenAddress 
            ? "Price chart will be displayed here" 
            : "Enter a token address to view price chart"}
        </p>
      </div>
    </div>
  );
};

export default TokenChart;
