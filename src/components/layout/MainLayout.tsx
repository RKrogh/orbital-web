'use client';

import { ReactNode } from 'react';
import EnhancedSpaceBackground from '../effects/EnhancedSpaceBackground';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div id="main-layout-container" className="relative min-h-screen overflow-hidden">
      {/* Enhanced parallax space background */}
      <EnhancedSpaceBackground />
      
      {/* Main content area */}
      <main id="main-content" className="relative z-10">
        <div id="content-wrapper" className="max-w-4xl mx-auto px-6">
          {children}
        </div>
      </main>
    </div>
  );
}