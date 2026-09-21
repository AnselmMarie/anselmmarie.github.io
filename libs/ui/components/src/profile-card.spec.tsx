import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ProfileCard from './profile-card.js';

describe('ProfileCard', () => {
  it('renders the name as a level-1 heading', () => {
    render(<ProfileCard name="Anselm Marie" title="Engineer" description="Summary." />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Anselm Marie');
  });

  it('renders the title and description', () => {
    render(<ProfileCard name="Anselm Marie" title="Engineer" description="Summary." />);

    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Summary.')).toBeInTheDocument();
  });
});
