import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { world } from '../store';
import { Bag } from '../Bag';

const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

const STALKS = 1500;

/** Swaying rice crop: instanced tapered blades in rows, like the paddy on the bag. */
const Crop = () => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const data = useMemo(
    () =>
      Array.from({ length: STALKS }, (_, i) => ({
        x: (rand(i + 1) - 0.5) * 34,
        z: 1.5 - rand(i + 77) * 17,
        h: 0.4 + rand(i + 13) * 0.4,
        phase: rand(i + 5) * 6.28,
      })),
    [],
  );

  const set = (t: number) => {
    const m = mesh.current;
    if (!m) return;
    data.forEach((d, i) => {
      const sway = world.reduced ? 0 : Math.sin(t * 1.6 + d.phase + d.x * 0.35) * 0.14;
      dummy.position.set(d.x, 0, d.z);
      dummy.rotation.set(0.04, 0, sway);
      dummy.scale.set(1, d.h, 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  };

  useFrame(({ clock }) => set(clock.elapsedTime));

  return (
    <instancedMesh
      ref={(m) => {
        mesh.current = m;
        if (m) {
          data.forEach((d, i) => m.setColorAt(i, color.set(rand(i) > 0.7 ? '#c9d85a' : rand(i) > 0.35 ? '#46b896' : '#2fa38c')));
          if (m.instanceColor) m.instanceColor.needsUpdate = true;
        }
      }}
      args={[undefined, undefined, STALKS]}
      frustumCulled={false}
    >
      <coneGeometry args={[0.035, 1, 4]} />
      <meshLambertMaterial />
    </instancedMesh>
  );
};

const Hill = ({ z, y, color, seed, amp }: { z: number; y: number; color: string; seed: number; amp: number }) => {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    const W = 90;
    s.moveTo(-W, -6);
    for (let i = 0; i <= 90; i++) {
      const x = -W + (i / 90) * 2 * W;
      const h = Math.sin(x * 0.07 + seed) * amp + Math.sin(x * 0.19 + seed * 2) * amp * 0.35 + amp;
      s.lineTo(x, h);
    }
    s.lineTo(W, -6);
    return new THREE.ShapeGeometry(s);
  }, [seed, amp]);
  return (
    <mesh geometry={geo} position={[0, y, z]}>
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

const Palm = ({ x, z, s = 1, lean = 0 }: { x: number; z: number; s?: number; lean?: number }) => {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current && !world.reduced) g.current.rotation.z = lean + Math.sin(clock.elapsedTime * 0.8 + x) * 0.015;
  });
  return (
    <group ref={g} position={[x, 0, z]} scale={s} rotation={[0, 0, lean]}>
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.07, 0.13, 3.4, 6]} />
        <meshLambertMaterial color="#3b2a3f" />
      </mesh>
      <group position={[0, 3.4, 0]}>
        {Array.from({ length: 9 }, (_, k) => (
          <group key={k} rotation={[0, (k / 9) * Math.PI * 2, 0]}>
            <mesh position={[0.55, -0.12, 0]} rotation={[0, 0, -1.15]}>
              <coneGeometry args={[0.1, 1.3, 4]} />
              <meshLambertMaterial color="#1f4d3f" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

const Tractor = () => {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = world.reduced ? 4 : clock.elapsedTime;
    g.current.position.x = -11 + ((t * 0.75) % 22);
    g.current.position.y = world.reduced ? 0 : Math.abs(Math.sin(t * 6)) * 0.015;
  });
  const wheel = (x: number, z: number, r: number, w: number) => (
    <group position={[x, r, z]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[r, r, w, 14]} />
        <meshLambertMaterial color="#1c1a1f" />
      </mesh>
      <mesh>
        <cylinderGeometry args={[r * 0.55, r * 0.55, w + 0.02, 12]} />
        <meshLambertMaterial color="#d2561f" />
      </mesh>
    </group>
  );
  return (
    <group ref={g} position={[0, 0, -4.2]}>
      <mesh position={[0.45, 0.95, 0]}>
        <boxGeometry args={[1.5, 0.55, 0.75]} />
        <meshLambertMaterial color="#d2561f" />
      </mesh>
      <mesh position={[-0.55, 1.35, 0]}>
        <boxGeometry args={[0.7, 0.8, 0.7]} />
        <meshLambertMaterial color="#2a2530" />
      </mesh>
      <mesh position={[-0.55, 1.78, 0]}>
        <boxGeometry args={[0.85, 0.06, 0.85]} />
        <meshLambertMaterial color="#d2561f" />
      </mesh>
      <mesh position={[1.0, 1.45, 0.15]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
        <meshLambertMaterial color="#2a2530" />
      </mesh>
      {wheel(-0.65, 0.5, 0.62, 0.34)}
      {wheel(-0.65, -0.5, 0.62, 0.34)}
      {wheel(1.05, 0.42, 0.34, 0.2)}
      {wheel(1.05, -0.42, 0.34, 0.2)}
      {/* harrow dragging behind */}
      <mesh position={[-1.9, 0.18, 0]}>
        <boxGeometry args={[0.7, 0.08, 1.3]} />
        <meshLambertMaterial color="#2a2530" />
      </mesh>
    </group>
  );
};

const Sun = () => {
  const halo = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (halo.current && !world.reduced) halo.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 0.8) * 0.03);
  });
  return (
    <group position={[11, 4.2, -32]}>
      <mesh ref={halo}>
        <circleGeometry args={[7.5, 48]} />
        <meshBasicMaterial color="#ffe08a" transparent opacity={0.28} fog={false} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[4.2, 48]} />
        <meshBasicMaterial color="#fff6c2" fog={false} />
      </mesh>
    </group>
  );
};

const HeroBag = () => {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = world.reduced ? 0 : clock.elapsedTime;
    g.current.rotation.y = -0.45 + Math.sin(t * 0.5) * 0.3 + world.drag;
  });
  return (
    <group ref={g} position={[0, 1.3, -3]} scale={0.85}>
      <Bag />
    </group>
  );
};

export const Field = () => (
  <group>
    <HeroBag />
    <Sun />
    <Hill z={-26} y={-1} color="#8a5a7e" seed={1.3} amp={2.6} />
    <Hill z={-20} y={-1.4} color="#5a4a82" seed={4.1} amp={2.1} />
    <Hill z={-15} y={-1.6} color="#3f3a68" seed={2.2} amp={1.2} />
    {[-14, -9, -4.5, 6, 11, 15].map((x, i) => (
      <Palm key={i} x={x} z={-13 - (i % 3) * 2.2} s={0.9 + (i % 2) * 0.3} lean={(i - 2.5) * 0.012} />
    ))}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -6]}>
      <planeGeometry args={[120, 60]} />
      <meshLambertMaterial color="#1f8f7a" />
    </mesh>
    <Crop />
    <Tractor />
  </group>
);
