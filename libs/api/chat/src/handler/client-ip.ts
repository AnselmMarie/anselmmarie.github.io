import type { LambdaFunctionURLEvent } from 'aws-lambda';

/**
 * The visitor's IP, for A5's per-IP quota.
 *
 * ⚠️ **Behind CloudFront, `sourceIp` is CloudFront's edge, not the visitor.**
 * Every visitor would share one quota row per edge. The real address is in
 * `CloudFront-Viewer-Address` (`<ip>:<port>`, IPv6 unbracketed), which Slice 4's
 * origin request policy forwards. `sourceIp` is only the fallback for a direct
 * call, which OAC (D12) makes impossible in production.
 */
export const clientIp = (
  event: Pick<LambdaFunctionURLEvent, 'headers' | 'requestContext'>
): string => {
  const viewer = event.headers['cloudfront-viewer-address'];
  const separator = viewer?.lastIndexOf(':') ?? -1;
  if (viewer && separator > 0) return viewer.slice(0, separator);
  return event.requestContext.http.sourceIp;
};
