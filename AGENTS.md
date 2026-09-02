# Repository Guidelines

## Scope

One OpenWrt package, `luci-app-wrqr`: a Wi-Fi QR widget on LuCI's Status →
Overview page. It reads UCI and wireless runtime state on the normal status
poll and restarts nothing.

## Start of Work

- Read `docs/MAP.md` first. The whole application is `luci/overview.js` and
  `luci/shared.js`; neither is large enough to need a generated index.
- Read the sibling OpenWrt repositories' `docs/TRAPS.md` before changing LuCI
  code. The resource-cache, ACL-path and CSS-specificity traps recorded there
  apply here too, and this repository has not been audited against them.
- Run `git status -sb` and preserve unrelated changes.

## Rules

- Never restart Wi-Fi, rpcd, uhttpd or the router. The widget is read-only by
  design; a change that makes it write is out of scope.
- Omit unsupported, disabled and non-AP interfaces rather than rendering them
  in an error state.
- Grant every helper call in `luci/acl.json`. rpcd resolves a path before
  checking it, so a `/var/...` grant needs its `/tmp/...` twin.
- Never assign `window._`; shadow the translator locally or the dictionary
  leaks into every other LuCI application.
- Keep documentation neutral and free of marketing language or automation-tool
  attribution.
- Do not commit credentials, router addresses, hostnames or deployment state.

## Validation

```sh
./scripts/ci-check.sh
```

Run it before completion. `scripts/test-overview-ui.js` stubs LuCI and renders
the widget: a page that merely parses can still die at render.
