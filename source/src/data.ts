export type Category = 'All work' | 'Mobile' | 'Full stack' | 'Research';

export interface Project {
  id: string;
  number: string;
  title: string;
  category: Exclude<Category, 'All work'>;
  subtitle: string;
  company: string;
  year: string;
  tags: string[];
  description: string;
  contributions: string[];
}

export const projects: Project[] = [
  {
    id: 'map', number: '01', title: 'Connected, on call.',
    category: 'Mobile', subtitle: 'Enterprise communication apps',
    company: 'MAP Communications', year: '2021 — Present',
    tags: ['React Native', 'TypeScript', 'Swift & Java'],
    description: 'Cross-platform and native mobile applications supporting mission-critical communication services for enterprise customers.',

    contributions: [
      'Owned end-to-end feature development across native Android and React Native, collaborating with product managers and designers on user-facing experiences.',
      'Built reusable React Native components and shared UI modules with TypeScript, hooks, and modern React patterns; owned MVVM architecture for cross-platform applications.',
      'Delivered billing, call recordings, messaging, payments, reminders, biometric authentication, watchOS notifications, and intelligent call forwarding.',
      'Integrated Auth0, external chat services, REST APIs, and real-time data flows across mobile clients.',
      'Resolved performance bottlenecks, caching issues, background execution problems, and socket edge cases while keeping latency-sensitive flows native.',
      'Owned App Store and Play Store submissions, crash and ANR monitoring, hotfixes, and production rollouts.',
      'Built internal on-call scheduling tools to support operational efficiency and response time.',
    ],
  },
  {
    id: 'flutter', number: '02', title: 'Seven apps, one standard.',
    category: 'Mobile', subtitle: 'Five Flutter apps & two watchOS companions',
    company: 'MAP Communications', year: '2021 — Present',
    tags: ['Flutter', 'watchOS', 'CI/CD'],
    description: 'End-to-end ownership of five Flutter applications shipped to both Android and iOS, plus two native watchOS companion apps — from architecture and development through store releases and long-term maintenance. Product names are confidential.',
    contributions: [
      'Own five production Flutter applications end to end — requirements and architecture, implementation, testing, release, and ongoing maintenance — each shipped to both Android and iOS from a single codebase.',
      'Build and maintain two watchOS companion apps on iOS, extending the phone experience onto the wrist with glanceable interfaces, complications, and notification-driven interactions designed for very small screens and short sessions.',
      'Handle the watch-specific concerns that come with that surface: pairing and connectivity between phone and watch, state synchronisation, background delivery, battery and performance constraints, and watchOS review requirements.',
      'Established shared foundations across the portfolio — a common design system, reusable widget library, and consistent state-management and navigation patterns — so the apps stay coherent without separate codebases to reason about.',
      'Act as release owner for every app: versioning, build flavors and environments, signing, phased rollouts, and App Store and Play Store submissions including review and compliance responses, with the watch apps shipped alongside their iOS counterparts.',
      'Automated builds and distribution through CI/CD pipelines, reducing manual release effort and keeping a predictable, repeatable cadence across the whole portfolio.',
      'Monitor production health per app and per platform — crash-free rates, ANRs, and performance regressions — triaging issues and shipping hotfixes when something reaches customers.',
      'Maintain everything through Flutter and Dart SDK upgrades, dependency migrations, and platform requirement changes from Apple and Google, keeping every app current and submittable.',
      'Integrate the apps with backend REST services, push notifications, and authentication flows, coordinating closely with backend and product teams across overlapping release schedules.',
      'Balance competing roadmaps across seven shipping targets, prioritising work so parallel feature development and support never block a release.',
    ],
  },
  {
    id: 'portal', number: '03', title: 'Everything, in one place.',
    category: 'Full stack', subtitle: 'MAP customer portal — React & Spring Boot',
    company: 'MAP Communications', year: '2021 — Present',
    tags: ['React', 'Java Spring Boot', 'AWS'],
    description: 'A self-service web portal where customers manage their account and communication services, built on a React front end and Java Spring Boot back end.',
    contributions: [
      'Developed the MAP customer portal front end in React, building component-driven screens for billing, contacts, call recordings, messages, statements, payments, and reminders.',
      'Managed application state with Redux and asynchronous data flows, keeping the interface responsive against live account and call data.',
      'Designed and built the supporting REST services in Java Spring Boot, validating endpoints with Postman and deploying continuously to AWS Elastic Beanstalk.',
      'Integrated Auth0 for authentication and the external chat service used across both the portal and the mobile applications, so customers get a consistent identity and support experience on every surface.',
      'Kept portal and mobile feature parity in mind — shared backend contracts and consistent behaviour meant a change in one place did not quietly break the other.',
      'Worked across the full stack on the same features: schema and query work in MySQL and MSSQL, service logic in Spring Boot, and the interface customers actually touch.',
      'Collaborated with product and design on usability improvements, turning customer feedback into portal changes that reduced routine support requests.',
    ],
  },
  {
    id: 'fleet', number: '04', title: 'Every move matters.',
    category: 'Full stack', subtitle: 'Real-time fleet & asset tracking',
    company: 'StarChase LLC', year: '2019 — 2021',
    tags: ['Google Maps', 'Java', 'Swift'],
    description: 'Web and native mobile features for asset tracking, fleet management, and incident response.',
    contributions: [
      'Integrated Google Maps and demographic APIs for live vehicle tracking and incident response.',
      'Designed and implemented emergency-management features for web and mobile.',
      'Built server-side functionality with Spring MVC and Hibernate, integrating RESTful and SOAP services.',
      'Designed event-driven, MVC-based applications with an emphasis on performance and reliability.',
      'Led Android and iOS deployments, maintaining platform parity and release stability; improved performance through unit testing, profiling, and bug fixes.',
    ],
  },
  {
    id: 'health', number: '05', title: 'Technology with care.',
    category: 'Research', subtitle: 'Wearable-assisted dementia research',
    company: 'Old Dominion University', year: 'Dec 2017 — Aug 2019',
    tags: ['Python', 'TensorFlow', 'iOS & Android'],
    description: 'Graduate research exploring how off-the-shelf wearables and mobile devices can help detect agitation in dementia patients.',
    contributions: [
      'Used accelerometer, gyroscope, heart-rate, and decibel measurements to support agitation detection.',
      'Developed machine-learning models to profile patients and alert authorities.',
      'Built Android and iOS applications for movement detection and intervention techniques, alongside SOAPD and CMAI measurement apps.',
      'Developed Spring Boot microservices and REST services for the research platform.',
      'Delivered research applications used by clinicians and researchers, using native mobile development, Firebase, and Google Cloud Platform.',
    ],
  },
  {
    id: 'ibhert', number: '06', title: 'Closing the distance.',
    category: 'Full stack', subtitle: 'Collaboration for rural healthcare',
    company: 'Old Dominion University · IBHERT', year: 'Mar 2017 — Aug 2019',
    tags: ['PHP', 'MySQL', 'Spring Boot'],
    description: 'A collaboration with ODU Nursing School to support advanced nursing practice in rural areas.',
    contributions: [
      'Developed a Slack-like messaging and chat-room website with a LAMP stack.',
      'Implemented authentication, authorization, two-factor authentication, GitHub login, reCAPTCHA, and activity analytics.',
      'Developed Java microservices and Spring Boot applications to connect mobile and web experiences with the database.',
    ],
  },
];

