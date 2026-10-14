import * as THREE from 'three';

const DEPTH = 86;

export function createBackground() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const container = document.createElement('div');
  container.id = 'bg-scene';
  container.setAttribute('aria-hidden', 'true');
  document.body.prepend(container);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
  } catch (error) {
    console.error('Background scene unavailable:', error);
    container.remove();
    return { setPaused: (_paused: boolean) => {}, warp: () => {} };
  }

  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.setSize(innerWidth, innerHeight);
  container.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0e11, 0.031);
  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 160);
  camera.position.set(0, 0, 8);

  const corridor = new THREE.Group();
  scene.add(corridor);

  const starCount = innerWidth < 760 ? 900 : 1700;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const mint = new THREE.Color(0xa9e88c);
  const lavender = new THREE.Color(0x9f9ddd);
  const pale = new THREE.Color(0x8fa394);
  for (let i = 0; i < starCount; i++) {
    const radius = 5 + Math.random() * 15;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius * 0.72;
    positions[i * 3 + 2] = 8 - Math.random() * (DEPTH + 20);
    const tint = Math.random();
    const color = tint > 0.82 ? mint : tint > 0.7 ? lavender : pale;
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  corridor.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({
    size: 0.085, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.72, depthWrite: false,
  })));

  const markers: THREE.Object3D[] = [];
  const geometries = [
    new THREE.IcosahedronGeometry(1.5, 0),
    new THREE.TorusGeometry(1.5, 0.04, 6, 48),
    new THREE.OctahedronGeometry(1.4, 0),
    new THREE.TorusKnotGeometry(1.05, 0.05, 72, 6),
  ];
  for (let i = 0; i < 9; i++) {
    const geometry = geometries[i % geometries.length];
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      color: i % 3 === 1 ? 0x9f9ddd : 0xa9e88c,
      wireframe: true, transparent: true, opacity: 0.16, depthWrite: false,
    }));
    const side = i % 2 ? 1 : -1;
    mesh.position.set(side * (4.2 + Math.random() * 3.4), (Math.random() - 0.5) * 7, 2 - i * (DEPTH / 9));
    mesh.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    mesh.userData.spin = (0.05 + Math.random() * 0.12) * (i % 2 ? 1 : -1);
    corridor.add(mesh);
    markers.push(mesh);
  }

  const gridMaterial = new THREE.LineBasicMaterial({ color: 0x4f6b55, transparent: true, opacity: 0.12 });
  for (let i = 0; i < 7; i++) {
    const ring = new THREE.LineLoop(new THREE.RingGeometry(9, 9.02, 48), gridMaterial);
    ring.position.z = -4 - i * (DEPTH / 7);
    corridor.add(ring);
  }

  let scrollProgress = 0;
  let currentZ = 8;
  let currentRoll = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;
  let paused = reducedMotion.matches;
  let visible = true;
  let warp = 0;

  function readScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    scrollProgress = max > 0 ? Math.min(Math.max(scrollY / max, 0), 1) : 0;
  }

  function render() {
    renderer.render(scene, camera);
  }

  addEventListener('scroll', readScroll, { passive: true });
  addEventListener('pointermove', event => {
    targetPointerX = (event.clientX / innerWidth - 0.5) * 2;
    targetPointerY = (event.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    readScroll();
    render();
  });
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  readScroll();
  currentZ = 8 - scrollProgress * DEPTH;
  camera.position.z = currentZ;
  render();

  renderer.setAnimationLoop(() => {
    if (!visible || paused) return;
    const targetZ = 8 - scrollProgress * DEPTH;
    const delta = targetZ - currentZ;
    currentZ += delta * 0.055;
    currentRoll += (delta * 0.0055 - currentRoll) * 0.06;
    pointerX += (targetPointerX - pointerX) * 0.04;
    pointerY += (targetPointerY - pointerY) * 0.04;
    if (warp > 0.002) {
      warp *= 0.955;
      corridor.rotation.z += warp * 0.05;
      currentZ -= warp * 1.4;
    } else {
      warp = 0;
    }
    camera.position.set(pointerX * 1.15, -pointerY * 0.8, currentZ);
    camera.rotation.z = currentRoll;
    camera.lookAt(pointerX * 0.4, -pointerY * 0.3, currentZ - 10);
    camera.rotation.z = currentRoll;
    corridor.rotation.z += 0.00035;
    for (const marker of markers) {
      marker.rotation.x += marker.userData.spin * 0.004;
      marker.rotation.y += marker.userData.spin * 0.006;
    }
    render();
  });

  reducedMotion.addEventListener('change', event => {
    paused = event.matches;
    if (paused) render();
  });

  return {
    setPaused(next: boolean) {
      paused = next || reducedMotion.matches;
      if (paused) render();
    },
    warp() {
      if (reducedMotion.matches) return;
      warp = 1;
    },
  };
}
