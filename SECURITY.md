# Security

This package is a React component library and does not intentionally handle credentials or server-side secrets.

## Supported Versions

The project is pre-1.0. Security fixes target the latest published version after
the first npm release. Before that release, fixes land on `main`.

If you find a security issue:

1. Do not disclose it publicly before maintainers can assess impact.
2. Open a private security advisory on GitHub if available.
3. Include reproduction steps, affected versions, and expected impact.

Do not attach tokens, private cookies, or production data to reports.

## Scope

In scope:

- package code that can expose user data, execute unexpected code, or weaken
  browser security boundaries;
- dependency vulnerabilities that affect runtime consumers;
- release or provenance issues that could publish the wrong package contents.

Out of scope:

- visual differences that do not affect confidentiality, integrity, availability,
  or accessibility;
- reports requiring leaked credentials or private production data;
- unsupported browser enhanced-refraction behavior when fallback mode remains
  readable and functional.