export interface Technology {
  name: string;
  group: string;
  detail: string;
  since: string;
  highlights: string[];
  projects: string[];
}

export const technologies: Technology[] = [
  {
    name: 'React Native', group: 'Mobile', since: '2021 — present',
    detail: 'Reusable cross-platform components, TypeScript, hooks, Redux, and end-to-end feature ownership.',
    highlights: [
      'Own end-to-end feature development for enterprise communication apps, from architecture to App Store and Play Store release.',
      'Built reusable component systems and shared UI modules so design stays consistent and features ship faster across platforms.',
      'Keep latency-sensitive flows native, using React Native where it buys speed without costing performance.',
      'Debugged production issues others avoid: caching, background execution, and socket edge cases.',
    ],
    projects: ['map'],
  },
  {
    name: 'Swift', group: 'iOS', since: '2017 — present',
    detail: 'Native iOS experiences, watchOS companions, and App Store releases.',
    highlights: [
      'Native iOS development since my research years, now underpinning my cross-platform work.',
      'Build and ship two watchOS companion apps — glanceable interfaces, complications, and notification-driven interactions.',
      'Handle pairing, state sync, background delivery, and the battery constraints unique to the wrist.',
      'Own App Store submissions, review responses, and phased production rollouts.',
    ],
    projects: ['flutter', 'map', 'fleet'],
  },
  {
    name: 'React', group: 'Web', since: '2019 — present',
    detail: 'Component-driven web interfaces for the MAP customer portal, with Redux and TypeScript.',
    highlights: [
      'Build the MAP customer portal front end — billing, statements, payments, messages, and call recordings.',
      'Manage asynchronous account and call data with Redux, keeping the interface responsive under live updates.',
      'Share backend contracts with the mobile apps so web and mobile stay in step.',
    ],
    projects: ['portal', 'ibhert'],
  },
  {
    name: 'Java', group: 'Backend', since: '2017 — present',
    detail: 'Spring Boot services, REST APIs, and native Android development.',
    highlights: [
      'Design and build REST services in Spring Boot, validated with Postman and deployed to AWS Elastic Beanstalk.',
      'Wrote the microservices behind healthcare research data collection and fleet tracking platforms.',
      'Native Android development in Java, from research applications through production enterprise apps.',
      'Comfortable across Spring MVC, Hibernate, and SOAP integrations in older systems.',
    ],
    projects: ['portal', 'fleet', 'health', 'ibhert'],
  },
  {
    name: 'Python', group: 'Intelligence', since: '2017 — 2019',
    detail: 'Sensor-data research with Pandas, TensorFlow, and Keras.',
    highlights: [
      'Built machine-learning pipelines to detect agitation in dementia patients from wearable sensor data.',
      'Processed accelerometer, gyroscope, heart-rate, and audio signals into features models could learn from.',
      'Produced models that profiled patients and triggered real-time alerts for caregivers.',
    ],
    projects: ['health'],
  },
  {
    name: 'AWS', group: 'Cloud', since: '2019 — present',
    detail: 'Elastic Beanstalk deployment, AWS Lambda, and continuous delivery pipelines.',
    highlights: [
      'Continuous deployment of Spring Boot services to Elastic Beanstalk.',
      'CI/CD pipelines that automate builds and distribution across a multi-app mobile portfolio.',
      'Experience with AWS Lambda alongside Firebase Cloud Messaging and Google Cloud Platform.',
    ],
    projects: ['portal', 'map'],
  },
  {
    name: 'Flutter', group: 'Cross-platform', since: '2021 — present',
    detail: 'Five production apps shipped to Android and iOS, plus two watchOS companion apps.',
    highlights: [
      'Own five Flutter applications end to end, each shipped to both Android and iOS from a single codebase.',
      'Established a shared design system and widget library so the portfolio stays coherent.',
      'Act as release owner: versioning, build flavors, signing, phased rollouts, and store submissions.',
      'Maintain everything through Flutter and Dart SDK upgrades and platform requirement changes.',
    ],
    projects: ['flutter'],
  },
];

