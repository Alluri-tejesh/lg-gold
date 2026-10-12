import { ReactNode, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { clamp, world } from '../store';

interface StationTagProps {
  station: number;
  position: [number, number, number];
  warn?: boolean;
  children: ReactNode;
}

/** A label pinned to a 3D object that fades in only while the camera is at its station. */
export const StationTag = ({ station, position, warn, children }: StationTagProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  useFrame(() => {
    if (ref.current) ref.current.style.opacity = String(clamp(1 - Math.abs(world.f - station) * 2.4));
  });
  return (
    <Html center position={position} style={{ pointerEvents: 'none' }}>
      <span ref={ref} className={`tag${warn ? ' tag-warn' : ''}`} style={{ opacity: 0 }}>
        {children}
      </span>
    </Html>
  );
};
