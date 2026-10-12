import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { StationTag } from './StationTag';
import * as THREE from 'three';
import { makeGrainGeometry } from '../grain';
import { world } from '../store';

const N = 110;
const SPEED = 2.1;
const GATE = 0.4;

interface G {
  x: number;
  y: number;
  z: number;
  bad: boolean;
  ej: boolean;
  vx: number;
  vy: number;
  vz: number;
  rot: number;
  len: number;
}

const rnd = (i: number) => {
  const x = Math.sin(i * 91.7) * 12345.6789;
  return x - Math.floor(x);
};

/** A live belt: grains travel under the camera gate and discoloured or broken ones are blown into the reject bin. */
export const Sorter = () => {
  const geo = useMemo(makeGrainGeometry, []);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const beam = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const grains = useMemo<G[]>(
    () =>
      Array.from({ length: N }, (_, i) => {
        const bad = rnd(i + 3) < 0.24;
        return {
          x: -8 + rnd(i) * 16,
          y: 0.22,
          z: (rnd(i + 9) - 0.5) * 1.7,
          bad,
          ej: false,
          vx: 0,
          vy: 0,
          vz: 0,
          rot: rnd(i + 21) * 3,
          len: bad && rnd(i + 5) > 0.5 ? 0.14 : 0.26,
        };
      }),
    [],
  );

  const colorize = (m: THREE.InstancedMesh | null) => {
    if (!m) return;
    const c = new THREE.Color();
    grains.forEach((g, i) => m.setColorAt(i, c.set(g.bad ? (rnd(i) > 0.5 ? '#7a5521' : '#c9a93a') : '#f8f0d8')));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  };

  useFrame(({ clock }, dt) => {
    const m = mesh.current;
    if (!m) return;
    const d = Math.min(dt, 0.05);
    const run = world.reduced ? 0 : 1;
    grains.forEach((g, i) => {
      if (g.ej) {
        g.x += g.vx * d * run;
        g.y += g.vy * d * run;
        g.z += g.vz * d * run;
        g.vy -= 12 * d * run;
        g.rot += 9 * d * run;
        if (g.y < -0.1) {
          g.ej = false;
          g.x = -8;
          g.y = 0.22;
          g.z = (rnd(i + clock.elapsedTime) - 0.5) * 1.7;
        }
      } else {
        g.x += SPEED * d * run;
        if (g.bad && g.x > GATE && g.x < GATE + 0.3 && !world.reduced) {
          g.ej = true;
          g.vx = 0.9;
          g.vy = 4.2 + rnd(i) * 1.5;
          g.vz = -(1.6 + rnd(i + 2) * 1.1);
        }
        if (g.x > 8) {
          g.x = -8;
          g.z = (rnd(i + clock.elapsedTime) - 0.5) * 1.7;
        }
      }
      dummy.position.set(g.x, g.y, g.z);
      dummy.rotation.set(g.ej ? g.rot : 0, g.ej ? g.rot * 0.5 : g.rot * 0.2, 0);
      dummy.scale.setScalar(g.len);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;

    if (beam.current) {
      const mat = beam.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.35 + (world.reduced ? 0.15 : Math.sin(clock.elapsedTime * 9) * 0.12);
    }
  });

  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color="#0e3a30" roughness={0.9} />
      </mesh>
      {/* belt */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[18, 0.1, 2.3]} />
        <meshStandardMaterial color="#1d2625" roughness={0.8} />
      </mesh>
      {[-1.2, 1.2].map((z) => (
        <mesh key={z} position={[0, 0.1, z]}>
          <boxGeometry args={[18, 0.2, 0.1]} />
          <meshStandardMaterial color="#8f9a98" metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
      {/* optical gate */}
      <group position={[0, 0, 0]}>
        {[-1.45, 1.45].map((z) => (
          <mesh key={z} position={[0, 0.9, z]}>
            <boxGeometry args={[0.35, 1.8, 0.22]} />
            <meshStandardMaterial color="#d9dedd" metalness={0.5} roughness={0.35} />
          </mesh>
        ))}
        <mesh position={[0, 1.95, 0]}>
          <boxGeometry args={[0.7, 0.45, 3.4]} />
          <meshStandardMaterial color="#e9eceb" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.2, 0]}>
          <boxGeometry args={[0.72, 0.06, 3.42]} />
          <meshStandardMaterial color="#f5c518" />
        </mesh>
        <mesh ref={beam} position={[0, 0.9, 0]}>
          <boxGeometry args={[0.03, 1.8, 2.5]} />
          <meshBasicMaterial color="#ff3b30" transparent opacity={0.4} depthWrite={false} />
        </mesh>
        <StationTag station={2} position={[0, 2.85, 0]}>Optical sorter</StationTag>
      </group>
      {/* reject bin and good-grain chute */}
      <mesh position={[GATE + 0.9, 0.25, -2.3]}>
        <boxGeometry args={[2.4, 0.5, 1.2]} />
        <meshStandardMaterial color="#5a2f1f" roughness={0.9} />
      </mesh>
      <StationTag station={2} position={[GATE + 0.9, 0.95, -2.3]} warn>Rejected grains</StationTag>
      <mesh position={[8.6, 0.35, 0]}>
        <boxGeometry args={[1.4, 0.7, 2.3]} />
        <meshStandardMaterial color="#e9eceb" metalness={0.4} roughness={0.35} />
      </mesh>

      <instancedMesh ref={(m) => { mesh.current = m; colorize(m); }} args={[geo, undefined, N]} frustumCulled={false}>
        <meshStandardMaterial roughness={0.45} />
      </instancedMesh>
    </group>
  );
};
