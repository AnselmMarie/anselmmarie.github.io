import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import TagChip from './tag-chip.js';

describe('TagChip', () => {
  it('renders its label in a span by default', () => {
    render(<TagChip>React</TagChip>);

    expect(screen.getByText('React').tagName).toBe('SPAN');
  });

  it('renders the list item itself when isListItem is set', () => {
    render(
      <ul>
        <TagChip isListItem>React</TagChip>
        <TagChip isListItem>TypeScript</TagChip>
      </ul>
    );

    const items = screen.getAllByRole('listitem');

    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('React');
  });
});
