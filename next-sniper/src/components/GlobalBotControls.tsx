'use client';

import React, { useState } from 'react';

// Define the props for the component
interface GlobalBotControlsProps {
    isLogicEnabled: boolean;
    onToggleLogic: (isEnabled: boolean) => void;
}

export default function GlobalBotControls({ isLogicEnabled, onToggleLogic }: GlobalBotControlsProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            {/* Header is always visible and acts as the toggle button */}
            <div 
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-xl font-bold text-white">
                    Global Bot Controls
                </h2>
                <span className={`transition-transform transform text-white ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </div>
            
            {/* Content is conditionally rendered based on the expanded state */}
            {isExpanded && (
                <div className="p-4 border-t border-gray-600 space-y-4">
                    <div className="flex items-center justify-between">
                        <label htmlFor="auto-trade-toggle" className="font-semibold text-gray-200">
                            Automated Trading Logic
                        </label>
                        <div className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    id="auto-trade-toggle" 
                                    className="sr-only" 
                                    checked={isLogicEnabled} 
                                    onChange={(e) => onToggleLogic(e.target.checked)} 
                                />
                                <div className={`block ${isLogicEnabled ? 'bg-green-600' : 'bg-gray-600'} w-14 h-8 rounded-full`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isLogicEnabled ? 'translate-x-6' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-white font-bold">{isLogicEnabled ? 'ON' : 'OFF'}</div>
                        </div>
                    </div>
                     <div className="text-xs text-gray-400 p-2 bg-gray-900 rounded-md">
                        <p className='font-bold text-gray-300'>Future Settings:</p>
                        <p>Global Stop-Loss, Take-Profit, and other logic settings will go here.</p>
                    </div>
                </div>
            )}
        </div>
    );
}