import { useEffect, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const BAG_W = 1.5;
export const BAG_H = 3;
const BAG_D = 0.78;

const base = import.meta.env.BASE_URL;
const FRONT = `${base}textures/bag-front.jpg`;
const SIDE = `${base}textures/bag-side.jpg`;

/** A subdivided box pushed into a pillow shape, so the sack reads as filled rather than as a cuboid. */
const makeSackGeometry = (): THREE.BufferGeometry => {
  const geo = new THREE.BoxGeometry(BAG_W, BAG_H, BAG_D, 28, 56, 10);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const nx = x / (BAG_W / 2);
    const ny = y / (BAG_H / 2);
    const bulge = (1 - nx * nx) * (1 - ny ** 6);
    // fuller in the middle, flat at the stitched top and bottom seams
    const crinkle = Math.sin(y * 7) * 0.006 * bulge;
    pos.setZ(i, pos.getZ(i) * (0.12 + 0.88 * Math.pow(bulge, 0.55)) + Math.sign(pos.getZ(i)) * crinkle);
    pos.setX(i, x * (1 - 0.035 * Math.abs(ny) ** 4));
  }
  geo.computeVertexNormals();
  return geo;
};

export const Bag = () => {
  const gl = useThree((s) => s.gl);
  const [front, side] = useTexture([FRONT, SIDE]);
  const geometry = useMemo(makeSackGeometry, []);

  useEffect(() => {
    [front, side].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = gl.capabilities.getMaxAnisotropy();
      t.needsUpdate = true;
    });
    return () => geometry.dispose();
  }, [front, side, gl, geometry]);

  const printed = (map: THREE.Texture) => (
    <meshPhysicalMaterial map={map} roughness={0.42} clearcoat={0.55} clearcoatRoughness={0.3} />
  );
  const seam = <meshStandardMaterial color="#0B3D31" roughness={0.6} />;

  // BoxGeometry material order: +x, -x, +y, -y, +z (front), -z (back)
  return (
    <mesh geometry={geometry} castShadow>
      {printed(side)}
      {printed(side)}
      {seam}
      {seam}
      {printed(front)}
      {printed(front)}
    </mesh>
  );
};
