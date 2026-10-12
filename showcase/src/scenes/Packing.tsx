import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { StationTag } from './StationTag';
import * as THREE from 'three';
import { Bag } from '../Bag';
import { makeGrainGeometry } from '../grain';
import { clamp, lerp, smooth, world } from '../store';

const STREAM = 70;
const BAG_Y = 1.55; // bag centre, so its base rests on the platform
const STATION = 3;

/** Grain pours from a spout and the empty, flat bag swells to a full 26 kg sack, then turns to show its print. */
export const Packing = () => {
  const geo = useMemo(makeGrainGeometry, []);
  const bag = useRef<THREE.Group>(null);
  const stream = useRef<THREE.InstancedMesh>(null);
  const fill = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => Array.from({ length: STREAM }, (_, i) => ({ p: i / STREAM, dx: Math.sin(i * 12.9) * 0.12, dz: Math.cos(i * 7.3) * 0.08 })), []);

  useFrame(({ clock }, dt) => {
    const near = Math.abs(world.f - STATION) < 0.45;
    fill.current = clamp(fill.current + (near ? dt / 3.2 : -dt / 0.8));
    if (world.reduced) fill.current = near ? 1 : 0;
    const f = smooth(fill.current);

    if (bag.current) {
      bag.current.scale.set(lerp(0.88, 1, f), lerp(0.94, 1, f), lerp(0.28, 1, f));
      bag.current.rotation.y = lerp(-1.05, 0.12, f) + world.drag;
      bag.current.position.y = BAG_Y;
    }

    const m = stream.current;
    if (!m) return;
    const pouring = fill.current > 0.02 && fill.current < 0.98 && !world.reduced;
    seeds.forEach((s, i) => {
      const p = (s.p + clock.elapsedTime * 0.9) % 1;
      const y = lerp(3.5, BAG_Y + 1.1, p);
      dummy.position.set(s.dx, y, s.dz);
      dummy.rotation.set(p * 9, p * 6, 0.3);
      dummy.scale.setScalar(pouring ? 0.2 : 0.0001);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[12, 48]} />
        <meshStandardMaterial color="#0f4a3a" roughness={0.95} />
      </mesh>
      {/* weighing platform */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[1.5, 1.6, 0.12, 40]} />
        <meshStandardMaterial color="#c8cfcd" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* supply pipe runs in from the side, so the headline above the scene stays clear */}
      <mesh position={[-7, 4.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.34, 0.34, 14, 24]} />
        <meshStandardMaterial color="#e1e5e4" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 3.85, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.7, 24]} />
        <meshStandardMaterial color="#e1e5e4" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 3.52, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.1, 24]} />
        <meshStandardMaterial color="#f5c518" />
      </mesh>
      <group ref={bag} position={[0, BAG_Y, 0]}>
        <Bag />
      </group>
      <instancedMesh ref={stream} args={[geo, undefined, STREAM]} frustumCulled={false}>
        <meshStandardMaterial color="#f8f0d8" roughness={0.45} />
      </instancedMesh>
      <StationTag station={3} position={[2.4, 1.2, 0]}>26 kg net</StationTag>
    </group>
  );
};
