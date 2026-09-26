# Decisions D107–D109

How Slice 8 deploys, decided on 2026-09-24/25 before it was built.
[decisions.md](./decisions.md) is the index.

<a id="d107"></a>
## D107 — each remote is reached through a stable pointer module; the shell is not rebuilt

**Maintainer's call, 2026-09-24.** This makes [D12](./decisions-d01-d16.md#d12) true
without the runtime `registerRemotes` path that [D55](./decisions-d55.md#d55) left unproven.

**The gap it closes.** The shell's `remotes` map in `apps/shell/vite.config.ts` is baked
in at build time. The slice file assumed the shell would read remote URLs from Lambda
environment values at runtime. It can't: the browser loads remotes from the build-time
map, and `readEnv` returns nothing in a browser anyway. With a new URL per deploy
([R12](./risks.md#r12)), every remote deploy would have meant a shell rebuild.

**The layout, in one bucket:**

```text
_remotes/<remote>/<version>/remoteEntry.js   ← the build, immutable, cached for a year
_remotes/<remote>/<version>/assets/…         ← its chunks, immutable
_remotes/<remote>/remoteEntry.js             ← the POINTER, never cached
```

- A remote is built with `base` = `…/_remotes/<remote>/<version>/`
  ([D42](./decisions-d42-d47.md#d42)); `<version>` is the commit's 12-character SHA.
- The shell is built once against the stable `…/_remotes/<remote>/remoteEntry.js`.
- **The pointer is not a copy of the entry.** ⚠️ A built `remoteEntry.js` imports its
  chunks by **relative** path (`./assets/…`), checked on 2026-09-25 against a real
  `footer` build. A copy at the stable path resolves those against the wrong directory.
  The pointer is a three-line ES module instead: it `import()`s `./<version>/remoteEntry.js`
  and re-exports `get` and `init`, the entry's only two exports.
- It forwards its own query string to the versioned entry, so
  [D106](./decisions-d106.md#d106)'s `?mf-retry=<n>` reaches past the browser's module map
  for both files.
- **Deploy** = upload the versioned build, then rewrite the pointer and invalidate that one
  path. **Rollback** = rewrite the pointer to an earlier version that is still in the
  bucket. Nothing is deleted, so every earlier version stays addressable.

**What it supersedes in the slice file:** "remote URLs supplied as Lambda environment
values and read by `libs/shared/config`". `libs/shared/config` is unchanged. R12's "let the
registry decide which version loads" becomes "let the pointer decide", and the pointer is
never cached, so the cache can't decide instead.

⚠️ **Known gap, unchanged by this:** the registry's `version` field is `dev` in the browser
(it reads `process.env`), so a browser-side error report does not name the deployed
version. Fixing that needs the pointer's version exposed to the page; not this slice.

<a id="d108"></a>
## D108 — one CloudFront distribution and one bucket; the shell's static files live in S3

**Maintainer's call, 2026-09-24.**

| Path | Origin | Cache |
|---|---|---|
| `/_remotes/*/remoteEntry.js` | S3 | disabled — the pointers |
| `/_remotes/*` | S3 | one year, immutable |
| `/assets/*`, `/remoteEntry-*.js` | S3 | one year (hashed names) |
| `/images/*` | S3 | one day (names are not hashed) |
| `/*` (default) | the shell's Lambda, via its Function URL | disabled |

- **Same origin for the page and every remote**, so there is no CORS to configure.
- ⚠️ **Nitro's `aws_lambda` preset serves no static files** (checked 2026-09-25). The
  shell's `.output/public` is uploaded to the bucket root, which is why `/assets/*`,
  `/images/*` and the shell's own hashed `remoteEntry-*.js` route to S3.
- The bucket is private and read through Origin Access Control. The Function URL uses
  `AWS_IAM` auth and is signed by CloudFront's OAC, so it can't be called directly.
- The default behavior allows GET/HEAD/OPTIONS only. The shell has no server functions
  today; the Contentful plan must revisit this if it adds any, because a POST through a
  Lambda OAC needs the client to send a payload hash.
- **Error responses are cached for 0 seconds** (400, 403, 404, 500, 502, 503, 504). With the
  pointer behavior also uncached, a retry after an origin error always reaches the origin.
  That is [D106](./decisions-d106.md#d106)'s question answered by *both* mechanisms rather
  than by putting `mf-retry` in a cache key. The live check is still Slice 8's
  verification 4.

<a id="d109"></a>
## D109 — `anselmmarie.com` and `www`, on Cloudflare DNS in "DNS only" mode; everything in `us-east-1`

**Maintainer's call, 2026-09-24/25.** Settles the domain half of
[D35](./decisions-d33-d41.md#d35).

- **Domain:** `anselmmarie.com`, plus `www.anselmmarie.com`, which a CloudFront Function
  301-redirects to the apex, keeping the path and query.
- **DNS stays at Cloudflare**, the registrar. There is no Route 53 hosted zone, so CDK
  manages no DNS records. By hand, once: the ACM validation CNAME, and a CNAME for each
  name pointing at the distribution (Cloudflare flattens the apex).
- ⚠️ **Every one of those records is grey-cloud ("DNS only"), never proxied.** A proxied
  record puts Cloudflare's cache in front of CloudFront. The pointer's no-cache rule would
  then depend on a second CDN that no deploy invalidates, which brings R12 back. Proxying
  also breaks ACM's DNS validation.
- **Region `us-east-1` for the whole stack**, because CloudFront's certificate must live
  there. One region avoids a cross-region certificate stack and a second bootstrap.
- **Account** `694951015005`, deployed locally with the `ansPortfolio` SSO profile.
  CI deploys through a GitHub OIDC role that trusts only pushes to `master` of
  `AnselmMarie/anselmmarie.github.io`. No AWS credential is stored in GitHub
  ([D10](./decisions-d01-d16.md#d10)/[D11](./decisions-d01-d16.md#d11)).
