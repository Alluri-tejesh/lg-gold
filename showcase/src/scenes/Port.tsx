import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { world } from '../store';

const PALETTE = ['#d2561f', '#2fa38c', '#f5c518', '#3a6ea5', '#8a3b2a', '#e9eceb'];

const Water = () => {
  const mesh = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(140, 120, 70, 60), []);
  useFrame(({ clock }) => {
    if (!mesh.current || world.reduced) return;
    const t = clock.elapsedTime;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i); // plane's local y becomes world z after rotation
      pos.setZ(i, Math.sin(x * 0.3 + t * 0.9) * 0.12 + Math.cos(y * 0.25 + t * 0.7) * 0.1);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });
  return (
    <mesh ref={mesh} geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
      <meshStandardMaterial color="#2b6c87" roughness={0.35} metalness={0.1} flatShading />
    </mesh>
  );
};

const Ship = () => {
  const group = useRef<THREE.Group>(null);
  const boxes = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const hull = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-7, 1.0);
    s.lineTo(-6.7, -0.9);
    s.lineTo(6.2, -0.9);
    s.lineTo(7.8, 0.35);
    s.lineTo(8.0, 1.0);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 3.2, bevelEnabled: false });
    g.translate(0, 0, -1.6);
    return g;
  }, []);

  const slots = useMemo(() => {
    const out: { p: [number, number, number]; c: string }[] = [];
    let k = 0;
    for (let x = 0; x < 8; x++)
      for (let y = 0; y < 3; y++)
        for (let z = 0; z < 3; z++) {
          if (y === 2 && x > 6) continue;
          out.push({ p: [-3.6 + x * 1.0, 1.35 + y * 0.72, -1.0 + z * 1.0], c: PALETTE[Math.floor(((Math.sin(k++ * 12.9898) * 43758.5453) % 1 + 1) % 1 * PALETTE.length)] });
        }
    return out;
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = world.reduced ? 0 : clock.elapsedTime;
    group.current.position.y = Math.sin(t * 0.9) * 0.08;
    group.current.rotation.z = Math.sin(t * 0.7) * 0.018;
    group.current.rotation.y = -0.18 + world.drag * 0.3;
  });

  return (
    <group ref={group}>
      <mesh geometry={hull}>
        <meshStandardMaterial color="#8a1f1f" roughness={0.6} />
      </mesh>
      <mesh position={[0.5, 0.97, 0]}>
        <boxGeometry args={[14.6, 0.06, 3.3]} />
        <meshStandardMaterial color="#f5c518" />
      </mesh>
      {/* bridge */}
      <mesh position={[-5.7, 2.1, 0]}>
        <boxGeometry args={[1.6, 2.2, 2.6]} />
        <meshStandardMaterial color="#f1f1ec" roughness={0.5} />
      </mesh>
      <mesh position={[-5.7, 3.4, 0]}>
        <boxGeometry args={[1.9, 0.5, 2.9]} />
        <meshStandardMaterial color="#f1f1ec" roughness={0.5} />
      </mesh>
      <mesh position={[-5.7, 3.95, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.8, 10]} />
        <meshStandardMaterial color="#d2561f" />
      </mesh>
      <instancedMesh
        ref={(m) => {
          boxes.current = m;
          if (!m) return;
          const c = new THREE.Color();
          slots.forEach((s, i) => {
            dummy.position.set(...s.p);
            dummy.updateMatrix();
            m.setMatrixAt(i, dummy.matrix);
            m.setColorAt(i, c.set(s.c));
          });
          m.instanceMatrix.needsUpdate = true;
          if (m.instanceColor) m.instanceColor.needsUpdate = true;
        }}
        args={[undefined, undefined, slots.length]}
        frustumCulled={false}
      >
        <boxGeometry args={[0.92, 0.68, 0.92]} />
        <meshStandardMaterial roughness={0.6} />
      </instancedMesh>
    </group>
  );
};

export const Port = () => (
  <group>
    <Water />
    <Ship />
    {/* low evening sun */}
    <group position={[-24, 1.6, -34]}>
      <mesh>
        <circleGeometry args={[9, 48]} />
        <meshBasicMaterial color="#ffb347" transparent opacity={0.3} fog={false} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[4.6, 48]} />
        <meshBasicMaterial color="#ffd27a" fog={false} />
      </mesh>
    </group>
  </group>
);
