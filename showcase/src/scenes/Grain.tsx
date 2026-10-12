import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { StationTag } from './StationTag';
import * as THREE from 'three';
import { makeGrainGeometry } from '../grain';
import { world } from '../store';

const ORBIT = 90;

/** A single grain at 5x scale, with a ruler, and a swarm of grains circling it. */
export const Grain = () => {
  const geo = useMemo(makeGrainGeometry, []);
  const big = useRef<THREE.Group>(null);
  const swarm = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: ORBIT }, (_, i) => ({
        r: 3.6 + ((i * 37) % 100) / 100 * 3.2,
        a: (i / ORBIT) * Math.PI * 2 * 3,
        speed: 0.12 + (((i * 53) % 100) / 100) * 0.18,
        y: -1.4 + (((i * 29) % 100) / 100) * 2.8,
        tilt: (((i * 17) % 100) / 100) * 6.28,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const t = world.reduced ? 0 : clock.elapsedTime;
    if (big.current) {
      big.current.rotation.x = t * 0.35 + world.drag * 0.4;
      big.current.rotation.y = -0.25 + world.drag;
      big.current.position.y = Math.sin(t * 0.9) * 0.08;
    }
    const m = swarm.current;
    if (!m) return;
    seeds.forEach((s, i) => {
      const a = s.a + t * s.speed;
      dummy.position.set(Math.cos(a) * s.r, s.y + Math.sin(a * 1.3) * 0.5, Math.sin(a) * s.r * 0.55 - 1);
      dummy.rotation.set(s.tilt + t * 0.6, a, 0.4);
      dummy.scale.setScalar(0.5);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[0, 1.7, 0]}>
      <group ref={big} scale={5}>
        <mesh geometry={geo}>
          <meshPhysicalMaterial color="#f8f0d8" roughness={0.36} sheen={1} sheenColor="#ffffff" clearcoat={0.35} clearcoatRoughness={0.4} />
        </mesh>
      </group>

      {/* ruler under the grain */}
      <group position={[0, -1.35, 0]}>
        <mesh>
          <boxGeometry args={[5, 0.025, 0.025]} />
          <meshBasicMaterial color="#0b3d31" />
        </mesh>
        {[-2.5, 2.5].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <boxGeometry args={[0.025, 0.28, 0.025]} />
            <meshBasicMaterial color="#0b3d31" />
          </mesh>
        ))}
        <StationTag station={1} position={[0, -0.42, 0]}>4.8 to 5.2 mm long</StationTag>
      </group>

      <instancedMesh ref={swarm} args={[geo, undefined, ORBIT]} frustumCulled={false}>
        <meshStandardMaterial color="#f3e9c6" roughness={0.5} />
      </instancedMesh>
    </group>
  );
};
