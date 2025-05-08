// src/utils/debugRaydium.js
export const examineRaydiumSdk = async () => {
    try {
      // Import the entire module to see what's exported
      const raydiumModule = await import('@raydium-io/raydium-sdk-v2');
      
      // Log all available exports
      console.log('Available exports from Raydium SDK:', Object.keys(raydiumModule));
      
      // Check for specific exports we're looking for
      console.log('Has Raydium?', !!raydiumModule.Raydium);
      console.log('Has TxVersion?', !!raydiumModule.TxVersion);
      console.log('Has Liquidity?', !!raydiumModule.Liquidity);
      console.log('Has Cpmm?', !!raydiumModule.Cpmm);
      
      // If Raydium exists, check what methods it has
      if (raydiumModule.Raydium) {
        console.log('Raydium methods:', Object.getOwnPropertyNames(raydiumModule.Raydium));
        console.log('Raydium prototype methods:', 
                    Object.getOwnPropertyNames(raydiumModule.Raydium.prototype || {}));
      }
      
      return raydiumModule;
    } catch (error) {
      console.error('Error examining SDK:', error);
    }
  };