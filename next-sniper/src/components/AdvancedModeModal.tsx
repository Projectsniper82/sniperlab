'use client';

import React, { useState } from 'react';

interface AdvancedModeModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdvancedModeModal({ onConfirm, onCancel }: AdvancedModeModalProps) {
  const [text, setText] = useState('');

  // The logic to enable the confirm button remains the same.
  const canConfirm = text.trim().toUpperCase() === 'AGREE';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl space-y-4 max-w-lg w-full border border-yellow-500/50">
        
        {/* --- MODIFIED TITLE --- */}
        <h2 className="text-xl font-bold text-white">
          ⚠️ Advanced Mode Activation - Acknowledgment Required
        </h2>

        {/* --- MODIFIED BODY --- */}
        <div className="space-y-3 text-left text-gray-300 text-sm">
            <p>
               You are about to activate <strong>Advanced Mode</strong>. Your strategy will receive an extra <code>context.systemState</code> object containing <code>allBots</code> and <code>tradeCounts</code>, alongside the market data already provided. This enables the implementation of coordinated trading strategies.
            </p>
            <p>
                By proceeding, you acknowledge and agree that you are <strong>solely and exclusively responsible</strong> for the trading logic you implement and for ensuring its full compliance with all applicable laws, rules, and regulations governing securities and financial markets.
            </p>
            <p>
                The use of this feature to engage in any form of market manipulation, including but not limited to wash trading or spoofing, is a material breach of our Terms of Service and is <strong>strictly prohibited</strong>.
            </p>
        </div>

        {/* --- MODIFIED CONFIRMATION PROMPT --- */}
        <div className="pt-2">
            <p className="text-gray-400 text-sm mb-2">
                To confirm that you have read, understood, and agree to these terms, please type <strong>AGREE</strong> into the field below.
            </p>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="AGREE"
              className="w-full p-2 rounded bg-gray-900 border border-gray-600 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white text-center tracking-widest font-bold"
            />
        </div>

        {/* --- MODIFIED BUTTONS --- */}
        <div className="flex justify-end space-x-4 pt-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => canConfirm && onConfirm()}
            disabled={!canConfirm}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-500 transition-colors"
          >
            Enable Advanced Mode
          </button>
        </div>

      </div>
    </div>
  );
}