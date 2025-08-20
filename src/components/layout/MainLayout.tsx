'use client';

import { ReactNode } from 'react';
import TranquilNebula from '@/components/effects/TranquilNebula';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div id="main-layout-container" className="min-h-screen relative overflow-hidden">
      {/* Static tranquil nebula background */}
      <TranquilNebula rotation={0} />
      
      {/* Fixed UI layer - always centered */}
      <div id="ui-layer" className="relative z-10 min-h-screen">
        <main id="main-content" className="relative z-20">
          {children}
        </main>
      </div>
    </div>
  );
}