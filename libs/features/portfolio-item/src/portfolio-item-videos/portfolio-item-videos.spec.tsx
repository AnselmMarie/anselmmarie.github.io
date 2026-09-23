import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItemVideos from './portfolio-item-videos.js';

const VIDEOS = [
  {
    src: 'https://www.youtube.com/embed/GdRP5EWrH9A',
    title: 'CosMikata Video 1',
    description: 'First video talks about the application in detail.',
  },
];

describe('PortfolioItemVideos', () => {
  it('embeds the YouTube url from the data and captions it', () => {
    render(<PortfolioItemVideos videos={VIDEOS} />);

    expect(screen.getByTitle('CosMikata Video 1')).toHaveAttribute('src', VIDEOS[0]?.src);
    expect(screen.getByText(VIDEOS[0]?.description ?? '')).toBeInTheDocument();
  });

  it('constrains the one third-party frame on the site', () => {
    render(<PortfolioItemVideos videos={VIDEOS} />);

    const frame = screen.getByTitle('CosMikata Video 1');

    expect(frame).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    expect(frame.getAttribute('allow')).not.toContain('camera');
    expect(frame.getAttribute('allow')).not.toContain('microphone');
  });

  it('renders nothing for the eight items with no video', () => {
    const { container } = render(<PortfolioItemVideos videos={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
