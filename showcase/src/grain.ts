import * as THREE from 'three';

/** One rice grain, 1 unit long along X: pointed ends, slightly flattened. Shared by every scene. */
export const makeGrainGeometry = (): THREE.BufferGeometry => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 36; i++) {
    const t = i / 36;
    const r = 0.115 * Math.pow(Math.sin(Math.PI * t), 0.6) * (0.9 + 0.2 * t);
    pts.push(new THREE.Vector2(r, (t - 0.5) * 1));
  }
  const geo = new THREE.LatheGeometry(pts, 24);
  geo.rotateZ(Math.PI / 2);
  geo.scale(1, 1, 0.82);
  geo.computeVertexNormals();
  return geo;
};
