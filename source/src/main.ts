import './style.css';
import { projects, technologies, skillGroups, certifications, type Category } from './data';
import { createOrbit } from './orbit';
import { createBackground } from './background';
import { createShip } from './ship';
import { initInteractions } from './interactions';
import { initChat } from './chat';

const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.5"/></svg>';
const app = document.querySelector<HTMLDivElement>('#app')!;

function visualization(id: string): string {
  if (id === 'map') return `<div class="product-art map-art" aria-hidden="true"><div class="art-grid"></div><span class="art-caption">COMMUNICATION, CONNECTED</span><div class="phone phone-back"><div class="phone-notch"></div><div class="phone-greeting">Good morning, Sai.</div><div class="phone-caption">Your day, at a glance</div><div class="mini-stat"><span>Messages</span><strong>12 <small>new</small></strong></div><div class="mini-stat"><span>On-call status</span><strong class="mini-active">● Available</strong></div><div class="phone-row">Your team <span>↗</span></div></div><div class="phone phone-front"><div class="phone-notch"></div><div class="phone-logo">m<span>ap</span><i>●</i></div><div class="phone-caption">Always a connection away.</div><div class="waveform">${Array.from({ length: 23 }, (_, i) => `<i style="--h:${14 + ((i * 17) % 45)}px"></i>`).join('')}</div><div class="call-label">Keeping you connected</div><div class="call-button">↗</div><div class="phone-nav">⌂ <span>▤</span> ◉</div></div><span class="art-mark">MAP / MOBILE</span></div>`;
  if (id === 'fleet') return `<div class="product-art fleet-art" aria-hidden="true"><div class="map-roads"></div><svg class="map-route" viewBox="0 0 600 330"><path d="M80 250 170 250 170 160 285 160 285 90 430 90 430 170 505 170" fill="none" stroke="#c6fba9" stroke-width="4" stroke-dasharray="8 5"/><circle cx="285" cy="160" r="15" fill="#c6fba9" fill-opacity=".15"/><circle cx="285" cy="160" r="5" fill="#c6fba9"/><circle cx="430" cy="90" r="6" fill="#c6fba9"/></svg><span class="art-caption">A CLEARER VIEW OF WHAT MOVES</span><div class="fleet-panel"><span class="live-dot"></span> Live fleet view <b>↗</b><div><small>CONNECTED SYSTEMS</small><strong>Clarity in motion.</strong></div><p><i></i> Tracking & incident response</p></div><span class="map-coordinate">36°50′ N &nbsp; 76°17′ W</span><span class="art-mark">STARCHASE / PLATFORM</span></div>`;
  if (id === 'health') return `<div class="product-art health-art" aria-hidden="true"><span class="art-caption">SMALL SIGNALS. MEANINGFUL INSIGHT.</span><div class="health-orb"></div><svg class="pulse-line" viewBox="0 0 600 250"><path d="M0 140H150l20-20 20 40 25-95 25 135 20-60h50l20-15 20 30 20-50 20 65 20-30h160" fill="none" stroke="#b6b4ef" stroke-width="2"/></svg><div class="sensor-tag">HEART RATE <span>♥</span></div><div class="sensor-tag sensor-two">MOVEMENT <span>↗</span></div><span class="art-mark">ODU / RESEARCH</span></div>`;
  if (id === 'portal') return `<div class="product-art portal-art" aria-hidden="true"><div class="art-grid"></div><span class="art-caption">SELF-SERVICE, SIMPLIFIED</span><div class="browser"><div class="browser-bar"><i></i><i></i><i></i><span>map · customer portal</span></div><div class="browser-body"><div class="portal-nav"><b>map<i>●</i></b><span>Billing</span><span class="on">Statements</span><span>Messages</span><span>Contacts</span></div><div class="portal-main"><div class="portal-head"><div><small>ACCOUNT OVERVIEW</small><strong>Everything, in one place.</strong></div><span class="portal-chip">React + Spring Boot</span></div><div class="portal-cards"><div><small>BALANCE</small><b>$1,240</b></div><div><small>CALLS</small><b>3,812</b></div><div><small>MESSAGES</small><b>127</b></div></div><div class="portal-chart">${Array.from({ length: 12 }, (_, i) => `<i style="--h:${18 + ((i * 23) % 52)}px"></i>`).join('')}</div></div></div></div><span class="art-mark">MAP / WEB PLATFORM</span></div>`;
  if (id === 'flutter') return `<div class="product-art flutter-art" aria-hidden="true"><div class="art-grid"></div><span class="art-caption">5 FLUTTER APPS · 2 WATCHOS COMPANIONS</span><div class="app-shelf">${Array.from({ length: 5 }, (_, i) => `<div class="app-tile" style="--d:${i}"><span class="app-icon">◆</span><i class="app-bar"></i><i class="app-bar short"></i><span class="app-status">iOS · Android</span></div>`).join('')}<div class="watch-pair">${Array.from({ length: 2 }, () => '<div class="app-watch"><i class="watch-band"></i><span class="watch-face">⌚</span><i class="watch-band bottom"></i></div>').join('')}<span class="watch-label">watchOS</span></div></div><div class="pipeline"><span>BUILD</span><i></i><span>TEST</span><i></i><span>SIGN</span><i></i><span>RELEASE</span></div><span class="art-mark">MAP / FLUTTER + WATCHOS</span></div>`;
  return `<div class="product-art chat-art" aria-hidden="true"><span class="art-caption">BETTER CARE BEGINS WITH CONNECTION</span><div class="chat-window"><div class="chat-sidebar"><b>ibhert.</b><span># care-team</span><span># research</span><span># community</span></div><div class="chat-content"><b># care-team <i>●</i></b><div class="chat-bubble"><span>CARE, WITHOUT BOUNDARIES</span><p>A shared space.<br>A stronger connection.</p></div><div class="chat-lines"><i></i><i></i></div><div class="chat-input">Bring the team together <span>↗</span></div></div></div><span class="art-mark">IBHERT / COLLABORATION</span></div>`;
}

