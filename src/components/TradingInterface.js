import React, { useState, useEffect } from 'react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const TradingInterface = ({ tokenAddress, connection, wallet }) => {
  const [tradeType, setTradeType] = useState('buy'); // 'buy' or 'sell'
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', isError: false });
  const [priceImpact, setPriceImpact] = useState('0.00');
  const [expectedOutput, setExpectedOutput] = useState('0');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [solBalance, setSolBalance] = useState(0);
  
  useEffect(() => {
    if (!connection || !wallet || !tokenAddress) return;
    
    const fetchBalances = async () => {
      try {
        // Get SOL balance
        const lamports = await connection.getBalance(wallet.publicKey);
        setSolBalance(lamports / LAMPORTS_PER_SOL);
        
        // Try to get token balance
        try {
          const mintPubkey = new PublicKey(tokenAddress);
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            wallet.publicKey,
            { mint: mintPubkey }
          );
          
          if (tokenAccounts.value.length > 0) {
            const accountInfo = tokenAccounts.value[0].account.data.parsed.info;
            const amount = accountInfo.tokenAmount.amount;
            const decimals = accountInfo.tokenAmount.decimals;
            setTokenBalance(Number(amount) / Math.pow(10, decimals));
          } else {
            setTokenBalance(0);
          }
        } catch (err) {
          console.log('No token account found:', err);
          setTokenBalance(0);
        }
      } catch (err) {
        console.error('Error fetching balances:', err);
      }
    };
    
    fetchBalances();
  }, [connection, wallet, tokenAddress]);
  
  // Calculate price impact and expected output when amount changes
  useEffect(() => {
    if (!amount || Number(amount) <= 0) {
      setPriceImpact('0.00');
      setExpectedOutput('0');
      return;
    }
    
    // This is a simplified price impact calculation
    // In reality, this would be based on liquidity pool depths
    const impact = Math.min((Number(amount) * 2) / 100, 15); // Max 15% impact
    setPriceImpact(impact.toFixed(2));
    
    // Calculate expected output (simplified - would normally come from DEX quote)
    const mockTokenPrice = 0.0001; // SOL per token
    
    if (tradeType === 'buy') {
      const tokensOut = Number(amount) / mockTokenPrice;
      setExpectedOutput(tokensOut.toLocaleString(undefined, { maximumFractionDigits: 2 }));
    } else {
      const solOut = Number(amount) * mockTokenPrice;
      setExpectedOutput(solOut.toFixed(4));
    }
  }, [amount, tradeType]);
  
  const executeTrade = async () => {
    if (!tokenAddress || !connection || !wallet || !amount || Number(amount) <= 0) {
      setStatus({ message: 'Please enter a valid amount', isError: true });
      return;
    }
    
    setLoading(true);
    setStatus({ message: '', isError: false });
    
    try {
      if (tradeType === 'buy') {
        // Check if user has enough SOL
        if (Number(amount) > solBalance) {
          throw new Error('Insufficient SOL balance');
        }
        
        // This is a simplified example. In a real implementation,
        // you would use Jupiter SDK to execute the swap
        setStatus({ 
          message: 'This would execute a real buy transaction. Feature coming soon!', 
          isError: false 
        });
      } else {
        // Check if user has enough tokens
        if (Number(amount) > tokenBalance) {
          throw new Error('Insufficient token balance');
        }
        
        // This is a simplified example. In a real implementation,
        // you would use Jupiter SDK to execute the swap
        setStatus({ 
          message: 'This would execute a real sell transaction. Feature coming soon!', 
          isError: false 
        });
      }
      
      // Simulated delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (err) {
      console.error(`Error ${tradeType}ing tokens:`, err);
      setStatus({ 
        message: `Error ${tradeType}ing tokens: ${err.message}`, 
        isError: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-medium mb-4">Trading Interface</h2>
      
      <div className="space-y-4">
        <div className="flex space-x-2 mb-4">
          <button
            className={`flex-1 py-2 rounded-lg ${tradeType === 'buy' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTradeType('buy')}
          >
            Buy
          </button>
          <button
            className={`flex-1 py-2 rounded-lg ${tradeType === 'sell' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTradeType('sell')}
          >
            Sell
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {tradeType === 'buy' ? 'SOL Amount to Spend' : 'Token Amount to Sell'}
          </label>
          <div className="flex">
            <input
              type="number"
              className="flex-1 p-2 border rounded-l"
              placeholder={tradeType === 'buy' ? 'SOL Amount' : 'Token Amount'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step={tradeType === 'buy' ? '0.01' : '1'}
            />
            <button
              className="bg-gray-200 px-3 rounded-r"
              onClick={() => {
                if (tradeType === 'buy') {
                  setAmount(Math.max(0, solBalance - 0.01).toFixed(2)); // Leave 0.01 SOL for fees
                } else {
                  setAmount(tokenBalance.toString());
                }
              }}
            >
              MAX
            </button>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Balance: {tradeType === 'buy' ? `${solBalance.toFixed(4)} SOL` : `${tokenBalance.toLocaleString()} Tokens`}</span>
            <span>Price Impact: ~{priceImpact}%</span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Expected Output:</span>
            <span className="font-medium">
              {expectedOutput} {tradeType === 'buy' ? 'Tokens' : 'SOL'}
            </span>
          </div>
        </div>
        
        <button
          className={`w-full py-3 rounded-lg text-white font-medium ${
            tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          } disabled:opacity-50`}
          onClick={executeTrade}
          disabled={loading || !amount || Number(amount) <= 0 || !tokenAddress || !wallet}
        >
          {loading ? 'Processing...' : tradeType === 'buy' ? 'Buy Tokens' : 'Sell Tokens'}
        </button>
        
        {status.message && (
          <div className={`mt-2 p-3 rounded text-sm ${status.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingInterface;
