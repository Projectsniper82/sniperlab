import React, { useEffect, useState, useRef } from "react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, 
  ResponsiveContainer, ReferenceLine, BarChart, Bar,
  ComposedChart, Area, Scatter
} from "recharts";
import { getSimulatedPool } from "@/utils/simulatedPoolStore";

function TokenChart({ tokenAddress }) {
  const [data, setData] = useState([]);
  const [poolExists, setPoolExists] = useState(false);
  const [displayMode, setDisplayMode] = useState('price'); // 'price' or 'marketCap'
  const [stats, setStats] = useState({
    price: 0,
    marketCap: 0,
    liquidity: 0,
    volume: 0,
    priceChange24h: 0,
    solUsdPrice: 110 // Default SOL price in USD
  });
  
  // Use this ref to store the update interval
  const intervalRef = useRef(null);
  // Track if component is mounted
  const isMounted = useRef(true);
  
  // Fetch SOL price in USD
  const fetchSolPrice = async () => {
    try {
      // In a real app, you would fetch from an actual API
      // For now we'll use a fixed price
      const fixedPrice = 110; 
      
      setStats(prev => ({
        ...prev,
        solUsdPrice: fixedPrice
      }));
      
      console.log("SOL price: $", fixedPrice.toFixed(2));
    } catch (error) {
      console.error("Error fetching SOL price:", error);
    }
  };

  // Calculate market cap for each data point
  const calculateMarketCap = (price, totalSupply = 1000000000) => {
    return price * totalSupply;
  };

  useEffect(() => {
    // Set component as mounted
    isMounted.current = true;
    
    // Initial data load
    updateChartData();
    fetchSolPrice();
    
    // Set up interval to poll for updates - this doesn't create simulation, 
    // just checks if real trades have happened
    intervalRef.current = setInterval(updateChartData, 5000);
    
    // Clean up interval on component unmount
    return () => {
      isMounted.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tokenAddress, displayMode]);

  const updateChartData = () => {
    const pool = getSimulatedPool();
    
    // Exit if component unmounted
    if (!isMounted.current) return;
    
    // Check if we have a pool and check token match (case insensitive for safety)
    if (pool && pool.tokenAddress && 
        pool.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()) {
      
      setPoolExists(true);
      
      // Update stats
      const currentPrice = pool.price;
      // Handle case of negative price (which shouldn't happen in real AMMs)
      const safePrice = currentPrice < 0 ? Math.abs(currentPrice) : currentPrice;
      
      const firstPrice = pool.candles.length > 0 ? pool.candles[0].open : safePrice;
      const priceChange = ((safePrice - firstPrice) / firstPrice) * 100;
      
      setStats(prev => ({
        ...prev,
        price: safePrice,
        marketCap: calculateMarketCap(safePrice),
        liquidity: pool.solAmount * 2, // Simplified liquidity calculation (SOL value × 2)
        volume: pool.volume,
        priceChange24h: priceChange
      }));
      
      // Map candles to chart data points based on display mode
      const chartData = pool.candles.map(c => {
        // Ensure prices are positive for display
        const closePrice = c.close < 0 ? Math.abs(c.close) : c.close;
        const openPrice = c.open < 0 ? Math.abs(c.open) : c.open;
        const highPrice = c.high < 0 ? Math.abs(c.high) : c.high;
        const lowPrice = c.low < 0 ? Math.abs(c.low) : c.low;
        
        // For candlestick visualization
        const increasing = closePrice >= openPrice;
        
        const dataPoint = {
          time: new Date(c.timestamp).toLocaleTimeString(),
          timestamp: c.timestamp,
          price: closePrice,
          open: openPrice,
          high: highPrice,
          low: lowPrice,
          close: closePrice,
          increasing,
          marketCap: calculateMarketCap(closePrice),
          volume: pool.volume / pool.candles.length // Simple volume distribution
        };
        return dataPoint;
      });
      
      setData(chartData);
    } else {
      if (!poolExists) {
        console.log("No matching pool found for chart");
      }
    }
  };

  const formatValue = (value) => {
    if (displayMode === 'price') {
      return value.toFixed(8);
    } else {
      // Format market cap with appropriate suffix (K, M, B)
      if (value >= 1000000000) {
        return (value / 1000000000).toFixed(2) + 'B';
      } else if (value >= 1000000) {
        return (value / 1000000).toFixed(2) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(2) + 'K';
      } else {
        return value.toFixed(2);
      }
    }
  };
  
  // Format USD value for display
  const formatUsd = (value) => {
    return '$' + value.toFixed(2);
  };

  if (data.length === 0) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800 text-center">
        <p className="text-gray-400">No chart data available yet. Create a liquidity pool first.</p>
      </div>
    );
  }
  
  // Calculate USD values
  const liquidityUsd = stats.liquidity * stats.solUsdPrice;
  const marketCapUsd = stats.marketCap * stats.solUsdPrice;

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">📈 Token Analytics</h2>
        
        {/* Display toggle buttons */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button 
            className={`px-3 py-1 text-sm rounded-md ${displayMode === 'price' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            onClick={() => setDisplayMode('price')}
          >
            Price
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${displayMode === 'marketCap' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            onClick={() => setDisplayMode('marketCap')}
          >
            Market Cap
          </button>
        </div>
      </div>
      
      {/* Stats Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">Current Price</p>
          <p className="text-white font-bold">{stats.price.toFixed(8)} SOL</p>
          <p className="text-green-400 text-xs">{formatUsd(stats.price * stats.solUsdPrice)}</p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">Market Cap</p>
          <p className="text-white font-bold">{formatValue(stats.marketCap)} SOL</p>
          <p className="text-green-400 text-xs">{formatUsd(marketCapUsd)}</p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">LP Value</p>
          <p className="text-white font-bold">{stats.liquidity.toFixed(4)} SOL</p>
          <p className="text-green-400 text-xs">{formatUsd(liquidityUsd)}</p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">24h Change</p>
          <p className={stats.priceChange24h >= 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
            {stats.priceChange24h.toFixed(2)}%
          </p>
          <p className="text-blue-400 text-xs">SOL: {formatUsd(stats.solUsdPrice)}</p>
        </div>
      </div>
      
      {/* Chart */}
      <div className="bg-gray-800 p-3 rounded-lg">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#999' }} 
              axisLine={{ stroke: '#555' }}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tickFormatter={(val) => formatValue(val)}
              tick={{ fill: '#999' }}
              axisLine={{ stroke: '#555' }}
            />
            <Tooltip 
              formatter={(val) => [formatValue(val), displayMode === 'price' ? 'Price (SOL)' : 'Market Cap']}
              labelFormatter={(label) => `Time: ${label}`}
              contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
              itemStyle={{ color: '#9BD0F5' }}
              labelStyle={{ color: '#fff' }}
            />
            <ReferenceLine 
              y={displayMode === 'price' ? stats.price : stats.marketCap} 
              stroke="#fff" 
              strokeDasharray="3 3" 
              label={{ 
                value: "Current", 
                fill: '#fff',
                position: 'insideBottomRight'
              }}
            />
            
            {/* Area fill under the line */}
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <Area 
              type="monotone" 
              dataKey={displayMode === 'price' ? 'price' : 'marketCap'} 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
            
            {/* Candlestick-like visualization using custom scatter points */}
            {data.map((entry, index) => {
              const isIncreasing = entry.close >= entry.open;
              return (
                <Scatter 
                  key={`candle-${index}`}
                  name={`candle-${index}`}
                  data={[{
                    time: entry.time,
                    [displayMode === 'price' ? 'price' : 'marketCap']: entry.open
                  }]}
                  fill={isIncreasing ? "#4CAF50" : "#FF5252"} 
                  line={{ stroke: isIncreasing ? "#4CAF50" : "#FF5252" }}
                />
              );
            })}
            
            <Line 
              type="monotone" 
              dataKey={displayMode === 'price' ? 'price' : 'marketCap'} 
              stroke="#9BD0F5" 
              dot={false}
              strokeWidth={2}
              activeDot={{ r: 6, fill: '#1E88E5' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Volume Chart */}
      <div className="mt-4 bg-gray-800 p-3 rounded-lg">
        <h3 className="text-sm text-gray-400 mb-2">Volume</h3>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#999', fontSize: 10 }} 
              axisLine={{ stroke: '#555' }}
            />
            <YAxis 
              tickFormatter={(val) => val.toFixed(3)}
              tick={{ fill: '#999', fontSize: 10 }}
              axisLine={{ stroke: '#555' }}
            />
            <Tooltip 
              formatter={(val) => [`${val.toFixed(3)} SOL`, 'Volume']}
              contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
              itemStyle={{ color: '#9BD0F5' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="volume" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TokenChart;