export const skillGroups = [
  { title: 'Mobile & interfaces', skills: ['React Native', 'Swift / iOS', 'Java / Android', 'Flutter / Dart', 'Xamarin Forms', 'watchOS', 'React.js', 'TypeScript', 'JavaScript', 'Redux', 'HTML5 / CSS3'] },
  { title: 'Backend & cloud', skills: ['Java Spring Boot', 'Node.js', 'REST / SOAP', 'AWS Lambda', 'Elastic Beanstalk', 'Firebase Messaging', 'Google Cloud', 'PHP / Laravel', 'MySQL', 'MariaDB', 'MongoDB'] },
  { title: 'Architecture & delivery', skills: ['MVVM', 'Modular architecture', 'Event-driven systems', 'Release management', 'Performance profiling', 'Crash / ANR monitoring', 'CI/CD', 'Docker', 'Jenkins', 'Git', 'Postman', 'App Store / Play Store'] },
  { title: 'Research & tools', skills: ['Python', 'Pandas', 'TensorFlow', 'Keras', 'Sensor pipelines', 'Google Maps API', 'Android Studio', 'Xcode', 'Visual Studio'] },
];

interface Certification {
  name: string;
  issuer: string;
  issued?: string;
  expires?: string;
  credential?: { url: string; platform: 'Credly' | 'Coursera' | 'Accredible' };
  description: string;
  skills: string[];
}