app.innerHTML = `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="header"><a class="wordmark" href="#" aria-label="Sai Swaroop, home">sai<span>swaroop</span><i>.</i></a><nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#experience">Journey</a></nav><a class="nav-contact" href="#contact">Let's talk ${arrow}</a></header>
  <main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy"><div class="eyebrow"><span class="live-dot"></span> STAFF-LEVEL MOBILE ENGINEER · BUILDER</div><h1 id="hero-title">A little curiosity.<br>A lot of <span class="serif">possibility.</span></h1><p class="hero-description">I'm Sai Swaroop. With 7+ years building across iOS, Android, and React Native, I turn complex problems into thoughtful mobile experiences — from the palm of your hand to the cloud.</p><div class="hero-actions"><a class="button button-primary" href="#work">Explore my work <span>↘</span></a><a class="text-link" href="/Alluri-Sai-Swaroop-Resume.pdf" download>Download résumé <span>↓</span></a></div><div class="hero-footnote"><span class="small-cross">✳</span><span>Herndon, Virginia · Built at the intersection of<br><strong>code, craft & human connection.</strong></span></div></div>
      <div class="hero-scene"><div class="scene-top"><span>THE CREATIVE SYSTEM</span><span>01 / INTERACTIVE</span></div><div id="orbit" role="img" aria-label="Interactive 3D technology orbit. Drag to rotate; use the buttons below to explore technologies."></div><div class="orbit-label"><span class="live-dot"></span> <span id="orbit-name">React Native</span><small id="orbit-group">Mobile</small></div><div class="scene-bottom"><span>↔ DRAG TO EXPLORE</span><button id="motion-toggle" type="button" aria-pressed="false">Pause motion <span>Ⅱ</span></button></div></div>
      <div class="hero-bottom"><span>SCROLL TO DISCOVER <i>↓</i></span><span>IDEAS INTO INTERFACES. ALWAYS.</span></div>
    </section>
    <div class="tech-strip"><span>A TOOLKIT, NOT A LIMIT.</span><div class="tech-list">${technologies.map((tech, i) => `<button type="button" class="tech-button ${i === 0 ? 'selected' : ''}" data-tech="${i}" aria-pressed="${i === 0}">${tech.name}<i>✳</i></button>`).join('')}</div></div>
    <section class="work-section section" id="work"><div class="section-kicker"><span>01 / SELECTED WORK</span><span>REAL PROBLEMS. THOUGHTFUL SOLUTIONS.</span></div>    <div class="section-heading"><h2>Built for the<br><span class="serif">real world.</span></h2><p>Chapters from my work in mobile,<br>full-stack engineering, and research.</p></div><div class="filters" role="group" aria-label="Filter projects">${(['All work', 'Mobile', 'Full stack', 'Research'] satisfies Category[]).map((name, i) => `<button type="button" class="filter ${i === 0 ? 'active' : ''}" data-filter="${name}" aria-pressed="${i === 0}">${name}${i === 0 ? `<span>${String(projects.length).padStart(2, '0')}</span>` : ''}</button>`).join('')}</div><div class="project-grid" id="project-grid"></div><p class="work-note">Visual studies inspired by the work; not production screenshots.</p></section>
    <section class="about-section section" id="about"><div class="section-kicker"><span>02 / THE HUMAN BEHIND THE CODE</span><span>A CURIOUS MIND. A BUILDER'S HEART.</span></div><div class="about-grid"><div class="about-art"><div class="about-orbits"><i></i><i></i><i></i></div><span class="about-monogram">sa<span>.</span></span><span class="about-art-label">MORE THAN A STACK OF SKILLS.</span><div class="award-badge"><span>✳</span><div>1st place<small>Dominion Enterprises · Hackathon 2019</small></div></div></div><div class="about-copy"><h2>Good software.<br><span class="serif">Human first.</span></h2><p>I’m a staff-level mobile engineer with 7+ years of experience and a master’s in Computer Science from Old Dominion University. Native Android and iOS were my starting point; today I bring that foundation to React Native, cross-platform architecture, and full-stack systems.</p><p>I work closely with product and design teams, own features from concept to release, and care about what happens after launch — performance, stability, and long-term maintainability. From enterprise communications to wearable-assisted healthcare research, I build with people in mind.</p><div class="about-facts"><div><span>01</span><strong>Architecture to App Store</strong><p>Five Flutter apps and two watchOS companions, owned end to end.</p></div><div><span>02</span><strong>Curiosity with purpose</strong><p>First-place AR & Google Maps work for the Homes.com hackathon.</p></div></div><a class="text-link" href="https://github.com/saiswaroopalluri" target="_blank" rel="noopener noreferrer">A look inside my GitHub ${arrow}</a></div></div>
      <div class="skills-heading"><h3>The tools behind the craft.</h3><span>MOBILE FIRST. FULL-STACK FLUENT.</span></div>
      <div class="skills-grid">${skillGroups.map(group => `<div class="skill-group"><h4>${group.title}</h4><div class="tags">${group.skills.map(skill => `<span>${skill}</span>`).join('')}</div></div>`).join('')}</div>
      <div class="skills-heading"><h3>Curiosity, with credentials.</h3><span>CONTINUING THE CRAFT.</span></div>
      <div class="certifications-grid">${certifications.map(certification => `<article class="certification-card ${certification.credential ? 'certification-featured' : ''}"><div class="certification-top"><span class="certification-icon" aria-hidden="true">✳</span><span>${certification.issuer}</span></div><h4>${certification.name}</h4>${certification.issued ? `<p class="certification-date">Issued ${certification.issued}</p>` : ''}${certification.expires ? `<p class="certification-date">Expires ${certification.expires}</p>` : ''}<p class="certification-description">${certification.description}</p><div class="tags">${certification.skills.map(skill => `<span>${skill}</span>`).join('')}</div><div class="certification-footer">${certification.credential ? `<a class="text-link" href="${certification.credential.url}" target="_blank" rel="noopener noreferrer" aria-label="Verify ${certification.name} on ${certification.credential.platform}">Verify on ${certification.credential.platform} ${arrow}</a>` : '<span>Listed in my résumé</span>'}</div></article>`).join('')}</div>
      <div class="resume-resources"><div><span class="resource-label">LEARNING THAT SHOWS UP IN THE WORK</span><p>Mobile foundations. Full-stack thinking. Practical AI.</p></div><div><span class="resource-label">TAKE THE STORY WITH YOU</span><a class="text-link" href="/Alluri-Sai-Swaroop-Resume.pdf" download>General résumé <span>↓</span></a><a class="text-link" href="/Alluri-Sai-Swaroop-React-Native.pdf" download>React Native résumé <span>↓</span></a></div></div>
    </section>
    <section class="experience-section section" id="experience"><div class="section-kicker"><span>03 / THE JOURNEY</span><span>EVERY CHAPTER BUILDS ON THE LAST.</span></div><div class="journey-layout"><div><h2>Experience,<br><span class="serif">in motion.</span></h2><p class="journey-intro">From university research to products<br>that people depend on every day.</p><div class="education"><span>THE FOUNDATION</span><strong>M.S. Computer Science</strong><p>Old Dominion University · Aug 2019</p><strong>Bachelor’s in Electronics & Communication Engineering</strong><p>Lovely Professional University · May 2017</p></div></div><div class="timeline">
      <article class="timeline-item"><span class="timeline-date">MAR 2021 — PRESENT</span><h3>Senior Application Developer</h3><span class="timeline-company">MAP Communications</span><p>Connecting customer portals, mobile applications, and backend services. Building the React and Spring Boot customer portal, and owning five Flutter applications shipped to Android and iOS plus two watchOS companion apps — through architecture, development, store releases, and maintenance.</p><span class="timeline-current">CURRENT ROLE</span></article>
      <article class="timeline-item"><span class="timeline-date">MAY 2019 — MAR 2021</span><h3>Full Stack Application Developer</h3><span class="timeline-company">StarChase LLC</span><p>Real-time fleet tracking and incident response across web, Android, and iOS. Building event-driven systems, integrating REST and SOAP services, and leading stable mobile deployments.</p></article>
      <article class="timeline-item"><span class="timeline-date">DEC 2017 — AUG 2019</span><h3>Mobile Developer · Research Assistant</h3><span class="timeline-company">Old Dominion University</span><p>Sensor-driven iOS and Android research applications for dementia agitation detection. Connecting wearable data, machine-learning pipelines, and Spring Boot microservices for clinicians and researchers.</p></article>
      <article class="timeline-item"><span class="timeline-date">MAR 2017 — AUG 2019</span><h3>Full Stack Developer · Research Assistant</h3><span class="timeline-company">Old Dominion University · IBHERT</span><p>A concurrent research role building real-time messaging for rural healthcare collaboration, with authentication, authorization, 2FA, activity analytics, and Java microservices.</p></article>
    </div></div></section>
    <section class="contact-section section" id="contact"><div class="section-kicker"><span>04 / WHAT'S NEXT?</span><span>THE BEST THINGS START WITH A CONVERSATION.</span></div><div class="contact-main"><h2>Have something<br>in <span class="serif">mind?</span><span class="contact-star">✳</span></h2><div><p>A challenging idea, an interesting opportunity,<br>or just a hello. My inbox is open.</p><a class="button button-primary" href="mailto:saiswaroop.alluri@gmail.com">Let's build something ${arrow}</a></div></div><div class="contact-bottom"><a href="mailto:saiswaroop.alluri@gmail.com">saiswaroop.alluri@gmail.com</a><button id="copy-email" type="button" aria-label="Copy email address">Copy email <span>⊕</span></button><div class="socials"><a href="https://www.linkedin.com/in/sai-swaroop-alluri-626a31b2/" target="_blank" rel="noopener noreferrer">LinkedIn ${arrow}</a><a href="https://github.com/saiswaroopalluri" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a></div></div></section>
  </main>
  <footer><a class="wordmark" href="#">sai<span>swaroop</span><i>.</i></a><span>CRAFTED WITH CURIOSITY · ${new Date().getFullYear()}</span><a href="#">Back to top ↑</a></footer>
  <dialog id="project-dialog"><button class="dialog-close" type="button" aria-label="Close project">×</button><div id="dialog-content"></div></dialog>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;

const grid = document.querySelector<HTMLDivElement>('#project-grid')!;
function renderProjects(category: Category) {
  grid.innerHTML = projects.filter(p => category === 'All work' || p.category === category).map(p => `
    <button class="project-card" type="button" data-project="${p.id}" aria-label="Explore ${p.title} ${p.subtitle}">
      ${visualization(p.id)}<div class="project-meta"><span>${p.company}</span><span>${p.number} / ${p.category}</span></div><div class="project-title"><div><h3>${p.title}</h3><p>${p.subtitle}</p></div><span class="project-arrow">${arrow}</span></div><div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
    </button>`).join('');
}
renderProjects('All work');
document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  renderProjects(button.dataset.filter as Category);
}));

const dialog = document.querySelector<HTMLDialogElement>('#project-dialog')!;
function openProject(id: string) {
  const project = projects.find(p => p.id === id);
  if (!project) return false;
  document.querySelector('#dialog-content')!.innerHTML = `<div class="eyebrow">${project.company} · ${project.year}</div><h2 id="dialog-title">${project.title}</h2><p class="dialog-description">${project.description}</p><h3>My contributions</h3><ul>${project.contributions.map(item => `<li>${item}</li>`).join('')}</ul><div class="tags">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div><p class="dialog-note">Professional experience from my résumé. Proprietary source code is not shared.</p>`;
  dialog.setAttribute('aria-labelledby', 'dialog-title');
  dialog.showModal();
  document.body.classList.add('dialog-open');
  return true;
}
grid.addEventListener('click', event => {
  const target = (event.target as Element).closest<HTMLButtonElement>('[data-project]');
  if (target?.dataset.project) openProject(target.dataset.project);
});
dialog.querySelector('button')!.addEventListener('click', () => dialog.close());
dialog.addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); dialog.close(); }
});
dialog.addEventListener('click', event => { if (event.target === dialog) {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
}});
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

function selectTech(index: number) {
  const tech = technologies[index];
  document.querySelector('#orbit-name')!.textContent = tech.name;
  document.querySelector('#orbit-group')!.textContent = tech.group;
  document.querySelector('.orbit-label')!.setAttribute('title', tech.detail);
  document.querySelectorAll('[data-tech]').forEach((button, i) => {
    button.classList.toggle('selected', i === index);
    button.setAttribute('aria-pressed', String(i === index));
  });
}

const orbit = createOrbit(document.querySelector<HTMLDivElement>('#orbit')!, index => { selectTech(index); launchMission(index); }, technologies.length, technologies.map(tech => tech.name));
const background = createBackground();
const ship = createShip();
document.querySelectorAll<HTMLButtonElement>('[data-tech]').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.tech);
  selectTech(index);
  orbit.select(index);
  launchMission(index);
}));
const motionButton = document.querySelector<HTMLButtonElement>('#motion-toggle')!;
motionButton.setAttribute('aria-pressed', String(orbit.paused));
motionButton.innerHTML = orbit.paused ? 'Play motion <span>▷</span>' : 'Pause motion <span>Ⅱ</span>';
background.setPaused(orbit.paused);
ship.setPaused(orbit.paused);
motionButton.addEventListener('click', () => {
  const paused = orbit.toggle();
  background.setPaused(paused);
  ship.setPaused(paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.innerHTML = paused ? 'Play motion <span>▷</span>' : 'Pause motion <span>Ⅱ</span>';
});

let toastTimer: ReturnType<typeof setTimeout> | undefined;
function announce(message: string) {
  const toast = document.querySelector<HTMLDivElement>('#toast')!;
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 4000);
}

document.querySelector<HTMLButtonElement>('#copy-email')!.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('saiswaroop.alluri@gmail.com');
    announce('Email copied. Say hello!');
  } catch (error) {
    console.error('Could not copy email:', error);
    announce('Could not copy. Email: saiswaroop.alluri@gmail.com');
  }
});

initInteractions({ warp: () => { background.warp(); ship.warp(); } }, announce);
initChat();

const mission = document.createElement('div');
mission.className = 'mission';
mission.hidden = true;
mission.innerHTML = `<div class="mission-sky"></div><section class="mission-panel" role="dialog" aria-modal="true" aria-labelledby="mission-title" tabindex="-1">
  <div class="mission-status"><span class="live-dot"></span> <b id="mission-status-text">APPROACHING</b></div>
  <div class="mission-body" id="mission-body"></div>
  <button type="button" class="mission-close" id="mission-close">Return to flight <span>↖</span></button>
