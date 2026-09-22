export { default as FooterFallback } from './fallbacks/footer-fallback.js';
export { default as HeaderFallback } from './fallbacks/header-fallback.js';
export { default as HomepageFallback } from './fallbacks/homepage-fallback.js';
export { default as MfeFallbackNotice } from './fallbacks/mfe-fallback-notice.js';
export { default as PortfolioItemFallback } from './fallbacks/portfolio-item-fallback.js';
export { classifyMfeFailure } from './mfe-error-boundary/classify-mfe-failure.js';
export type { MfeDiagnostics } from './mfe-error-boundary/mfe-diagnostics.js';
export { buildMfeDiagnostics, logMfeFailure } from './mfe-error-boundary/mfe-diagnostics.js';
export { default as MfeErrorBoundary } from './mfe-error-boundary/mfe-error-boundary.js';
export type { MfeFailureKind, MfeFallbackProps } from './mfe-error-boundary/mfe-failure.js';
export { MAX_MFE_RETRIES } from './mfe-error-boundary/mfe-failure.js';
export { default as MfeLoadingPlaceholder } from './mfe-loader/mfe-loading-placeholder.js';
export {
  default as MfeRemoteMount,
  REMOTE_LOAD_TIMEOUT_MS,
} from './mfe-loader/mfe-remote-mount.js';
export { default as PortfolioNotFound } from './portfolio-not-found.js';
export { default as ShellContentRegion } from './shell-content-region.js';
export { default as ShellFooterRegion } from './shell-footer-region.js';
export { default as ShellHeaderRegion } from './shell-header-region.js';
export { default as ShellLayout } from './shell-layout.js';
