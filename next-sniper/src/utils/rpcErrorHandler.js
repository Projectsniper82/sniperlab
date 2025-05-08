// src/utils/rpcErrorHandler.js
export const handleRpcError = (error) => {
    console.error('RPC Error:', error);
    
    // Check for rate limit errors
    if (error.message && (
      error.message.includes('429 Too Many Requests') || 
      error.message.includes('rate limit') || 
      error.message.includes('Too many requests')
    )) {
      return {
        isRateLimit: true,
        message: 'Rate limit exceeded. Please try again in a few seconds.'
      };
    }
    
    // Check for simulation failures
    if (error.message && error.message.includes('Transaction simulation failed')) {
      return {
        isSimulationFailure: true,
        message: 'Transaction simulation failed. You may have insufficient funds or the transaction is invalid.'
      };
    }
    
    return {
      isUnknown: true,
      originalError: error,
      message: error.message || 'Unknown RPC error occurred'
    };
  };