</section>`;
document.body.append(mission);
const missionBody = mission.querySelector<HTMLDivElement>('#mission-body')!;
const missionStatus = mission.querySelector<HTMLElement>('#mission-status-text')!;
const missionPanel = mission.querySelector<HTMLElement>('.mission-panel')!;
let missionActive = false;
let missionOrigin: HTMLElement | null = null;

function launchMission(index: number) {
  if (missionActive) return;
  const tech = technologies[index];
  missionActive = true;
  missionOrigin = document.activeElement as HTMLElement;
  mission.hidden = false;
  mission.classList.add('arriving');
  mission.classList.remove('landed');
  missionStatus.textContent = `APPROACHING ${tech.name.toUpperCase()}`;
  missionBody.innerHTML = '';
  document.body.classList.add('mission-open');
  ship.travelTo(tech.name, orbit.nodeScreenPosition(index), index === 2 || index === 3, () => {
    missionStatus.textContent = `LANDED · ${tech.since}`;
    mission.classList.remove('arriving');
    mission.classList.add('landed');
    missionBody.innerHTML = `<span class="mission-kicker">${tech.group}</span><h2 id="mission-title">${tech.name}</h2><p class="mission-lead">${tech.detail}</p><ul>${tech.highlights.map(item => `<li>${item}</li>`).join('')}</ul><div class="mission-projects"><span>SEEN IN</span>${tech.projects.map(id => {
      const project = projects.find(p => p.id === id);
      return project ? `<button type="button" data-mission-project="${project.id}">${project.title}</button>` : '';
    }).join('')}</div>`;
    missionPanel.focus();
  });
}

function endMission() {
  if (!missionActive) return;
  missionActive = false;
  mission.classList.remove('landed');
  mission.classList.add('leaving');
  ship.returnToFlight(() => {
    mission.hidden = true;
    mission.classList.remove('leaving', 'arriving');
    document.body.classList.remove('mission-open');
    missionOrigin?.focus();
  });
}

mission.querySelector('#mission-close')!.addEventListener('click', endMission);
mission.querySelector('.mission-sky')!.addEventListener('click', endMission);
missionBody.addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLButtonElement>('[data-mission-project]');
  if (!button) return;
  const id = button.dataset.missionProject!;
  endMission();
  setTimeout(() => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
    openProject(id);
  }, 420);
});
addEventListener('keydown', event => {
  if (event.key === 'Escape' && missionActive) endMission();
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
}), { threshold: 0.08 });
document.querySelectorAll('.section').forEach(section => { section.classList.add('reveal'); observer.observe(section); });
