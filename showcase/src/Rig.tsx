import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { STATIONS } from './stations';
import { world } from './store';

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

  const shown = useRef(0);
  const opacity = useRef(1);

  const apply = (i: number) => {
    const st = STATIONS[i];
    const narrow = size.width / size.height < 0.9;
    look.current.set(...st.look);
    camera.position.set(...st.cam);
    // on phones the frame is narrow, so back the camera off along its line of sight
    if (narrow) camera.position.sub(look.current).multiplyScalar(1.5).add(look.current);
    camera.lookAt(look.current);
    document.documentElement.style.setProperty('--sky-top', st.sky[0]);
    document.documentElement.style.setProperty('--sky-horizon', st.sky[1]);
    if (scene.fog) (scene.fog as THREE.Fog).color.set(st.sky[1]);
  };

  useEffect(() => {
    apply(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, dt) => {
    const steps = document.querySelectorAll<HTMLElement>('[data-step]');
    const mid = window.scrollY + window.innerHeight / 2;
    let wanted = 0;
    steps.forEach((el, k) => {
      if (mid >= el.offsetTop) wanted = k;
    });
    wanted = Math.min(wanted, STATIONS.length - 1);

    if (!dragging.current) world.drag += (0 - world.drag) * (1 - Math.exp(-2.2 * dt));

    // Cut, don't fly: fade out, jump to the next station, fade in.
    if (wanted !== shown.current) {
      opacity.current = Math.max(0, opacity.current - dt / 0.22);
      if (opacity.current === 0) {
        shown.current = wanted;
        apply(wanted);
      }
    } else {
      opacity.current = Math.min(1, opacity.current + dt / 0.3);
    }
    world.f = shown.current;
    const stage = document.querySelector<HTMLElement>('.stage');
    if (stage) stage.style.opacity = String(opacity.current);
  });

  return null;
};
