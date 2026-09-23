import type { ReactElement } from 'react';

/**
 * Stands in for a federated remote module under test.
 *
 * ⚠️ **Vitest needs this even though every `import('<remote>/<Module>')` in
 * the shell is lazy.** Module Federation resolves those specifiers at runtime
 * from `REMOTE_REGISTRY`; Vite resolves them at transform time and fails the
 * whole file — not the call — when it cannot. `vi.mock` is too late, because
 * the transform has already errored.
 *
 * The alias that points the four specifiers here lives in
 * [`vitest.config.ts`](../../vitest.config.ts).
 *
 * ⚠️ **Nothing should assert on what this renders.** A spec that cares what
 * the remote draws belongs in that remote's own feature lib; the specs here
 * are about what the shell *hands* it.
 */
const FederatedModuleStub = (): ReactElement => <p data-testid="federated-stub">remote</p>;

export default FederatedModuleStub;
