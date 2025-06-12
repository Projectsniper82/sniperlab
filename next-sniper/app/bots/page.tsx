'use client';

import React from 'react';
import AppHeader from '@/components/AppHeader';
import BotManager from '@/components/BotManager'; // You will create this in the `src/components` folder

export default function TradingBotsPage() {
  return (
    <div className="p-4 sm:p-6 text-white bg-gray-950 min-h-screen font-sans">
      <AppHeader />
      <main>
        <BotManager />
      </main>
    </div>
  );
}