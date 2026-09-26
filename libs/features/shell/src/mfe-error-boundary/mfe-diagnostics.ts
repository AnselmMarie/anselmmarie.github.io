import type { RemoteName } from '@portfolio/shared-types';

import type { MfeFailureKind } from './mfe-failure.js';

/**
 * The diagnostic payload the architecture doc's *Error Reporting* section
 * enumerates, field for field.
 *
 * ⚠️ **Shipping it to a real service is not in this plan.** It is logged to the
 * console with the full payload; the transport is the only part that is
 * stubbed, and it is stubbed at one call site so swapping it later is a single
 * edit rather than a hunt.
 */
export interface MfeDiagnostics {
  readonly mfe: RemoteName;
  readonly version: string;
  readonly route: string;
  readonly kind: MfeFailureKind;
  readonly errorType: string;
  readonly errorMessage: string;
  readonly runtime: string;
  readonly timestamp: string;
  readonly correlationId: string;
}

interface BuildMfeDiagnosticsInput {
  readonly mfe: RemoteName;
  readonly version: string;
  readonly route: string;
  readonly kind: MfeFailureKind;
  readonly error: unknown;
}

/** A thrown value is not necessarily an `Error`. Name it without assuming. */
const errorTypeOf = (error: unknown): string => {
  if (error instanceof Error) {
    return error.name;
  }

  return typeof error;
};

const errorMessageOf = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

/**
 * ⚠️ **A correlation id, not a request id.** There is no server request behind
 * a federated remote's failure — the browser fetched a chunk and it did not
 * arrive — so there is nothing upstream to correlate *to* yet. What this gives
 * is a handle that ties one fallback render to one log line when a user reports
 * "it said try again": without it, two failures of the same remote on the same
 * page are indistinguishable in the console.
 */
const correlationId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `mfe-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

const runtimeOf = (): string => {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }

  return navigator.userAgent;
};

export const buildMfeDiagnostics = ({
  mfe,
  version,
  route,
  kind,
  error,
}: BuildMfeDiagnosticsInput): MfeDiagnostics => ({
  mfe,
  version,
  route,
  kind,
  errorType: errorTypeOf(error),
  errorMessage: errorMessageOf(error),
  runtime: runtimeOf(),
  timestamp: new Date().toISOString(),
  correlationId: correlationId(),
});

/**
 * The one stubbed transport. The user gets a clean fallback; the console gets
 * every field the doc asks for.
 */
export const logMfeFailure = (diagnostics: MfeDiagnostics): void => {
  console.error(`[mfe:${diagnostics.mfe}] ${diagnostics.kind} failure`, diagnostics);
};
