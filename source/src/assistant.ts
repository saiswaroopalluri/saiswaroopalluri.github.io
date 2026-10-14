import { projects, technologies, skillGroups, certifications } from './data';

interface Entry {
  label: string;
  keywords: string[];
  answer: string;
  follow?: string[];
}

const STOP = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'you', 'your', 'yours', 'he', 'his', 'him', 'sai', 'swaroop', 'me', 'my', 'i', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'and', 'or', 'what', 'which', 'who', 'how', 'can', 'tell', 'about', 'me', 'please', 'any', 'some', 'have', 'has', 'had', 'be', 'been', 'it', 'that', 'this', 'there', 'their', 'they', 'us', 'we']);

const SYNONYMS: Record<string, string> = {
  job: 'work', jobs: 'work', role: 'work', roles: 'work', career: 'work', employment: 'work',
  exp: 'experience', yrs: 'years', year: 'years', yr: 'years',
  tech: 'technology', techs: 'technology', technologies: 'technology', stack: 'technology', tools: 'technology',
  app: 'application', apps: 'application', applications: 'application',
  mobile: 'mobile', android: 'android', ios: 'ios', iphone: 'ios', apple: 'ios',
  watch: 'watchos', watches: 'watchos', wearable: 'watchos',
  cert: 'certification', certs: 'certification', certificates: 'certification', certificate: 'certification', certifications: 'certification',
  school: 'education', degree: 'education', university: 'education', college: 'education', study: 'education', studied: 'education',
  email: 'contact', reach: 'contact', hire: 'hiring', hiring: 'hiring', available: 'hiring', availability: 'hiring',
  cv: 'resume', résumé: 'resume',
  where: 'location', live: 'location', located: 'location', based: 'location', from: 'location',
  backend: 'backend', frontend: 'frontend', web: 'frontend', fullstack: 'fullstack', 'full-stack': 'fullstack',
  strength: 'strengths', strong: 'strengths', best: 'strengths', good: 'strengths',
  ml: 'machine learning', ai: 'ai', llm: 'ai',
  release: 'release', releases: 'release', deploy: 'release', deployment: 'release', shipping: 'release', ship: 'release',
};

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .map(token => SYNONYMS[token] ?? token)
    .flatMap(token => token.split(' '))
    .map(token => (token.length > 3 && token.endsWith('s') ? token.slice(0, -1) : token))
    .filter(token => token.length > 1 && !STOP.has(token));
}

const projectEntries: Entry[] = projects.map(project => ({
  label: project.title,
  keywords: tokenize(`${project.title} ${project.subtitle} ${project.company} ${project.category} ${project.tags.join(' ')} ${project.description}`),
  answer: `<b>${project.title}</b> — ${project.subtitle}, at ${project.company} (${project.year}).<br>${project.description}<br><br>${project.contributions.slice(0, 3).map(item => `• ${item}`).join('<br>')}`,
  follow: ['What technologies did that use?', 'What else have you built?'],
}));

const certEntry: Entry = {
  label: 'Certifications',
  keywords: tokenize(`certification credential google credly coursera udacity badge verified ${certifications.map(c => `${c.name} ${c.issuer}`).join(' ')}`),
  answer: `I hold ${certifications.length} credentials:<br>${certifications.map(certification =>
    `• <b>${certification.name}</b> — ${certification.issuer}${certification.issued ? `, ${certification.issued}` : ''}${certification.credential ? ` · <a href="${certification.credential.url}" target="_blank" rel="noopener noreferrer">verify ↗</a>` : ''}`).join('<br>')}`,
  follow: ['Tell me about your AI certifications', 'What are your strongest skills?'],
};