export const certifications: Certification[] = [
  {
    name: 'Google AI Professional Certificate',
    issuer: 'Google Career Certificates',
    issued: 'March 18, 2026',
    credential: { url: 'https://www.credly.com/badges/97f65562-117b-4668-a289-b9222cec9ba0', platform: 'Credly' },
    description: 'Seven courses applying AI to research, communication, content creation, data analysis, and coding — with an emphasis on effective prompting, evaluating outputs, and responsible use.',
    skills: ['AI prompting', 'Output evaluation', 'Responsible AI'],
  },
  {
    name: 'AI for App Building',
    issuer: 'Google Career Certificates',
    issued: 'March 18, 2026',
    credential: { url: 'https://www.credly.com/badges/0eec1bf4-7615-40b5-a215-eb4ae86d09c3', platform: 'Credly' },
    description: 'Applying natural-language prompts to build custom web applications, identify workflow opportunities, and understand the limitations and pitfalls of AI-assisted coding.',
    skills: ['AI-assisted coding', 'Workflow analysis', 'App building'],
  },
  {
    name: 'AI for Content Creation',
    issuer: 'Google Career Certificates',
    issued: 'March 18, 2026',
    credential: { url: 'https://www.credly.com/badges/87f98cc2-259f-475f-a5f6-97c40d2a6819', platform: 'Credly' },
    description: 'Using AI to generate and refine images, video, and presentation content, while evaluating creative outputs against brand guidelines and quality standards.',
    skills: ['Generative AI', 'Multimedia creation', 'Creative evaluation'],
  },
  {
    name: 'AI for Data Analysis',
    issuer: 'Google Career Certificates',
    issued: 'March 18, 2026',
    credential: { url: 'https://www.credly.com/badges/db8eedc7-5b20-4eeb-8fad-eeedd249df4d', platform: 'Credly' },
    description: 'Using AI to clean and structure data, develop spreadsheet functions with natural language, and visualize findings for evidence-based decisions.',
    skills: ['Data analysis', 'Data manipulation', 'Data visualization'],
  },
  {
    name: 'AI for Research and Insights',
    issuer: 'Google Career Certificates',
    issued: 'March 18, 2026',
    credential: { url: 'https://www.credly.com/badges/d56337af-b252-4405-acd4-1f59cc386f3c', platform: 'Credly' },
    description: 'Synthesizing complex information into summaries and reports, validating sources, and using Gemini Deep Research to develop data-backed insights.',
    skills: ['Research', 'Information synthesis', 'Source validation'],
  },
  {
    name: 'Secure Mobile AI Models Against Attacks',
    issuer: 'Coursera',
    issued: 'February 11, 2026',
    credential: { url: 'https://www.coursera.org/account/accomplishments/verify/RFVBPWXOUGS9', platform: 'Coursera' },
    description: 'Fundamentals of deploying AI models in mobile applications, including performance, privacy, and security considerations.',
    skills: ['Mobile AI', 'Model security', 'Privacy'],
  },
  {
    name: 'Generative AI: Turbocharge Mobile App Development',
    issuer: 'SkillUp · Coursera',
    issued: 'January 31, 2026',
    credential: { url: 'https://www.coursera.org/account/accomplishments/verify/7O3523HLYESB', platform: 'Coursera' },
    description: 'Applying AI tools to mobile development, including Vertex AI, Dialogflow, and Apple Intelligence.',
    skills: ['Vertex AI', 'Dialogflow', 'Apple Intelligence'],
  },
  {
    name: 'Generative AI: Elevate your Software Development Career',
    issuer: 'IBM · Coursera',
    issued: 'December 31, 2025',
    credential: { url: 'https://www.coursera.org/account/accomplishments/verify/Z80QD5EQQMC3', platform: 'Coursera' },
    description: 'Developing software solutions with generative AI tools, including ChatGPT, GitHub Copilot, Google Gemini, n8n, and Bolt.',
    skills: ['Generative AI', 'GitHub Copilot', 'AI-assisted development'],
  },
  {
    name: 'Google Play Academy - Store Listing Certificate',
    issuer: 'Google Play Academy',
    issued: 'December 18, 2025',
    expires: 'December 18, 2028',
    credential: { url: 'https://www.credential.net/6df56708-f659-4322-aae7-6ca0b5ad2a28', platform: 'Accredible' },
    description: 'A performance-based assessment of Google Play store-listing best practices, presenting app stories through listing assets, and marketing to a global audience.',
    skills: ['Google Play', 'Mobile marketing', 'App growth marketing'],
  },
  {
    name: 'Android Developer Nanodegree',
    issuer: 'Udacity',
    description: 'A foundation in Android development, complementing my native mobile and cross-platform engineering experience.',
    skills: ['Android', 'Mobile development'],
  },
  {
    name: 'React Developer Nanodegree',
    issuer: 'Udacity',
    description: 'React development training that complements my work building reusable interfaces and component-driven applications.',
    skills: ['React', 'Component architecture'],
  },
];
