import * as THREE from 'three';
import { createIconTexture } from './icons';

function buildShip() {
  const ship = new THREE.Group();

  const hullMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xeef4e6, metalness: 0.85, roughness: 0.22, clearcoat: 0.9, clearcoatRoughness: 0.15,
  });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x1d2a1c, metalness: 0.9, roughness: 0.34 });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0f5a2, emissive: 0xa8ee84, emissiveIntensity: 1.5, metalness: 0.3, roughness: 0.4,
  });
  const canopyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x3b3a72, emissive: 0x6f6cc8, emissiveIntensity: 0.55, metalness: 0.4, roughness: 0.08, clearcoat: 1,
  });

  const profile = [
    [0.001, 0.86], [0.045, 0.74], [0.088, 0.58], [0.128, 0.38], [0.158, 0.16],
    [0.172, -0.06], [0.168, -0.26], [0.152, -0.44], [0.134, -0.58], [0.128, -0.66],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const fuselage = new THREE.Mesh(new THREE.LatheGeometry(profile, 24), hullMaterial);
  fuselage.rotation.x = Math.PI / 2;
  ship.add(fuselage);

  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.11, 0.72), accentMaterial);
  spine.position.set(0, 0.13, -0.16);
  ship.add(spine);

  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2), canopyMaterial);
  canopy.rotation.x = -Math.PI / 2;
  canopy.position.set(0, 0.06, 0.2);
  canopy.scale.set(1, 1.9, 0.78);
  ship.add(canopy);

  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0.2);
  wingShape.lineTo(0.78, -0.3);
  wingShape.lineTo(0.8, -0.44);
  wingShape.lineTo(0.34, -0.46);
  wingShape.lineTo(0.05, -0.28);
  wingShape.lineTo(0, -0.22);
  wingShape.closePath();
  const wingGeometry = new THREE.ExtrudeGeometry(wingShape, {
    depth: 0.035, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.01, bevelSegments: 1,
  });
  wingGeometry.rotateX(Math.PI / 2);

  const navLights: THREE.Mesh[] = [];
  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(wingGeometry, hullMaterial);
    wing.scale.x = side;
    wing.position.set(0, -0.02, 0);
    wing.rotation.z = side * 0.14;
    ship.add(wing);

    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.018, 0.045), accentMaterial);
    edge.position.set(side * 0.42, -0.03, -0.33);
    edge.rotation.y = side * 0.55;
    ship.add(edge);

    const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.3), darkMaterial);
    pylon.position.set(side * 0.26, -0.05, -0.3);
    ship.add(pylon);

    const light = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), new THREE.MeshBasicMaterial({
      color: side < 0 ? 0xff5a6a : 0x7affa0, transparent: true,
    }));
    light.position.set(side * 0.79, -0.02, -0.42);
    ship.add(light);
    navLights.push(light);
  }

  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.26, 0.26), hullMaterial);
  tail.position.set(0, 0.16, -0.5);
  tail.rotation.x = -0.25;
  ship.add(tail);

  const glows: THREE.Mesh[] = [];
  const cores: THREE.Mesh[] = [];
  for (const side of [-0.17, 0.17]) {
    const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.1, 0.46, 14), darkMaterial);
    nacelle.rotation.x = Math.PI / 2;
    nacelle.position.set(side, -0.04, -0.42);
    ship.add(nacelle);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.093, 0.014, 8, 20), accentMaterial);
    ring.position.set(side, -0.04, -0.63);
    ship.add(ring);

    const core = new THREE.Mesh(new THREE.CircleGeometry(0.075, 16), new THREE.MeshBasicMaterial({
      color: 0xf2ffe4, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    core.position.set(side, -0.04, -0.655);
    core.rotation.y = Math.PI;
    ship.add(core);
    cores.push(core);

    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.082, 0.8, 14, 1, true), new THREE.MeshBasicMaterial({
      color: 0xbbffa0, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    }));
    flame.rotation.x = -Math.PI / 2;
    flame.position.set(side, -0.04, -1.06);
    ship.add(flame);
    glows.push(flame);
  }

  const halo = new THREE.Mesh(new THREE.CircleGeometry(0.42, 24), new THREE.MeshBasicMaterial({
    color: 0x8fe06f, transparent: true, opacity: 0.17, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  halo.position.z = -0.72;
  ship.add(halo);

  return { ship, glows, cores, navLights, halo };
}

export function createShip() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const container = document.createElement('div');
  container.id = 'ship-layer';
  container.setAttribute('aria-hidden', 'true');
  document.body.append(container);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (error) {
    console.error('Ship layer unavailable:', error);
    container.remove();
    return {
      setPaused: (_paused: boolean) => {}, warp: () => {},
      travelTo: (_n: string, _o: { x: number; y: number } | null, _a: boolean, arrived: () => void) => arrived(),
      returnToFlight: (done: () => void) => done(),
    };
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 60);
  camera.position.z = 7;

  scene.add(new THREE.HemisphereLight(0xdcf7cf, 0x16201a, 2.4));
  const key = new THREE.DirectionalLight(0xf3ffe8, 3.6);
  key.position.set(3, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9c9af0, 2.6);
  rim.position.set(-5, -2, 1);
  scene.add(rim);
  const engineLight = new THREE.PointLight(0xa9f08a, 6, 4.5);
  scene.add(engineLight);

  const { ship, glows, cores, navLights, halo } = buildShip();
  ship.scale.setScalar(0.34);
  scene.add(ship);

  const PLANET_RADIUS = 1.05;
  const planetGroup = new THREE.Group();
  planetGroup.visible = false;
  const planet = new THREE.Mesh(new THREE.SphereGeometry(PLANET_RADIUS, 48, 36), new THREE.MeshStandardMaterial({
    roughness: 0.55, metalness: 0.15, color: 0xffffff,
  }));
  planetGroup.add(planet);
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(PLANET_RADIUS * 1.11, 32, 24), new THREE.MeshBasicMaterial({
    color: 0xb6f29a, transparent: true, opacity: 0.12, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  planetGroup.add(atmosphere);
  const planetRing = new THREE.Mesh(new THREE.RingGeometry(PLANET_RADIUS * 1.35, PLANET_RADIUS * 1.42, 72), new THREE.MeshBasicMaterial({
    color: 0xc0f5a2, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false,
  }));
  planetRing.rotation.set(1.15, 0.3, 0.2);
  planetGroup.add(planetRing);
  scene.add(planetGroup);

  const TRAIL = 56;
  const trailPoints = Array.from({ length: TRAIL }, () => new THREE.Vector3());
  const ribbonPositions = new Float32Array(TRAIL * 2 * 3);
  const ribbonColors = new Float32Array(TRAIL * 2 * 3);
  const indices: number[] = [];
  for (let i = 0; i < TRAIL - 1; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  for (let i = 0; i < TRAIL; i++) {
    const fade = (1 - i / TRAIL) ** 1.7;
    for (const v of [0, 1]) {
      ribbonColors[(i * 2 + v) * 3] = 0.66 * fade;
      ribbonColors[(i * 2 + v) * 3 + 1] = 1 * fade;
      ribbonColors[(i * 2 + v) * 3 + 2] = 0.58 * fade;
    }
  }
  const ribbonGeometry = new THREE.BufferGeometry();
  ribbonGeometry.setAttribute('position', new THREE.BufferAttribute(ribbonPositions, 3));
  ribbonGeometry.setAttribute('color', new THREE.BufferAttribute(ribbonColors, 3));
  ribbonGeometry.setIndex(indices);
  scene.add(new THREE.Mesh(ribbonGeometry, new THREE.MeshBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending,
    depthWrite: false, side: THREE.DoubleSide,
  })));
  let trailReady = false;

  const VIEW = new THREE.Vector3(0, 0, 1);
  const direction = new THREE.Vector3();
  const sideways = new THREE.Vector3();
  const point = new THREE.Vector3();
  const ahead = new THREE.Vector3();
  let progress = 0;
  let smoothed = 0;
  let bank = 0;
  let lastX = 0;
  let paused = reducedMotion.matches;
  let visible = true;
  let warp = 0;
  let bounds = { x: 4, y: 2.4 };

  type Mode = 'cruise' | 'approach' | 'landed' | 'depart';
  let mode: Mode = 'cruise';
  let phase = 0;
  let onArrive: (() => void) | null = null;
  let onDeparted: (() => void) | null = null;
  const flightStart = new THREE.Vector3();
  const flightControl = new THREE.Vector3();
  const planetFrom = new THREE.Vector3();
  const planetTo = new THREE.Vector3();
  const touchdown = new THREE.Vector3();
  const surfaceUp = new THREE.Vector3(0.18, 0.86, 0.48).normalize();
  const tangent = new THREE.Vector3();
  const dummy = new THREE.Object3D();
  const landingQuaternion = new THREE.Quaternion();
  const temp = new THREE.Vector3();
  const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

  function screenToWorld(x: number, y: number, target: THREE.Vector3) {
    target.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1, 0.5).unproject(camera);
    target.sub(camera.position).normalize();
    target.multiplyScalar(-camera.position.z / target.z).add(camera.position);
  }

  function landingTarget(target: THREE.Vector3) {
    target.copy(surfaceUp).multiplyScalar(PLANET_RADIUS * planetGroup.scale.x + 0.1 * ship.scale.x * 3).add(planetGroup.position);
  }

  function landingOrientation() {
    tangent.crossVectors(surfaceUp, new THREE.Vector3(0, 0, 1)).normalize();
    if (!Number.isFinite(tangent.x) || tangent.lengthSq() < 1e-6) tangent.set(1, 0, 0);
    dummy.position.copy(touchdown);
    dummy.up.copy(surfaceUp);
    dummy.lookAt(temp.copy(touchdown).add(tangent));
    dummy.updateMatrixWorld();
    landingQuaternion.copy(dummy.quaternion);
  }

  function measure() {
    const height = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    bounds = { x: (height * camera.aspect) / 2, y: height / 2 };
  }

  function path(t: number, target: THREE.Vector3) {
    const angle = t * Math.PI * 4.6;
    target.set(
      Math.sin(angle) * bounds.x * 0.66,
      Math.cos(angle * 0.62 + 0.8) * bounds.y * 0.58,
      Math.sin(angle * 0.5) * 0.7,
    );
  }

  function updateRibbon() {
    for (let i = 0; i < TRAIL; i++) {
      const current = trailPoints[i];
      const next = trailPoints[Math.min(i + 1, TRAIL - 1)];
      direction.subVectors(current, next);
      if (direction.lengthSq() < 1e-6) direction.set(0, 0.001, 0);
      sideways.crossVectors(direction, VIEW).normalize();
      if (!Number.isFinite(sideways.x)) sideways.set(1, 0, 0);
      const width = 0.1 * (1 - i / TRAIL) ** 0.75;
      ribbonPositions[i * 6] = current.x + sideways.x * width;
      ribbonPositions[i * 6 + 1] = current.y + sideways.y * width;
      ribbonPositions[i * 6 + 2] = current.z + sideways.z * width;
      ribbonPositions[i * 6 + 3] = current.x - sideways.x * width;
      ribbonPositions[i * 6 + 4] = current.y - sideways.y * width;
      ribbonPositions[i * 6 + 5] = current.z - sideways.z * width;
    }
    ribbonGeometry.attributes.position.needsUpdate = true;
  }

  function cinematic(dt: number) {
    const time = performance.now();
    if (mode === 'approach' || mode === 'depart') phase = Math.min(phase + dt / (mode === 'approach' ? 2.2 : 1.3), 1);
    const eased = easeInOut(phase);

    if (mode === 'approach') {
      const grow = 0.18 + eased * 0.82;
      planetGroup.scale.setScalar(grow);
      planetGroup.position.lerpVectors(planetFrom, planetTo, eased);
      landingTarget(touchdown);
      const inverse = 1 - eased;
      point.set(
        inverse * inverse * flightStart.x + 2 * inverse * eased * flightControl.x + eased * eased * touchdown.x,
        inverse * inverse * flightStart.y + 2 * inverse * eased * flightControl.y + eased * eased * touchdown.y,
        inverse * inverse * flightStart.z + 2 * inverse * eased * flightControl.z + eased * eased * touchdown.z,
      );
      ship.position.copy(point);
      const next = Math.min(eased + 0.02, 1);
      const ni = 1 - next;
      ahead.set(
        ni * ni * flightStart.x + 2 * ni * next * flightControl.x + next * next * touchdown.x,
        ni * ni * flightStart.y + 2 * ni * next * flightControl.y + next * next * touchdown.y,
        ni * ni * flightStart.z + 2 * ni * next * flightControl.z + next * next * touchdown.z,
      );
      ship.lookAt(ahead);
      landingOrientation();
      if (phase > 0.72) ship.quaternion.slerp(landingQuaternion, (phase - 0.72) / 0.28);
      const retro = phase < 0.6 ? 1 + (1 - phase) * 2.6 : Math.max(0.25, (1 - phase) * 3.4);
      setThrust(retro, time, true);
      if (phase >= 1) { mode = 'landed'; onArrive?.(); onArrive = null; }
    } else if (mode === 'landed') {
      planetGroup.rotation.y += dt * 0.16;
      landingTarget(touchdown);
      ship.position.copy(touchdown);
      ship.position.y += Math.sin(time / 1100) * 0.012;
      ship.quaternion.copy(landingQuaternion);
      setThrust(0.3, time, true);
    } else if (mode === 'depart') {
      planetGroup.scale.setScalar(Math.max(0.001, 1 - eased));
      planetGroup.rotation.y += dt * 0.16;
      landingTarget(touchdown);
      point.copy(touchdown).addScaledVector(surfaceUp, eased * 5).addScaledVector(flightStart.clone().sub(touchdown).normalize(), eased * 3.2);
      ship.position.copy(point);
      ship.quaternion.slerp(landingQuaternion, 0.02);
      ship.rotateX(-eased * 0.9);
      setThrust(1 + (1 - eased) * 3.4, time, true);
      if (phase >= 1) {
        planetGroup.visible = false;
        planetGroup.scale.setScalar(1);
        mode = 'cruise';
        trailReady = false;
        onDeparted?.();
        onDeparted = null;
      }
    }
    pushTrail();
  }

  function setThrust(thrust: number, time: number, animate: boolean) {
    const flicker = animate ? 0.92 + Math.sin(time / 55) * 0.08 : 1;
    for (const flame of glows) {
      flame.scale.set(1, thrust * flicker, 1);
      flame.position.z = -1.06 - (thrust - 1) * 0.36;
      (flame.material as THREE.MeshBasicMaterial).opacity = Math.min(0.5 + thrust * 0.14, 1);
    }
    for (const core of cores) core.scale.setScalar(0.9 + thrust * 0.08 * flicker);
    halo.scale.setScalar(0.85 + thrust * 0.18);
    (halo.material as THREE.MeshBasicMaterial).opacity = Math.min(0.1 + thrust * 0.05, 0.4);
    engineLight.position.copy(ship.position);
    engineLight.intensity = 3 + thrust * 2.4;
    const blink = animate ? (Math.sin(time / 420) > 0 ? 1 : 0.15) : 1;
    (navLights[0].material as THREE.MeshBasicMaterial).opacity = blink;
    (navLights[1].material as THREE.MeshBasicMaterial).opacity = 1.15 - blink;
  }

  function pushTrail() {
    if (!trailReady) {
      for (const trailPoint of trailPoints) trailPoint.copy(ship.position);
      trailReady = true;
    } else {
      for (let i = TRAIL - 1; i > 0; i--) trailPoints[i].copy(trailPoints[i - 1]);
      trailPoints[0].copy(ship.position);
    }
    updateRibbon();
  }

  function readScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress = max > 0 ? Math.min(Math.max(scrollY / max, 0), 1) : 0;
  }

  function place(animate: boolean) {
    const delta = progress - smoothed;
    smoothed += delta * (animate ? 0.075 : 1);
    path(smoothed, point);
    path(Math.min(smoothed + 0.004, 1), ahead);
    const time = performance.now();
    if (animate) {
      point.y += Math.sin(time / 950) * 0.12;
      point.x += Math.cos(time / 1400) * 0.09;
    }
    ship.position.copy(point);
    ship.lookAt(ahead);
    const drift = point.x - lastX;
    lastX = point.x;
    bank += (THREE.MathUtils.clamp(-drift * 2.6, -1, 1) - bank) * 0.08;
    ship.rotateZ(bank);
    engineLight.position.set(point.x, point.y, point.z + 0.4);

    const speed = Math.min(Math.abs(delta) * 70, 4);
    setThrust(1 + speed + warp * 3, time, animate);
    pushTrail();
  }

  function render() { renderer.render(scene, camera); }

  addEventListener('scroll', () => {
    readScroll();
    if (paused) { place(false); render(); }
  }, { passive: true });
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    measure();
    readScroll();
    place(false);
    render();
  });
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  measure();
  readScroll();
  place(false);
  render();

  let last = performance.now();
  renderer.setAnimationLoop(now => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!visible) return;
    if (mode !== 'cruise') { cinematic(dt); render(); return; }
    if (paused) return;
    warp = warp > 0.002 ? warp * 0.94 : 0;
    place(true);
    render();
  });

  reducedMotion.addEventListener('change', event => { paused = event.matches; if (paused) render(); });

  return {
    setPaused(next: boolean) { paused = next || reducedMotion.matches; if (paused && mode === 'cruise') render(); },
    warp() { if (!reducedMotion.matches) warp = 1; },
    travelTo(name: string, origin: { x: number; y: number } | null, accent: boolean, arrived: () => void) {
      planet.material.map?.dispose();
      planet.material.map = createIconTexture(name, accent ? '#cbc9f7' : '#cdf9b4', accent ? '#272449' : '#1b3215');
      planet.material.needsUpdate = true;
      planetGroup.visible = true;
      planetGroup.rotation.set(0.1, 0, 0);
      if (origin) screenToWorld(origin.x, origin.y, planetFrom); else planetFrom.set(0, 0, 0);
      planetTo.set(bounds.x * (innerWidth < 900 ? 0 : 0.42), innerWidth < 900 ? bounds.y * 0.34 : 0.1, 0);
      planetGroup.scale.setScalar(0.18);
      planetGroup.position.copy(planetFrom);
      flightStart.copy(ship.position);
      flightControl.copy(flightStart).lerp(planetTo, 0.5).addScaledVector(surfaceUp, 2.6).setZ(1.4);
      phase = 0;
      mode = 'approach';
      onArrive = arrived;
      if (reducedMotion.matches) {
        phase = 1;
        planetGroup.scale.setScalar(1);
        planetGroup.position.copy(planetTo);
        landingTarget(touchdown);
        landingOrientation();
        ship.position.copy(touchdown);
        ship.quaternion.copy(landingQuaternion);
        mode = 'landed';
        onArrive = null;
        render();
        arrived();
      }
    },
    returnToFlight(done: () => void) {
      if (mode === 'cruise') { done(); return; }
      if (reducedMotion.matches) {
        planetGroup.visible = false;
        planetGroup.scale.setScalar(1);
        mode = 'cruise';
        trailReady = false;
        place(false);
        render();
        done();
        return;
      }
      flightStart.set(bounds.x * 0.9, bounds.y * 0.8, 0);
      phase = 0;
      mode = 'depart';
      onDeparted = done;
    },
  };
}
