# Security Policy

## Reporting a vulnerability

Please do not open a public issue for a security problem.

Send a direct message (DM) to [@mr_chartist on Twitter/X](https://twitter.com/mr_chartist) with a short description, steps to reproduce and the affected page or file. You can also use GitHub's private vulnerability reporting on the repository, if it is enabled. We will acknowledge the report as soon as we can. This is a volunteer project, so we cannot promise a fixed response time.

## Scope

The project is a static site (HTML, CSS, JavaScript) plus GitHub Actions workflows that publish price data to a `data` branch. Relevant reports include cross-site scripting, unsafe handling of the data files, workflow or supply-chain issues, and problems with the service worker.

Wrong prices, duty rates or unit conversions are data issues, not security issues. Please use the data correction issue template for those.

## Hardening notes

- GitHub Pages does not let a project set HTTP response headers. Each page therefore carries a Content Security Policy and a referrer policy in `<meta>` tags. `frame-ancestors` (clickjacking protection) cannot be set through a meta tag, so it is not enforced.
- The site has no login, cookies or database and stores only display preferences and cached prices in the browser.
