import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ChatComposer from './chat-composer.js';

const type = (text: string): void => {
  fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), { target: { value: text } });
};

const send = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Send' }));
};

describe('ChatComposer', () => {
  it('sends the trimmed text and clears the box', () => {
    const onSend = vi.fn();
    render(<ChatComposer onSend={onSend} />);

    type('  Who is he?  ');
    send();

    expect(onSend).toHaveBeenCalledWith('Who is he?');
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('');
  });

  it('sends on Enter, through the form', () => {
    const onSend = vi.fn();
    render(<ChatComposer onSend={onSend} />);

    type('Hello');
    fireEvent.submit(screen.getByRole('textbox', { name: 'Message' }));

    expect(onSend).toHaveBeenCalledWith('Hello');
  });

  it.each(['', '   '])('does not send %j', (text) => {
    const onSend = vi.fn();
    render(<ChatComposer onSend={onSend} />);

    type(text);
    send();

    expect(onSend).not.toHaveBeenCalled();
  });

  it('holds a send back while busy, and keeps the draft', () => {
    const onSend = vi.fn();
    render(<ChatComposer isBusy onSend={onSend} />);

    type('Next question');
    send();

    expect(onSend).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('Next question');
  });

  it('caps a message at 500 characters (A4)', () => {
    render(<ChatComposer onSend={vi.fn()} />);

    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveAttribute('maxlength', '500');
  });

  it('shows the drawn placeholder', () => {
    render(<ChatComposer onSend={vi.fn()} />);

    expect(screen.getByPlaceholderText('Ask something…')).toBeInTheDocument();
  });
});