const entries: Entry[] = [
  {
    label: 'Introduction',
    keywords: tokenize('who are you introduce yourself about bio background summary hello hi hey intro name'),
    answer: `I'm <b>Sai Swaroop Alluri</b> — a staff-level mobile engineer with 7+ years building consumer-facing applications across iOS, Android, React Native, and Flutter.<br><br>I started in native Android and iOS, then moved into cross-platform work. Today I own features end to end: architecture, implementation, release, and everything that happens after launch.`,
    follow: ['What are you working on now?', 'What technologies do you use?', 'How can I contact you?'],
  },
  {
    label: 'Current role',
    keywords: tokenize('current now today present working role company map communications senior application developer latest'),
    answer: `Since March 2021 I've been a <b>Senior Application Developer at MAP Communications</b>.<br><br>I own five Flutter applications shipped to Android and iOS, plus two watchOS companion apps — architecture through store releases and maintenance. I also build the React and Java Spring Boot customer portal, and work across React Native and native Android/iOS.`,
    follow: ['Tell me about the Flutter apps', 'What is the customer portal?'],
  },
  {
    label: 'Experience',
    keywords: tokenize('experience work history years career background previous past employers companies worked timeline journey'),
    answer: `7+ years, across three places:<br><br>• <b>MAP Communications</b> (Mar 2021 — present) — Senior Application Developer<br>• <b>StarChase LLC</b> (May 2019 — Mar 2021) — Full Stack Application Developer<br>• <b>Old Dominion University</b> (Mar 2017 — Aug 2019) — Graduate Research Assistant, mobile healthcare research and full-stack work`,
    follow: ['What did you do at StarChase?', 'Tell me about your research work'],
  },
  {
    label: 'Flutter portfolio',
    keywords: tokenize('flutter dart five apps portfolio watchos companion release store maintain own number many'),
    answer: `I own <b>five Flutter applications</b> shipped to both Android and iOS, plus <b>two watchOS companion apps</b> — seven shipping targets in total. Product names are confidential.<br><br>That means end-to-end ownership: shared design system and widget library, release ownership with signing and phased rollouts, CI/CD automation, crash and ANR monitoring, and keeping everything current through Flutter and Dart SDK upgrades.`,
    follow: ['How do you handle releases?', 'What about the watchOS apps?'],
  },
  {
    label: 'watchOS work',
    keywords: tokenize('watchos watch wearable apple complication glanceable wrist companion pairing battery'),
    answer: `Two of my shipping targets are <b>watchOS companion apps</b> on iOS. They extend the phone experience onto the wrist with glanceable interfaces, complications, and notification-driven interactions.<br><br>The interesting problems there are watch-specific: pairing and connectivity between phone and watch, state synchronisation, background delivery, battery and performance constraints, and watchOS review requirements.`,
    follow: ['Tell me about the Flutter apps', 'What is your release process?'],
  },
  {
    label: 'Release process',
    keywords: tokenize('release deploy ship pipeline ci cd store submission rollout version signing crash monitoring quality'),
    answer: `I act as release owner across the portfolio: versioning, build flavors and environments, signing, phased rollouts, and App Store and Play Store submissions including review and compliance responses.<br><br>Builds and distribution run through CI/CD pipelines, and after launch I monitor crash-free rates, ANRs, and performance regressions — shipping hotfixes when something reaches customers.`,
    follow: ['What do you do about app performance?', 'Tell me about the Flutter apps'],
  },
  {
    label: 'Customer portal',
    keywords: tokenize('portal customer web react spring boot java self service billing statements payments website frontend'),
    answer: `The <b>MAP customer portal</b> is a self-service web application built on a React front end and Java Spring Boot back end.<br><br>I build the component-driven screens for billing, contacts, call recordings, messages, statements, payments, and reminders; manage state with Redux; and build the supporting REST services, deployed continuously to AWS Elastic Beanstalk. Auth0 and the external chat service are shared with the mobile apps so the experience stays consistent.`,
    follow: ['What backend experience do you have?', 'What else have you built?'],
  },
  {
    label: 'Technologies',
    keywords: tokenize(`technology language framework use know skill stack tooling ${technologies.map(t => t.name).join(' ')}`),
    answer: `Day to day: <b>${technologies.map(tech => tech.name).join(', ')}</b>.<br><br>${technologies.map(tech => `• <b>${tech.name}</b> — ${tech.detail}`).join('<br>')}`,
    follow: ['What are your strongest skills?', 'What backend experience do you have?'],
  },
  {
    label: 'Skills',
    keywords: tokenize(`skill strengths expertise capable architecture delivery ${skillGroups.flatMap(group => group.skills).join(' ')}`),
    answer: `${skillGroups.map(group => `<b>${group.title}</b><br>${group.skills.join(' · ')}`).join('<br><br>')}`,
    follow: ['What technologies do you use most?', 'Tell me about your certifications'],
  },
  {
    label: 'Backend',
    keywords: tokenize('backend server api rest soap spring boot java node microservice database sql mysql mongodb aws cloud lambda'),
    answer: `I'm not a front-end-only engineer. I build the services behind the apps: <b>Java Spring Boot</b> REST APIs, Node.js, and microservices, deployed to <b>AWS</b> Elastic Beanstalk with CI/CD, plus experience with AWS Lambda and Firebase Cloud Messaging.<br><br>On data: MySQL, MariaDB, MongoDB, and MSSQL — schema and query work included.`,
    follow: ['What is the customer portal?', 'What technologies do you use?'],
  },
  {
    label: 'Research',
    keywords: tokenize('research dementia healthcare sensor machine learning tensorflow python odu graduate assistant patient agitation clinical'),
    answer: `At <b>Old Dominion University</b> I spent two years on sensor-driven healthcare research, detecting agitation in dementia patients.<br><br>I built iOS and Android applications that collected accelerometer, gyroscope, heart-rate, and audio data, developed machine-learning pipelines with Python, TensorFlow, and Keras to profile patients and trigger real-time alerts, and implemented Spring Boot microservices behind it. Clinicians and researchers used the result.`,
    follow: ['Do you work with AI?', 'What did you study?'],
  },
  {
    label: 'AI work',
    keywords: tokenize('ai artificial intelligence machine learning genai generative copilot gemini llm prompt vibe coding automation'),
    answer: `Two angles. Applied machine learning in my <b>dementia research</b> — sensor pipelines with TensorFlow and Keras. And recent <b>practical AI work</b>, backed by certifications: the Google AI Professional Certificate plus badges in AI for App Building, Content Creation, Data Analysis, and Research, and Coursera courses on securing mobile AI models and generative AI in development with tools like GitHub Copilot and Gemini.`,
    follow: ['Tell me about your certifications', 'Tell me about your research work'],
  },
  {
    label: 'Education',
    keywords: tokenize('education degree university college study masters bachelors computer science electronics odu lovely professional'),
    answer: `• <b>M.S. Computer Science</b> — Old Dominion University, Norfolk, VA (Aug 2019)<br>• <b>Bachelor's in Electronics & Communication Engineering</b> — Lovely Professional University, India (May 2017)`,
    follow: ['Tell me about your research work', 'What certifications do you have?'],
  },
  {
    label: 'Awards',
    keywords: tokenize('award hackathon win won prize first place dominion enterprises homes augmented reality ar recognition'),
    answer: `<b>First place, Hackathon 2019</b> at Dominion Enterprises. I built AR-enabled mobile features integrated with Google Maps to improve the Homes.com mobile experience.`,
    follow: ['What else have you built?', 'Do you work with AI?'],
  },
  {
    label: 'Location',
    keywords: tokenize('location live based where city state herndon virginia relocate remote timezone'),
    answer: `I'm based in <b>Herndon, Virginia</b>.`,
    follow: ['How can I contact you?', 'Are you open to new roles?'],
  },
  {
    label: 'Contact',
    keywords: tokenize('contact email reach message linkedin github connect talk call phone touch'),
    answer: `Happy to talk:<br>• <a href="mailto:saiswaroop.alluri@gmail.com">saiswaroop.alluri@gmail.com</a><br>• <a href="https://www.linkedin.com/in/sai-swaroop-alluri-626a31b2/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><br>• <a href="https://github.com/saiswaroopalluri" target="_blank" rel="noopener noreferrer">GitHub ↗</a>`,
    follow: ['Can I see your résumé?', 'Are you open to new roles?'],
  },
  {
    label: 'Hiring',
    keywords: tokenize('hiring hire available opportunity opening position offer looking interested fit why should recruit'),
    answer: `I'm always open to a good conversation.<br><br>What I bring: deep mobile ownership across Flutter, React Native, and native iOS and Android; the backend and web experience to work across the whole feature; and a track record of shipping and maintaining production apps rather than just building them. The fastest way to start is <a href="mailto:saiswaroop.alluri@gmail.com">email</a>.`,
    follow: ['Can I see your résumé?', 'What are your strongest skills?'],
  },
  {
    label: 'Résumé',
    keywords: tokenize('resume cv download pdf document paper profile'),
    answer: `Two versions:<br>• <a href="/Alluri-Sai-Swaroop-Resume.pdf" download>General résumé ↓</a><br>• <a href="/Alluri-Sai-Swaroop-React-Native.pdf" download>React Native résumé ↓</a>`,
    follow: ['What is your experience?', 'How can I contact you?'],
  },
  {
    label: 'This site',
    keywords: tokenize('site website portfolio built made 3d orbit scene three assistant how works code design'),
    answer: `This portfolio is built with <b>TypeScript, Vite, and Three.js</b> — no UI framework.<br><br>The orbit and the background corridor are live WebGL scenes, and the project artwork is hand-built CSS. This assistant runs entirely in your browser, searching a knowledge base compiled from my résumé.`,
    follow: ['What technologies do you use?', 'What else have you built?'],
  },
  certEntry,
  ...projectEntries,
];

