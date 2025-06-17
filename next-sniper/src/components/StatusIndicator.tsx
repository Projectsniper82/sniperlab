'use client';

import React from 'react';

interface StatusIndicatorProps {
    label: string;
    active: boolean;
}

export const StatusIndicator = ({ label, active }: StatusIndicatorProps) => (
    <div className="flex items-center gap-2 text-xs">
        <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        <span className={active ? 'text-gray-300' : 'text-gray-500'}>{label}</span>
    </div>
);