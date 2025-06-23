
import './globals.css';
import React from 'react';
import { NetworkProvider } from '@/context/NetworkContext';
import { AppWalletProvider } from '@/context/AppWalletProvider';
import { TokenProvider } from '@/context/TokenContext';
import { BotServiceProvider } from '@/context/BotServiceContext';
import { BotLogicProvider } from '@/context/BotLogicContext';
import { GlobalLogProvider } from '@/context/GlobalLogContext';
import { BotWalletReloadProvider } from '@/context/BotWalletReloadContext';
import '@solana/wallet-adapter-react-ui/styles.css';

export const metadata = {
  title: 'Raydium Trading Interface',
  description: 'Built with Next.js + Solana Devnet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NetworkProvider>
          <TokenProvider>
            <BotServiceProvider>
              <BotLogicProvider>
                <AppWalletProvider>
                  <GlobalLogProvider>
                     <BotWalletReloadProvider>
                      {children}
                    </BotWalletReloadProvider>
                  </GlobalLogProvider>
                </AppWalletProvider>
              </BotLogicProvider>
            </BotServiceProvider>
          </TokenProvider>
        </NetworkProvider>
      </body>
    </html>
  );
}