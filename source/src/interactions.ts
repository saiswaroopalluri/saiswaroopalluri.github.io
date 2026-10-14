interface MotionScene {
  warp?: () => void;
}

const fine = matchMedia('(pointer: fine)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

function tiltGroup(root: Element | null, strength: number) {
  if (!root || !fine.matches || reduced.matches) return;
  root.addEventListener('pointermove', event => {
    const pointer = event as PointerEvent;
    const card = (pointer.target as Element).closest<HTMLElement>('.project-card, .certification-card');
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    const x = (pointer.clientX - bounds.left) / bounds.width;
    const y = (pointer.clientY - bounds.top) / bounds.height;
    card.style.setProperty('--ry', `${(x - 0.5) * strength}deg`);
    card.style.setProperty('--rx', `${(0.5 - y) * strength}deg`);
    card.style.setProperty('--gx', `${x * 100}%`);
    card.style.setProperty('--gy', `${y * 100}%`);
    card.classList.add('tilting');
    const surface = card.querySelector<HTMLElement>('.product-art') ?? card;
    if (!surface.querySelector('.card-glare')) {
      const glare = document.createElement('i');
      glare.className = 'card-glare';
      surface.append(glare);
    }
  });
  root.addEventListener('pointerleave', () => {
    root.querySelectorAll<HTMLElement>('.tilting').forEach(card => {
      card.classList.remove('tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

function scrollRail() {
  const sections = [
    { id: 'main', label: 'Intro' },
    { id: 'work', label: 'Work' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Journey' },
    { id: 'contact', label: 'Contact' },
  ].filter(section => document.getElementById(section.id));
  const rail = document.createElement('nav');
  rail.className = 'scroll-rail';
  rail.setAttribute('aria-label', 'Section progress');
  rail.innerHTML = `<span class="rail-track"><i class="rail-fill"></i></span>${sections
    .map(section => `<button type="button" data-rail="${section.id}"><span>${section.label}</span></button>`)
    .join('')}`;
  document.body.append(rail);
  const fill = rail.querySelector<HTMLElement>('.rail-fill')!;
  const buttons = [...rail.querySelectorAll<HTMLButtonElement>('[data-rail]')];
  buttons.forEach(button => button.addEventListener('click', () => {
    document.getElementById(button.dataset.rail!)?.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth' });
  }));
  let ticking = false;
  function update() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    fill.style.transform = `scaleY(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    const marker = scrollY + innerHeight * 0.35;
    let active = 0;
    sections.forEach((section, index) => {
      const element = document.getElementById(section.id)!;
      if (element.getBoundingClientRect().top + scrollY <= marker) active = index;
    });
    buttons.forEach((button, index) => button.classList.toggle('active', index === active));
  }
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  addEventListener('resize', update);
  update();
}

function cursor() {
  if (!fine.matches || reduced.matches) return;
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(ring);
  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let ringX = x;
  let ringY = y;
  addEventListener('pointermove', event => {
    x = event.clientX;
    y = event.clientY;
    const interactive = (event.target as Element).closest('a, button, [data-project], #orbit');
    ring.classList.toggle('active', !!interactive);
  }, { passive: true });
  (function loop() {
    ringX += (x - ringX) * 0.18;
    ringY += (y - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
}

function easterEgg(scene: MotionScene, announce: (message: string) => void) {
  const target = 'sai';
  let buffer = '';
  addEventListener('keydown', event => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const active = document.activeElement;
    if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;
    if (event.key.length !== 1) return;
    buffer = (buffer + event.key.toLowerCase()).slice(-target.length);
    if (buffer !== target) return;
    buffer = '';
    scene.warp?.();
    document.body.classList.add('warping');
    setTimeout(() => document.body.classList.remove('warping'), 1600);
    announce('Hyperdrive engaged. Thanks for exploring ✳');
  });
}

export function initInteractions(scene: MotionScene, announce: (message: string) => void) {
  tiltGroup(document.querySelector('#project-grid'), 7);
  tiltGroup(document.querySelector('.certifications-grid'), 5);
  scrollRail();
  cursor();
  easterEgg(scene, announce);
}
