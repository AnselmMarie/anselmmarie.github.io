import { useHashReapply } from './use-hash-reapply.js';

/**
 * Renders nothing and exists only to be a sibling of the remote inside its
 * `Suspense` boundary (D43).
 *
 * That position is the whole design: siblings of a suspended child commit when
 * that child resolves, so mounting this component *is* the signal that the
 * remote's sections are on the page. The alternative — threading a `isReady`
 * flag out of a `lazy` factory — means setting state from a promise callback
 * during render, which is the same information obtained less safely.
 */
const MfeHashReapply = (): null => {
  useHashReapply();

  return null;
};

export default MfeHashReapply;
