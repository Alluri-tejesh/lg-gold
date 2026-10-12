import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { STATIONS } from './stations';
import { clamp, lerp, smooth, world } from './store';

const tmpA = new THREE.Color();
const tmpB = new THREE.Color();

/** Drives the camera, fog and the CSS sky gradient from the scroll position. */
export const Rig = () => {
  const { camera, scene, size } = useThree();
  const dragging = useRef(false);
  const lastX = useRef(0);
  const look = useRef(new THREE.Vector3(...STATIONS[0].look));

  useEffect(() => {
    scene.fog = new THREE.Fog('#fbd78b', 20, 64);
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
      dragging.current = true;
      lastX.current = e.clientX;
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      world.drag += (e.clientX - lastX.current) * 0.012;
      lastX.current = e.clientX;
    };
    const up = () => (dragging.current = false);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [scene]);

  useFrame(({ clock }, dt) => {
    const steps = document.querySelectorAll<HTMLElement>('[data-step]');
    const mid = window.scrollY + window.innerHeight / 2;
    let target = 0;
    for (let k = 0; k < steps.length; k++) {
      const c = steps[k].offsetTop + steps[k].offsetHeight / 2;
      if (mid >= c) {
        const next = steps[k + 1];
        target = k + (next ? clamp((mid - c) / (next.offsetTop + next.offsetHeight / 2 - c)) : 0);
      }
    }
    world.f += (target - world.f) * (1 - Math.exp(-4.5 * dt));
    if (!dragging.current) world.drag += (0 - world.drag) * (1 - Math.exp(-2.2 * dt));

    const i = Math.min(Math.floor(world.f), STATIONS.length - 1);
    const j = Math.min(i + 1, STATIONS.length - 1);
    const t = smooth(world.f - i);
    const a = STATIONS[i];
    const b = STATIONS[j];
    const narrow = size.width / size.height < 0.9;

    const sway = world.reduced ? 0 : Math.sin(clock.elapsedTime * 0.35) * 0.12;
    look.current.set(lerp(a.look[0], b.look[0], t), lerp(a.look[1], b.look[1], t), lerp(a.look[2], b.look[2], t));
    camera.position.set(lerp(a.cam[0], b.cam[0], t) + sway, lerp(a.cam[1], b.cam[1], t), lerp(a.cam[2], b.cam[2], t));
    // on phones the frame is narrow, so back the camera off along its line of sight
    if (narrow) camera.position.sub(look.current).multiplyScalar(1.5).add(look.current);
    camera.lookAt(look.current);

    // sky: update CSS gradient and fog together
    tmpA.set(a.sky[0]).lerp(tmpB.set(b.sky[0]), t);
    const top = '#' + tmpA.getHexString();
    tmpA.set(a.sky[1]).lerp(tmpB.set(b.sky[1]), t);
    const horizon = '#' + tmpA.getHexString();
    const root = document.documentElement.style;
    root.setProperty('--sky-top', top);
    root.setProperty('--sky-horizon', horizon);
    (scene.fog as THREE.Fog).color.set(horizon);
  });

  return null;
};
