import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import MfeErrorBoundary from './mfe-error-boundary.js';
import type { MfeFallbackProps } from './mfe-failure.js';

const Boom = ({ message }: { message: string }): ReactElement => {
  throw new Error(message);
};

const Fine = (): ReactElement => <p>the real remote</p>;

const testFallback = ({
  mfe,
  kind,
  attemptsRemaining,
  onRetry,
}: MfeFallbackProps): ReactElement => (
  <div data-testid="fallback">
    <span data-testid="kind">{kind}</span>
    <span data-testid="remaining">{attemptsRemaining}</span>
    <span data-testid="mfe">{mfe}</span>
    <button type="button" onClick={onRetry}>
      retry
    </button>
  </div>
);

const renderBoundary = (children: ReactElement, onRetry = vi.fn()) =>
  render(
    <MfeErrorBoundary
      mfe="header"
      version="abc123"
      route="/"
      attemptsRemaining={2}
      fallback={testFallback}
      onRetry={onRetry}
    >
      {children}
    </MfeErrorBoundary>
  );

beforeEach(() => {
  // React logs every caught error itself. Silencing it keeps the run readable
  // without hiding the assertions below, which check our own logging.
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('MfeErrorBoundary', () => {
  it('renders its children when nothing throws', () => {
    renderBoundary(<Fine />);

    expect(screen.getByText('the real remote')).toBeInTheDocument();
    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
  });

  it('renders the fallback instead of propagating a render failure', () => {
    // The core claim of D16: the exception stops here. If it propagated, this
    // render call would throw and the test would fail rather than assert.
    renderBoundary(<Boom message="remote exploded" />);

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.getByTestId('mfe')).toHaveTextContent('header');
  });

  it('tells the fallback how the remote failed', () => {
    renderBoundary(<Boom message="Cannot read properties of undefined" />);

    expect(screen.getByTestId('kind')).toHaveTextContent('render');
  });

  it('reports a failed import as a load failure, not a render one', () => {
    renderBoundary(<Boom message="Failed to fetch dynamically imported module" />);

    expect(screen.getByTestId('kind')).toHaveTextContent('load');
  });

  it('passes the caller-owned retry budget straight through to the fallback', () => {
    renderBoundary(<Boom message="x" />);

    expect(screen.getByTestId('remaining')).toHaveTextContent('2');
  });

  it('calls onRetry when the fallback asks for one', () => {
    const onRetry = vi.fn();
    renderBoundary(<Boom message="x" />, onRetry);

    fireEvent.click(screen.getByRole('button', { name: 'retry' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('logs the diagnostic payload and the component stack', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    renderBoundary(<Boom message="remote exploded" />);

    const diagnosticCall = spy.mock.calls.find(
      ([label]) => label === '[mfe:header] render failure'
    );

    expect(diagnosticCall).toBeDefined();
    expect(diagnosticCall?.[1]).toMatchObject({
      mfe: 'header',
      version: 'abc123',
      route: '/',
      kind: 'render',
      errorMessage: 'remote exploded',
    });
    expect(spy.mock.calls.some(([label]) => label === '[mfe:header] component stack')).toBe(true);
  });

  it('isolates one remote from another', () => {
    // Failure isolation, as the architecture doc states it: a header failure
    // must not take the homepage with it. Two boundaries, one throwing child.
    render(
      <>
        <MfeErrorBoundary
          mfe="header"
          version="v1"
          route="/"
          attemptsRemaining={1}
          fallback={testFallback}
          onRetry={vi.fn()}
        >
          <Boom message="header down" />
        </MfeErrorBoundary>
        <MfeErrorBoundary
          mfe="homepage"
          version="v1"
          route="/"
          attemptsRemaining={1}
          fallback={testFallback}
          onRetry={vi.fn()}
        >
          <Fine />
        </MfeErrorBoundary>
      </>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.getByText('the real remote')).toBeInTheDocument();
  });
});
