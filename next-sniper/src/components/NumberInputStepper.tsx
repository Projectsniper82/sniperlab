'use client';

import React from 'react';

interface NumberInputStepperProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    step: number;
    min: number;
}

export const NumberInputStepper = ({ label, value, onChange, step, min }: NumberInputStepperProps) => {
    const handleStep = (direction: 'up' | 'down') => {
        const currentValue = parseFloat(value) || 0;
        const newValue = direction === 'up' ? currentValue + step : Math.max(min, currentValue - step);
        const precision = step < 1 ? 2 : 0;
        onChange(newValue.toFixed(precision));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <div className="flex items-center">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-2 bg-gray-700 border-gray-600 rounded-l-md text-white text-center font-mono focus:outline-none"
                    placeholder="0.0"
                    step={step}
                    min={min}
                />
                <div className="flex flex-col h-full">
                    <button onClick={() => handleStep('up')} className="px-2 flex-1 bg-gray-600 hover:bg-gray-500 text-white rounded-tr-md border-b border-gray-700">+</button>
                    <button onClick={() => handleStep('down')} className="px-2 flex-1 bg-gray-600 hover:bg-gray-500 text-white rounded-br-md">-</button>
                </div>
            </div>
        </div>
    );
};