'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface CameraPosition {
  x: number;
  y: number;
  z: number;
  rotation: number;
}

interface CameraContextType {
  position: CameraPosition;
  targetPosition: CameraPosition;
  isTransitioning: boolean;
  setTargetPosition: (position: CameraPosition, smooth?: boolean) => void;
  previewPosition: (position: CameraPosition, intensity?: number) => void;
  resetPreview: () => void;
  isInPreview: boolean;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

// Route to camera position mapping
const ROUTE_POSITIONS: Record<string, CameraPosition> = {
  '/': { x: 0, y: 0, z: 0, rotation: 0 },
  '/explore': { x: -400, y: -200, z: 150, rotation: -20 },
  '/engage': { x: 300, y: 150, z: -100, rotation: 15 },
  '/enlist': { x: 500, y: -300, z: 200, rotation: 30 },
};

interface CameraProviderProps {
  children: ReactNode;
}

export function CameraProvider({ children }: CameraProviderProps) {
  const pathname = usePathname();
  const [targetPosition, setTargetPositionState] = useState<CameraPosition>(
    ROUTE_POSITIONS[pathname] || ROUTE_POSITIONS['/']
  );
  const [position, setPosition] = useState<CameraPosition>(targetPosition);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<CameraPosition | null>(null);
  const [isInPreview, setIsInPreview] = useState(false);

  // Update target position when route changes
  useEffect(() => {
    const newPosition = ROUTE_POSITIONS[pathname] || ROUTE_POSITIONS['/'];
    if (newPosition.x !== targetPosition.x || 
        newPosition.y !== targetPosition.y || 
        newPosition.z !== targetPosition.z ||
        newPosition.rotation !== targetPosition.rotation) {
      setTargetPosition(newPosition, true);
    }
  }, [pathname, targetPosition]);

  const setTargetPosition = useCallback((newPosition: CameraPosition, smooth = true) => {
    setTargetPositionState(newPosition);
    if (smooth) {
      setIsTransitioning(true);
      // Reset transition state after animation completes
      setTimeout(() => setIsTransitioning(false), 2000);
    } else {
      setPosition(newPosition);
    }
  }, []);

  const previewPosition = useCallback((previewPos: CameraPosition, intensity = 0.25) => {
    if (!isTransitioning) {
      const blendedPosition = {
        x: targetPosition.x + (previewPos.x - targetPosition.x) * intensity,
        y: targetPosition.y + (previewPos.y - targetPosition.y) * intensity,
        z: targetPosition.z + (previewPos.z - targetPosition.z) * intensity,
        rotation: targetPosition.rotation + (previewPos.rotation - targetPosition.rotation) * intensity,
      };
      setPreviewTarget(blendedPosition);
      setIsInPreview(true);
    }
  }, [targetPosition, isTransitioning]);

  const resetPreview = useCallback(() => {
    if (!isTransitioning) {
      setPreviewTarget(null);
      setIsInPreview(false);
    }
  }, [isTransitioning]);

  // Smooth interpolation effect
  useEffect(() => {
    let animationFrame: number;
    
    const interpolate = () => {
      const target = previewTarget || targetPosition;
      const current = position;
      
      // Spring-based easing
      const ease = 0.08;
      const newPosition = {
        x: current.x + (target.x - current.x) * ease,
        y: current.y + (target.y - current.y) * ease,
        z: current.z + (target.z - current.z) * ease,
        rotation: current.rotation + (target.rotation - current.rotation) * ease,
      };

      // Check if we're close enough to stop animating
      const threshold = 0.5;
      const isClose = 
        Math.abs(newPosition.x - target.x) < threshold &&
        Math.abs(newPosition.y - target.y) < threshold &&
        Math.abs(newPosition.z - target.z) < threshold &&
        Math.abs(newPosition.rotation - target.rotation) < 0.1;

      if (!isClose) {
        setPosition(newPosition);
        animationFrame = requestAnimationFrame(interpolate);
      } else {
        setPosition(target);
      }
    };

    animationFrame = requestAnimationFrame(interpolate);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetPosition, previewTarget, position]);

  return (
    <CameraContext.Provider value={{
      position,
      targetPosition,
      isTransitioning,
      setTargetPosition,
      previewPosition,
      resetPreview,
      isInPreview,
    }}>
      {children}
    </CameraContext.Provider>
  );
}

export function useCamera() {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
}

export { ROUTE_POSITIONS };