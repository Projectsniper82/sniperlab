'use client';

import React, { useState } from 'react';

interface AdvancedModeModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdvancedModeModal({ onConfirm, onCancel }: AdvancedModeModalProps) {
  const [text, setText] = useState('');

  const canConfirm = text.trim().toUpperCase() === 'AGREE';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg space-y-4 max-w-md text-center">
        <h2 className="text-xl font-bold text-white">Enable Advanced Mode</h2>
        <p className="text-gray-300 text-sm">
          Advanced mode executes custom code which may pose security or compliance risks. Proceed only if you understand the consequences.
        </p>
        <p className="text-gray-300 text-sm">
          Type <span className="font-bold">AGREE</span> to confirm.
        </p>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-3 py-1 bg-gray-700 text-white rounded">
            Cancel
          </button>
          <button
            onClick={() => canConfirm && onConfirm()}
            disabled={!canConfirm}
            className="px-3 py-1 bg-red-700 text-white rounded disabled:opacity-50"
          >
            Enable
          </button>
        </div>
      </div>
    </div>
  );
}