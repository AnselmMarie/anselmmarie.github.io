import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ChatSheet from './chat-sheet.js';

const renderSheet = (isOpen: boolean, onOpenChange = vi.fn()) =>
  render(
    <ChatSheet title="Chat" closeLabel="Close chat" isOpen={isOpen} onOpenChange={onOpenChange}>
      <p>body</p>
    </ChatSheet>
  );

describe('ChatSheet', () => {
  it('renders nothing while closed', () => {
    renderSheet(false);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders an open sheet as a dialog named by its visible title', () => {
    renderSheet(true);

    expect(screen.getByRole('dialog', { name: 'Chat' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Chat' })).toBeInTheDocument();
    expect(screen.getByText('body')).toBeInTheDocument();
  });

  it('has exactly one close control, its own labelled one', () => {
    renderSheet(true);

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Close chat' })).toBeInTheDocument();
  });

  it('asks to close when the close button is pressed', () => {
    const onOpenChange = vi.fn();
    renderSheet(true, onOpenChange);

    fireEvent.click(screen.getByRole('button', { name: 'Close chat' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('asks to close on Escape', () => {
    const onOpenChange = vi.fn();
    renderSheet(true, onOpenChange);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
