import type { PortfolioItem } from '@portfolio/shared-types';

/**
 * 🧭 **OWNER: Slice 7 (Portfolio Item).** The first half of v3's
 * `src/store/other.data.ts` at commit `39bbe56` (D53), ported field for field.
 * Split across two modules only to stay under the 200-line source cap; the
 * second half is `portfolio-items-other-clients.fixture.ts`.
 *
 * ⚠️ **`older-cosmikata` is the only item with videos**, and they are YouTube
 * embed URLs — the one third-party iframe on the site.
 *
 * ⚠️ **`cw-breeze-thru` moved out in Slice 11** to
 * `portfolio-items-cricket.fixture.ts`; this module was 242 lines against the
 * 200-line cap once the redesign's six fields per item went in.
 *
 * ⚠️ **Frozen for the whole 12/13/14/15/16 wave.**
 */
export const OTHER_PORTFOLIO_ITEMS: readonly PortfolioItem[] = [
  {
    slug: 'older-cosmikata',
    company: 'Freelancing/Concepts',
    title: 'Cosmikata (older version)',
    subtitle: 'Design / Development',
    thumbnail: '/images/portfolio/freelancing-concepts/cosajiou-thumbnail.jpg',
    description:
      '<p>I developed an application designed to empower cosplayers and cosmakers with ' +
      'enhanced organizational capabilities. Originating from a personal necessity to ' +
      'streamline the planning of future cosplays, the app combines features inspired by ' +
      'Trello and Cosplanner. As a solo project, I am overseeing every aspect, from ' +
      'conceptualization to production. Without a set launch date, I am taking the ' +
      'opportunity to thoroughly test various technologies.</p>',
    images: [
      {
        src: '/images/portfolio/freelancing-concepts/cosajiou-login.jpg',
        alt: 'Cosmikata Login',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/freelancing-concepts/cosajiou-whats-next.jpg',
        alt: "Cosmikata What's Next Screen",
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/freelancing-concepts/cosajiou-projects.jpg',
        alt: 'Cosmikata Cosplay Screen',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/freelancing-concepts/cosajiou-details.jpg',
        alt: 'Cosmikata Cosplay Details Screen',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/freelancing-concepts/cosajiou-project-completed.jpg',
        alt: 'Cosmikata Modal Cosplay Completed',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/freelancing-concepts/cosajiou-form.jpg',
        alt: 'Cosmikata Form Design',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/freelancing-concepts/cosajiou-modal.jpg',
        alt: 'Cosmikata Modal Design',
        width: '414',
        height: '736',
      },
    ],
    videos: [
      {
        src: 'https://www.youtube.com/embed/GdRP5EWrH9A',
        title: 'Cosmikata Video 1',
        description: 'First video talks about the application in detail.',
      },
      {
        src: 'https://www.youtube.com/embed/axvSVI4IeOU',
        title: 'Cosmikata Video 2',
        description:
          'This video continues to talk about other parts of the application. Note: Around ' +
          '2:30 I said "iOS 5" but I meant iPhone 5.',
      },
    ],
    /*
     * ⚠️ **INVENTED — the design covers this item in no export** (D77). `lede`,
     * `body`, `facts` and `year` have no source at all; `role` follows v3's own
     * `subtitle` and `tech` is v3's own stack list, so those two are ported.
     * ⚠️ **`year` is a guess** — v3 dates nothing, and `2019` is read off the
     * stack (Sketch, early Expo, GraphQL) plus the current Cosmikata item's
     * "a few years after its original development". Confirm it before release.
     */
    year: '2019',
    role: 'Design & Engineering',
    lede: 'The first Cosmikata, a planning app for cosplayers and cosmakers.',
    body: [
      'Built out of a personal need to plan future cosplays, the app combined the board-and-card organisation of Trello with the build-tracking of Cosplanner, aimed at people managing several costumes at once.',
      'A solo project from concept to production: design, data model, and the React Native client. With no fixed launch date, it doubled as a testbed for a GraphQL and PostgreSQL stack behind an Expo app.',
    ],
    tech: ['React Native', 'Expo', 'GraphQL', 'PostgreSQL', 'Sketch'],
    facts: [
      { key: 'Timeline', value: 'Ongoing side project' },
      { key: 'Role', value: 'Solo — concept, design, build' },
      { key: 'Focus', value: 'Cosplay planning' },
    ],
    links: [],
  },
  {
    slug: 'csp-generator-app',
    company: 'Freelancing/Concepts',
    title: 'CSP Generator App',
    subtitle: 'Design / Development',
    thumbnail: '/images/portfolio/freelancing-concepts/csp-thumbnail.jpg',
    description:
      '<p>Crafting a Content Security Policy (CSP) can be a complex task, particularly when ' +
      'dealing with numerous content restrictions and allowances within your application. ' +
      "Leveraging the power of React, TypeScript, and Redux, I've developed an application to " +
      'simplify this process. Import your existing CSP content and seamlessly augment it with ' +
      'additional elements as per your requirements. Once your customization is complete, ' +
      'effortlessly generate the CSP to seamlessly integrate it into your application.</p>' +
      '<ul><li>React</li><li>TypeScript</li><li>Redux</li></ul>' +
      '<p><a href="https://anselmmarie.github.io/csp-generator" target="_blank" ' +
      'rel="noopener noreferrer">See the app in action</a></p>' +
      '<p><a href="https://github.com/AnselmMarie/csp-generator/tree/development" ' +
      'target="_blank" rel="noopener noreferrer">GitHub Repository</a></p>',
    images: [
      {
        src: '/images/portfolio/freelancing-concepts/cspGenerator01.jpg',
        alt: 'Content Security Policy App 1',
        width: '1140',
        height: '822',
      },
      {
        src: '/images/portfolio/freelancing-concepts/cspGenerator02.jpg',
        alt: 'Content Security Policy App 2',
        width: '1140',
        height: '822',
      },
    ],
    videos: [],
    year: '2023',
    role: 'Creator',
    lede: 'A developer tool for writing Content Security Policy headers without guesswork.',
    body: [
      'CSP headers are easy to get wrong and painful to debug. The tool turns each directive into an explained, checkable control and emits a copy-paste header as you go.',
      'Import an existing policy, augment it directive by directive, and generate the finished header — the flow is built around amending a real policy rather than starting from a blank one.',
      'Built as a single-page app with no backend, so it can be self-hosted or run locally in a security-sensitive environment.',
    ],
    tech: ['React', 'TypeScript', 'Redux', 'Web Security', 'Vite', 'GitHub Actions'],
    facts: [
      { key: 'Timeline', value: '3 weeks' },
      { key: 'Role', value: 'Solo' },
      { key: 'Focus', value: 'Developer experience' },
    ],
    links: [
      {
        label: 'Live tool',
        href: 'https://anselmmarie.github.io/csp-generator',
        icon: 'external',
      },
      {
        label: 'Source',
        href: 'https://github.com/AnselmMarie/csp-generator/tree/development',
        icon: 'github',
      },
    ],
  },
];
