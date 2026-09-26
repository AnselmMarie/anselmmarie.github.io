# MFE Failure and Fallback Behavior

## Scope

This document covers runtime failure isolation for the TanStack Start shell and the
federated remotes it hosts: Header, Homepage, Portfolio Item, and Footer.

> **MVP note:** the Contentful integration is not part of the MVP. The
> [Contentful Failures](#contentful-failures) section below records the intended behavior
> for when that work lands; it is deferred and should not be built against in the first
> pass.

## Error Boundaries

MFE runtime failures must be isolated using React Error Boundaries owned by the TanStack
Start shell.

Do not use a federated MFE as the fallback for another MFE.

The shell should wrap each remote independently:

```text
Shell
│
├── React Error Boundary
│   └── Header MFE
│
├── React Error Boundary
│   └── Homepage MFE
│
├── React Error Boundary
│   └── Portfolio Item MFE
│
└── React Error Boundary
    └── Footer MFE
```

A runtime exception in one MFE must not crash the shell or unrelated MFEs.

## Error Boundary Ownership

Create a reusable shell-level error boundary, for example:

```text
libs/features/shell/
└── src/
    └── mfe-error-boundary/
```

**"Shell-owned" is about ownership, not directory.** The boundary and its fallbacks are
owned by the shell, consumed only by `apps/shell`, and never federated. That is the
property this document requires, and it holds whether the code sits in the shell
application or in the shell's feature library.

The error boundary should:

- Catch rendering errors from the MFE
- Prevent the error from propagating to the rest of the application
- Log useful diagnostic information
- Render an appropriate fallback UI
- Provide a retry action when appropriate
- Reset its error state when the MFE is successfully retried

Conceptually:

```tsx
<MfeErrorBoundary
  mfe="header"
  version={headerVersion}
  fallback={<HeaderFallback />}
>
  <Header />
</MfeErrorBoundary>
```

## Failure Isolation

Each MFE must fail independently.

For example:

```text
Header      → failure → Header fallback
Homepage    → success → Homepage renders
Portfolio   → success → Portfolio renders
Footer      → success → Footer renders
```

A Header failure must not cause the Homepage, Portfolio Item, Footer, routing, or
TanStack Start shell to fail.

## Loading and Runtime Failures

Treat these as separate states:

```text
Loading
   │
   ├── success → render MFE
   │
   └── failure → React Error Boundary / fallback
```

Remote loading failures, such as an unavailable `remoteEntry.js` or a failed remote chunk,
should be handled by the shell's MFE loading mechanism and ultimately rendered through the
same MFE-specific fallback strategy.

Runtime rendering errors must be caught by the React Error Boundary.

## Retry Behavior

Retries should be bounded. A failed MFE should not continuously retry in the background.

Provide a user-triggered retry where appropriate:

```text
MFE failed
    ↓
Fallback UI
    ↓
"Try again"
    ↓
Reload MFE
```

Do not implement infinite automatic retries.

## Fallback Ownership

Critical fallbacks belong to the shell:

```text
Shell
├── Header MFE
│   └── Shell-owned Header fallback
├── Homepage MFE
│   └── Shell-owned Homepage fallback
├── Portfolio Item MFE
│   └── Shell-owned Portfolio fallback
└── Footer MFE
    └── Shell-owned Footer fallback
```

Fallback components should not be federated. This prevents a fallback from depending on
another remote that could fail for the same reason.

## Fallback Strategy by MFE

Use an appropriate fallback for each MFE.

### Header

Render a minimal local header that preserves essential navigation.

### Footer

Render a minimal footer or omit the footer if it is non-critical.

### Homepage

Render a page-level error state with a retry action.

### Portfolio Item

Render a route-specific error state with navigation back to the portfolio.

## Immutable Deployment Interaction

MFE failures must not automatically cause the shell to switch to an arbitrary remote
version.

If the shell references:

```text
Header → deployment abc123
```

and that deployment fails, render the Header fallback.

Rollback should be an explicit deployment operation:

```text
Header abc123
      ↓
known-good Header xyz789
```

This keeps releases deterministic and makes rollback controllable.

## Error Reporting

When an MFE fails, capture diagnostic information including:

- MFE name
- MFE deployment/version
- Route
- Error type
- Error message
- Browser/runtime information
- Timestamp
- Correlation/request ID when available

The user should receive a clean fallback while the development/operations tooling receives
the diagnostic information.

## Contentful Failures

> **MVP note:** deferred. The Contentful work will be added after the MVP. This section
> records the intended behavior for that later phase.

Contentful failures are separate from MFE runtime failures. The TanStack Start server
layer should handle Contentful errors independently.

If cached/stale data is available, it may be used according to the application's caching
strategy.

If usable data is unavailable, return a controlled data/application error rather than
exposing Contentful credentials or implementation details to the client.

## Core Principle

> An MFE failure must be contained to the smallest possible UI boundary. React Error
> Boundaries owned by the TanStack Start shell isolate runtime failures for each remote.
> Shell-owned fallbacks remain available even when the corresponding MFE is unavailable,
> and one MFE failure must never bring down the shell or unrelated MFEs.
