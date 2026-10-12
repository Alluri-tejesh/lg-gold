import { ReactNode, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { world } from './store';
import { Environment, Lightformer } from '@react-three/drei';
import { Rig } from './Rig';
import { STATION_Z } from './stations';
import { Field } from './scenes/Field';
import { Grain } from './scenes/Grain';
import { Sorter } from './scenes/Sorter';
import { Packing } from './scenes/Packing';
import { Container } from './scenes/Container';
import { Port } from './scenes/Port';

/** Keeps a scene in the graph only while the camera is within reach of its station. */
const Station = ({ index, children }: { index: number; children: ReactNode }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.visible = Math.abs(world.f - index) < 0.5;
  });
  return (
    <group ref={ref} position={[0, 0, STATION_Z[index]]}>
      {children}
    </group>
  );
};

export const Scene = () => (
  <Canvas dpr={[1, 1.75]} camera={{ position: [0, 1.7, 7], fov: 40, near: 0.1, far: 140 }} gl={{ antialias: true, alpha: true }} aria-hidden="true">
    <ambientLight intensity={0.7} />
    <hemisphereLight args={['#fff4dc', '#2a5a4c', 0.7]} />
    <directionalLight position={[6, 9, 6]} intensity={2.1} />
    <Suspense fallback={null}>
      {/* Procedural studio lights so glossy surfaces have something to reflect, with no HDR download. */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2} position={[0, 5, 4]} scale={[9, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffc66b" position={[-6, 1, -1]} rotation-y={Math.PI / 2} scale={[4, 7, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#9fe3c8" position={[6, 0, -1]} rotation-y={-Math.PI / 2} scale={[4, 7, 1]} />
      </Environment>
      <Rig />
      <Station index={0}><Field /></Station>
      <Station index={1}><Grain /></Station>
      <Station index={2}><Sorter /></Station>
      <Station index={3}><Packing /></Station>
      <Station index={4}><Container /></Station>
      <Station index={5}><Port /></Station>
    </Suspense>
  </Canvas>
);