const documentFrequency = new Map<string, number>();
for (const entry of entries) {
  for (const token of new Set(entry.keywords)) {
    documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
  }
}

const SUGGESTIONS = [
  'Who are you?',
  'What are you working on now?',
  'Tell me about the Flutter apps',
  'What technologies do you use?',
  'What certifications do you have?',
  'Are you open to new roles?',
];

export interface Reply {
  html: string;
  label: string;
  confident: boolean;
  follow: string[];
}

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export const passages = entries.map(entry => ({
  label: entry.label,
  text: `${entry.label}. ${stripHtml(entry.answer)}`,
  answer: entry.answer,
  follow: entry.follow ?? SUGGESTIONS.slice(0, 3),
}));

export const fallbackReply: Reply = {
  label: 'No match', confident: false, follow: SUGGESTIONS.slice(0, 4),
  html: `That one isn't in my notes. I can speak to my experience, projects, technologies, certifications, education, and how to get in touch — or just <a href="mailto:saiswaroop.alluri@gmail.com">email me</a> and ask directly.`,
};

export function ask(question: string): Reply {
  const tokens = tokenize(question);
  if (!tokens.length) {
    return {
      label: 'Prompt', confident: false, follow: SUGGESTIONS.slice(0, 3),
      html: 'Ask me anything about my work, experience, or the things I have built.',
    };
  }
  let best: Entry | undefined;
  let bestScore = 0;
  for (const entry of entries) {
    const keywords = new Set(entry.keywords);
    let score = 0;
    for (const token of new Set(tokens)) {
      if (!keywords.has(token)) continue;
      const frequency = documentFrequency.get(token) ?? 1;
      score += 1 + Math.log(entries.length / frequency);
    }
    score /= Math.sqrt(keywords.size);
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  if (!best || bestScore < 0.14) return { ...fallbackReply };
  return { html: best.answer, label: best.label, confident: bestScore > 0.3, follow: best.follow ?? SUGGESTIONS.slice(0, 3) };
}

export function suggestions() {
  return SUGGESTIONS;
}
