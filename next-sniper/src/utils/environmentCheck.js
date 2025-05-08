// src/utils/environmentCheck.js
export const checkEnvironment = () => {
    const issues = [];
    
    // Check Buffer
    if (typeof window !== 'undefined' && !window.Buffer) {
      issues.push('Buffer polyfill missing');
    }
    
    // Check BigInt support
    if (typeof BigInt === 'undefined') {
      issues.push('BigInt not supported in this browser');
    }
    
    // Check process
    if (typeof window !== 'undefined' && !window.process) {
      issues.push('process polyfill missing');
    }
    
    // Check TextEncoder/TextDecoder
    if (typeof TextEncoder === 'undefined' || typeof TextDecoder === 'undefined') {
      issues.push('TextEncoder/TextDecoder not available');
    }
    
    return {
      isCompatible: issues.length === 0,
      issues
    };
  };