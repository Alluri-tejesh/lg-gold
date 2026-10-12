import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { StationTag } from './StationTag';
import * as THREE from 'three';
import { world } from '../store';

const L = 6.4;
const H = 2.6;
const W = 2.5;
const MAX = 1000;
const BAG_LEN = 0.58;
const BAG_H = 0.22;
const BAG_T = 0.23;
const base = import.meta.env.BASE_URL;

/** A 20ft container with the near wall cut away. The bags inside follow the tonnage slider. */
export const Container = () => {
  const bags = useRef<THREE.InstancedMesh>(null);
  const shown = useRef(0);
  const art = useTexture(`${base}textures/bag-front.jpg`);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const tex = useMemo(() => {
    const t = art.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.center.set(0.5, 0.5);
    t.rotation = Math.PI / 2; // portrait print runs along the bag's long side
    t.needsUpdate = true;
    return t;
  }, [art]);

  const slots = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < MAX; i++) {
      const slice = Math.floor(i / 100); // fills from the back wall toward the doors
      const row = Math.floor((i % 100) / 10);
      const col = i % 10;
      out.push([
        -L / 2 + 0.2 + BAG_LEN / 2 + slice * BAG_LEN,
        0.12 + BAG_H / 2 + row * BAG_H,
        -W / 2 + 0.1 + BAG_T / 2 + col * BAG_T,
      ]);
    }
    return out;
  }, []);

  useFrame((_, dt) => {
    const m = bags.current;
    if (!m) return;
    const target = Math.round((world.tonnes * 1000) / 26);
    // ease the count so bags appear in a quick wave instead of popping
    shown.current += (target - shown.current) * Math.min(1, dt * 6);
    const count = Math.round(shown.current);
    m.count = Math.max(0, Math.min(MAX, count));
    slots.forEach((p, i) => {
      if (i >= m.count) return;
      dummy.position.set(p[0], p[1], p[2]);
      dummy.scale.set(0.97, 0.97, 0.97);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  const green = '#14594a';
  const ribs = Array.from({ length: 34 }, (_, i) => -L / 2 + 0.12 + i * ((L - 0.24) / 33));

  return (
    <group position={[0, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color="#cfd6cf" roughness={1} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[L, 0.12, W]} />
        <meshStandardMaterial color="#6d5a44" roughness={0.9} />
      </mesh>
      {/* back wall with corrugation */}
      <mesh position={[0, H / 2, -W / 2]}>
        <boxGeometry args={[L, H, 0.06]} />
        <meshStandardMaterial color={green} roughness={0.55} />
      </mesh>
      {ribs.map((x, i) => (
        <mesh key={i} position={[x, H / 2, -W / 2 - 0.04]}>
          <boxGeometry args={[0.07, H - 0.1, 0.05]} />
          <meshStandardMaterial color={green} roughness={0.55} />
        </mesh>
      ))}
      {/* closed end and open doors */}
      <mesh position={[-L / 2, H / 2, 0]}>
        <boxGeometry args={[0.06, H, W]} />
        <meshStandardMaterial color={green} roughness={0.55} />
      </mesh>
      <mesh position={[0, H, 0]}>
        <boxGeometry args={[L, 0.06, W]} />
        <meshStandardMaterial color={green} transparent opacity={0.16} depthWrite={false} />
      </mesh>
      {[1, -1].map((s) => (
        <group key={s} position={[L / 2, 0, s * (W / 2)]} rotation={[0, s * -1.9, 0]}>
          <mesh position={[0, H / 2, -s * (W / 4)]}>
            <boxGeometry args={[0.05, H, W / 2]} />
            <meshStandardMaterial color={green} roughness={0.55} />
          </mesh>
        </group>
      ))}
      {/* corner posts */}
      {[
        [-L / 2, -W / 2],
        [L / 2, -W / 2],
        [-L / 2, W / 2],
        [L / 2, W / 2],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, H / 2, z]}>
          <boxGeometry args={[0.14, H + 0.12, 0.14]} />
          <meshStandardMaterial color="#f5c518" roughness={0.5} />
        </mesh>
      ))}

      <instancedMesh ref={bags} args={[undefined, undefined, MAX]} frustumCulled={false}>
        <boxGeometry args={[BAG_LEN, BAG_H, BAG_T]} />
        <meshStandardMaterial map={tex} roughness={0.55} />
      </instancedMesh>

      <StationTag station={4} position={[0, H + 0.5, 0]}>20ft container, 26 MT</StationTag>
    </group>
  );
};
