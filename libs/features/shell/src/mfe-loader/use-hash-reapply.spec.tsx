import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useHashReapply } from './use-hash-reapply.js';

const Host = (): null => {
  useHashReapply();

  return null;
};

/** Drains the one queued animation frame the hook schedules. */
const flushFrame = (): void => {
  vi.advanceTimersByTime(32);
};

beforeEach(() => {
  vi.useFakeTimers();
  // jsdom has no rAF timing model; a timer stands in for the frame so the
  // hook's scheduling is exercised rather than stubbed out.
  vi.stubGlobal(
    'requestAnimationFrame',
    (callback: FrameRequestCallback) => setTimeout(() => callback(0), 16) as unknown as number
  );
  vi.stubGlobal('cancelAnimationFrame', (handle: number) =>
    clearTimeout(handle as unknown as ReturnType<typeof setTimeout>)
  );
  window.location.hash = '';
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('useHashReapply', () => {
  it('scrolls to the section the URL names once the remote has mounted', () => {
    // D43 — the cold deep link. The browser looked for this element before the
    // remote existed, found nothing, and will never look again.
    const target = document.createElement('section');
    target.id = 'active-projects';
    const scrollIntoView = vi.fn();
    target.scrollIntoView = scrollIntoView;
    document.body.appendChild(target);
    window.location.hash = '#active-projects';

    render(<Host />);
    flushFrame();

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('does nothing when the URL carries no hash', () => {
    const target = document.createElement('section');
    target.id = 'skills';
    const scrollIntoView = vi.fn();
    target.scrollIntoView = scrollIntoView;
    document.body.appendChild(target);

    render(<Host />);
    flushFrame();

    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('does not throw when the hash names a section that does not exist', () => {
    // A stale link, or a section id Slice 6 renamed without following the
    // contract. It must scroll nowhere, not crash the region it sits in.
    window.location.hash = '#no-such-section';

    render(<Host />);

    expect(() => flushFrame()).not.toThrow();
  });

  it('cancels its pending frame when the region unmounts', () => {
    const cancel = vi.fn();
    vi.stubGlobal('cancelAnimationFrame', cancel);
    window.location.hash = '#skills';

    const { unmount } = render(<Host />);
    unmount();

    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
