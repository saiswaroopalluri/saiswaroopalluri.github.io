import * as THREE from 'three';
import { createIconTexture } from './icons';

export function createOrbit(container: HTMLElement, onSelect: (index: number) => void, nodeCount = 6, names: string[] = []) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (error) {
    console.error('3D renderer unavailable:', error);
    container.innerHTML = '<div class="orbit-fallback"><span>✳</span><p>3D is unavailable in this browser.<br>Explore the toolkit using the buttons below.</p></div>';
    return { paused: true, toggle: () => true, select: (_index: number) => {}, nodeScreenPosition: (_index: number) => null };
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  container.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 8.8);
  const world = new THREE.Group();
  world.rotation.set(0.22, 0.15, -0.18);
  scene.add(world);
  scene.add(new THREE.AmbientLight(0xd4f5da, 2));
  const light = new THREE.PointLight(0xc7ffa6, 35);
  light.position.set(-3, 4, 4);
  scene.add(light);
  const rim = new THREE.PointLight(0x648db0, 25);
  rim.position.set(3, -2, 2);
  scene.add(rim);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.38, 2), new THREE.MeshPhysicalMaterial({
    color: 0x2d493a, metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.92,
    clearcoat: 1, flatShading: true,
  }));
  world.add(core);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(core.geometry), new THREE.LineBasicMaterial({
    color: 0xbef7a1, transparent: true, opacity: 0.22,
  }));
  core.add(wire);
  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(1.47, 1), new THREE.MeshBasicMaterial({
    color: 0xbef7a1, wireframe: true, transparent: true, opacity: 0.08,
  }));
  world.add(inner);
  const ringGroups: THREE.Group[] = [];
  const nodes: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>[] = [];
  for (let i = 0; i < Math.ceil(nodeCount / 2); i++) {
    const ringGroup = new THREE.Group();
    ringGroup.rotation.set(i * 0.7 + 0.45, i * 0.85, i * 0.5);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.1 + i * 0.23, 0.006, 5, 160),
      new THREE.MeshBasicMaterial({ color: 0x8cb598, transparent: true, opacity: 0.4 }));
    ringGroup.add(ring);
    world.add(ringGroup);
    ringGroups.push(ringGroup);
    for (let j = 0; j < 2; j++) {
      const index = i * 2 + j;
      if (index >= nodeCount) break;
      const accent = i === 1;
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.27 + i * 0.012, 36, 36),
        new THREE.MeshStandardMaterial({
          map: createIconTexture(names[index] ?? '', accent ? '#cbc9f7' : '#cdf9b4', accent ? '#272449' : '#1b3215'),
          emissive: accent ? 0x3b3a6b : 0x315529, emissiveIntensity: 0.3, roughness: 0.42, metalness: 0.12,
        }));
      node.userData.index = index;
      const angle = j * Math.PI + i * 0.9;
      node.position.set(Math.cos(angle) * (2.1 + i * 0.23), Math.sin(angle) * (2.1 + i * 0.23), 0);
      ringGroup.add(node);
      nodes.push(node);
    }
  }
  const starsPositions = new Float32Array(120 * 3);
  for (let i = 0; i < starsPositions.length; i++) starsPositions[i] = (Math.random() - 0.5) * 12;
  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
  scene.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0x9caf9e, size: 0.017, transparent: true, opacity: 0.5 })));
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let dragging = false;
  let moved = false;
  let lastX = 0;
  let lastY = 0;
  container.addEventListener('pointerdown', event => {
    dragging = true; moved = false; lastX = event.clientX; lastY = event.clientY;
    container.setPointerCapture(event.pointerId);
  });
  container.addEventListener('pointermove', event => {
    if (!dragging) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
    world.rotation.y += dx * 0.006;
    world.rotation.x += dy * 0.006;
    lastX = event.clientX; lastY = event.clientY;
    render();
  });
  container.addEventListener('pointerup', event => {
    dragging = false;
    if (moved) return;
    const bounds = container.getBoundingClientRect();
    pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(nodes)[0];
    if (hit) { const index = Number(hit.object.userData.index); select(index); onSelect(index); }
  });
  container.addEventListener('pointercancel', () => { dragging = false; });
  function select(index: number) {
    nodes.forEach((node, i) => {
      node.scale.setScalar(i === index ? 1.4 : 1);
      node.material.emissiveIntensity = i === index ? 1 : 0.3;
    });
    render();
  }
  function render() {
    scene.updateMatrixWorld();
    for (const node of nodes) node.lookAt(camera.position);
    renderer.render(scene, camera);
  }
  const resize = new ResizeObserver(() => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    render();
  });
  resize.observe(container);
  let visible = true;
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(container);
  let lastTime = 0;
  renderer.setAnimationLoop(time => {
    const delta = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    if (!visible || document.hidden || paused || dragging) return;
    core.rotation.y += delta * 0.12;
    world.rotation.y += delta * 0.065;
    ringGroups.forEach((ring, i) => { ring.rotation.z += delta * 0.08 * (i % 2 ? -1 : 1); });
    render();
  });
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    paused = true;
    const button = document.querySelector('#motion-toggle');
    button?.setAttribute('aria-pressed', 'true');
    if (button) button.innerHTML = 'Play motion <span>▷</span>';
  });
  select(0);
  return {
    get paused() { return paused; },
    toggle: () => { paused = !paused; render(); return paused; },
    select,
    nodeScreenPosition(index: number) {
      const node = nodes[index];
      if (!node) return null;
      scene.updateMatrixWorld();
      const projected = node.getWorldPosition(new THREE.Vector3()).project(camera);
      const rect = container.getBoundingClientRect();
      return {
        x: rect.left + (projected.x * 0.5 + 0.5) * rect.width,
        y: rect.top + (-projected.y * 0.5 + 0.5) * rect.height,
      };
    },
  };
}
