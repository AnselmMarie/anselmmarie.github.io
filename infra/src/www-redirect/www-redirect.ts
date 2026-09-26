import { APEX_DOMAIN, WWW_DOMAIN } from '../site-config/site-config.js';

/**
 * The CloudFront Function (runtime `cloudfront-js-2.0`) that sends `www` to the
 * apex (D109), keeping the path and query.
 *
 * ⚠️ **This is a string, not a TypeScript function**, because it runs in
 * CloudFront's own JS runtime, not Node, and CDK uploads the text verbatim. So
 * it is written in the ES5-ish subset that runtime documents: `var`, a
 * `function` declaration named `handler`, and no imports. The spec evaluates
 * this exact text in a `vm` sandbox, so the text that ships is the text tested.
 */
export const wwwRedirectSource = (): string => `
function handler(event) {
  var request = event.request;
  var host = request.headers.host ? request.headers.host.value : '';
  if (host !== '${WWW_DOMAIN}') return request;

  var parts = [];
  var query = request.querystring || {};
  for (var key in query) {
    var entry = query[key];
    var values = entry.multiValue ? entry.multiValue : [entry];
    for (var i = 0; i < values.length; i++) {
      parts.push(values[i].value === '' ? key : key + '=' + values[i].value);
    }
  }
  var search = parts.length ? '?' + parts.join('&') : '';

  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: { location: { value: 'https://${APEX_DOMAIN}' + request.uri + search } },
  };
}
`;
