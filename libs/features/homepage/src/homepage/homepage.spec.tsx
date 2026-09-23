import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HOMEPAGE_CONTENT, SECTION_IDS, SITE_SECTIONS } from '@portfolio/shared-fixtures';

import Homepage from './homepage.js';

describe('Homepage — the anchor contract (D43, D81)', () => {
  it('puts a section element on every id SITE_SECTIONS names', () => {
    /*
     * ⚠️ **This is the third leg of the contract, and the only spec in the
     * workspace that can reach it.** The Header remote links to these ids and
     * the shell's header fallback links to them too; neither can check that
     * anything actually carries them, because all three are separately
     * deployed. A rename that only two of them follow scrolls nowhere and
     * throws nothing.
     */
    const { container } = render(<Homepage />);

    for (const section of SITE_SECTIONS) {
      expect(container.querySelector(`#${section.id}`), section.id).not.toBeNull();
    }
  });

  it('renders no anchor the nav does not know about', () => {
    const { container } = render(<Homepage />);
    const known = new Set(SITE_SECTIONS.map((section) => section.id));
    const rendered = [...container.querySelectorAll('section[id]')].map((el) => el.id);

    expect(rendered.filter((id) => !known.has(id))).toEqual([]);
  });

  it('gives the hero no anchor — it is not a section', () => {
    render(<Homepage />);

    expect(screen.getByRole('heading', { level: 1 })).not.toHaveAttribute('id');
  });
});

describe('Homepage — composition', () => {
  it('renders the seven blocks the design draws, in order', () => {
    const { container } = render(<Homepage />);
    const ids = [...container.querySelectorAll('section[id]')].map((el) => el.id);

    expect(ids).toEqual([
      SECTION_IDS.work,
      SECTION_IDS.experience,
      SECTION_IDS.skills,
      SECTION_IDS.about,
      SECTION_IDS.contact,
    ]);
  });

  it('draws the Work cards newest year first (maintainer, 2026-09-23)', () => {
    const { container } = render(<Homepage />);
    const work = container.querySelector(`#${SECTION_IDS.work}`) as HTMLElement;
    const hrefs = [...work.querySelectorAll('a')].map((a) => a.getAttribute('href'));

    expect(hrefs).toHaveLength(HOMEPAGE_CONTENT.work.length);
    expect(hrefs).toEqual([
      '/portfolio/webpage-v3', // 2026
      '/portfolio/micro-frontend-update', // 2025
      '/portfolio/cosmikata', // 2025
      '/portfolio/older-cosmikata', // 2019
      '/portfolio/cw-breeze-thru', // 2018
      '/portfolio/prototype-company-division', // 2017
    ]);
  });

  it('stops at the Contact block and draws no footer strip (D79)', () => {
    // The copyright row, the two icon links and the tagline belong to the
    // footer remote and arrive over the federation boundary. Drawing them here
    // would double them on the composed page.
    render(<Homepage />);

    expect(screen.queryByText(/© 2026/u)).not.toBeInTheDocument();
    expect(screen.queryByText(/Senior SWE/u)).not.toBeInTheDocument();
  });

  it('renders the specs strip with the years figure D103 settled on', () => {
    render(<Homepage />);

    expect(screen.getByText('13+ years shipping')).toBeInTheDocument();
    expect(screen.queryByText('15+ years shipping')).not.toBeInTheDocument();
  });
});

describe('Homepage — the Experience accordion', () => {
  it('opens the first entry on load, and only the first', () => {
    // ⚠️ A closed-by-default accordion reads as an empty section, which is why
    // the initial open is behaviour rather than a detail.
    render(<Homepage />);

    const [first, second] = HOMEPAGE_CONTENT.experience;

    expect(
      screen.getByRole('button', { name: new RegExp(first?.company ?? '', 'u') })
    ).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByRole('button', { name: new RegExp(second?.company ?? '', 'u') })
    ).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows one body at a time', () => {
    render(<Homepage />);
    const [first, second] = HOMEPAGE_CONTENT.experience;

    expect(screen.getByText(first?.points[0] ?? '')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: new RegExp(second?.company ?? '', 'u') }));

    expect(screen.queryByText(first?.points[0] ?? '')).not.toBeInTheDocument();
    expect(screen.getByText(second?.points[0] ?? '')).toBeInTheDocument();
  });

  it('closes the open entry when it is pressed again', () => {
    render(<Homepage />);
    const [first] = HOMEPAGE_CONTENT.experience;
    const header = screen.getByRole('button', { name: new RegExp(first?.company ?? '', 'u') });

    fireEvent.click(header);

    expect(header).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(first?.points[0] ?? '')).not.toBeInTheDocument();
  });

  it('keys on id, so the two Cricket Wireless rows open independently', () => {
    // ⚠️ `Cricket Wireless` appears twice. A company-keyed or index-keyed
    // accordion opens both at once; this is why ExperienceEntry carries `id`.
    render(<Homepage />);

    const cricket = screen.getAllByRole('button', { name: /Cricket Wireless/u });

    expect(cricket).toHaveLength(2);

    fireEvent.click(cricket[0] as HTMLElement);

    expect(cricket[0]).toHaveAttribute('aria-expanded', 'true');
    expect(cricket[1]).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Homepage — About and Contact', () => {
  it("reads 13+ years in lead roles, not the design's 10+ (D87)", () => {
    const { container } = render(<Homepage />);
    const about = container.querySelector(`#${SECTION_IDS.about}`) as HTMLElement;

    expect(within(about).getByText('13+')).toBeInTheDocument();
    expect(within(about).getByText('Years in lead & architect roles')).toBeInTheDocument();
    expect(within(about).queryByText('10+')).not.toBeInTheDocument();
  });

  it('gives Contact its single outbound pill', () => {
    const { container } = render(<Homepage />);
    const contact = container.querySelector(`#${SECTION_IDS.contact}`) as HTMLElement;
    const link = within(contact).getByRole('link', { name: /LinkedIn/u });

    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/anselm-marie/');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
