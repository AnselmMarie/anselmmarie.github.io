import type { PortfolioItem } from '@portfolio/shared-types';

/**
 * 🧭 **OWNER: Slice 7 (Portfolio Item).** The first half of v3's
 * `src/store/other.data.ts` at commit `39bbe56` (D53), ported field for field.
 * Split across two modules only to stay under the 200-line source cap; the
 * second half is `portfolio-items-other-clients.fixture.ts`.
 *
 * ⚠️ **`older-cosmikata` is the only item with videos**, and they are YouTube
 * embed URLs — the one third-party iframe on the site.
 */
export const OTHER_PORTFOLIO_ITEMS: readonly PortfolioItem[] = [
  {
    slug: 'older-cosmikata',
    company: 'Freelancing/Concepts',
    title: 'CosMikata (older version)',
    subtitle: 'Design / Development',
    thumbnail: '/images/portfolio/freelancing-concepts/cosajiou-thumbnail.jpg',
    description:
      '<p>I developed an application designed to empower cosplayers and cosmakers with ' +
      'enhanced organizational capabilities. Originating from a personal necessity to ' +
      'streamline the planning of future cosplays, the app combines features inspired by ' +
      'Trello and Cosplanner. As a solo project, I am overseeing every aspect, from ' +
      'conceptualization to production. Without a set launch date, I am taking the ' +
      'opportunity to thoroughly test various technologies. The tech stack I used is:</p>' +
      '<ul><li>React Native</li><li>Expo</li><li>GraphQL</li><li>PostgreSQL</li>' +
      '<li>Sketch</li></ul>',
    images: [
      {
        src: '/images/portfolio/freelancing-concepts/cosajiou-login.jpg',
        alt: 'CosMikata Login',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/freelancing-concepts/cosajiou-whats-next.jpg',
        alt: "CosMikata What's Next Screen",
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/freelancing-concepts/cosajiou-projects.jpg',
        alt: 'CosMikata Cosplay Screen',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/freelancing-concepts/cosajiou-details.jpg',
        alt: 'CosMikata Cosplay Details Screen',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/freelancing-concepts/cosajiou-project-completed.jpg',
        alt: 'CosMikata Modal Cosplay Completed',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/freelancing-concepts/cosajiou-form.jpg',
        alt: 'CosMikata Form Design',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/freelancing-concepts/cosajiou-modal.jpg',
        alt: 'CosMikata Modal Design',
        width: '414',
        height: '736',
      },
    ],
    videos: [
      {
        src: 'https://www.youtube.com/embed/GdRP5EWrH9A',
        title: 'CosMikata Video 1',
        description: 'First video talks about the application in detail.',
      },
      {
        src: 'https://www.youtube.com/embed/axvSVI4IeOU',
        title: 'CosMikata Video 2',
        description:
          'This video continues to talk about other parts of the application. Note: Around ' +
          '2:30 I said "iOS 5" but I meant iPhone 5.',
      },
    ],
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
  },
  {
    slug: 'cw-breeze-thru',
    company: 'Cricket Wireless',
    title: 'Breeze-Thru',
    subtitle: 'Design / Development',
    thumbnail: '/images/portfolio/cricket-wireless/breezeThru-thumbnail.jpg',
    description:
      '<p>Breeze-Thru is an innovative application that facilitates the seamless activation of ' +
      'service for new customers on any mobile device.</p>' +
      '<p>In my capacity as the leader of the front-end team, I played a pivotal role in ' +
      'shaping the entire development lifecycle of this application, from its initial ' +
      'conception to its successful production launch. My responsibilities encompassed ' +
      'coding, design implementation, and team management. Throughout the process, we ' +
      'maintained a strong emphasis on optimizing user experience (UX) and ensuring ' +
      'accessibility for all users.</p>' +
      '<p>Effective communication and collaboration with the network, back-end, and business ' +
      "teams were key factors in the project's success. Our coordinated efforts culminated in " +
      'the successful launch of the application, garnering positive feedback. In recognition ' +
      'of the project\'s excellence, I was honored with "The AT&T Service Excellence Award" ' +
      'shortly thereafter.</p>',
    images: [
      {
        src: '/images/portfolio/cricket-wireless/breezeThru01.jpg',
        alt: 'Breeze-Thru homepage',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/cricket-wireless/breezeThru02.jpg',
        alt: 'Breeze-Thru customer check',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/cricket-wireless/breezeThru03.jpg',
        alt: 'Breeze-Thru navigation',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/cricket-wireless/breezeThru04.jpg',
        alt: 'Breeze-Thru add IMEI and ICCID data',
        width: '414',
        height: '736',
      },
    ],
    videos: [],
  },
];
