# Contributing guide

[![English](https://img.shields.io/badge/lang-English-blue.svg)](CONTRIBUTING.md)
[![Türkçe](https://img.shields.io/badge/lang-T%C3%BCrk%C3%A7e-red.svg)](CONTRIBUTING.tr.md)

Folio is a desktop app for visual editing that keeps local Markdown files intact. Changes are reviewed together with the [open acceptance items](docs/TESLIMAT_KONTROLU.md) (Turkish).

## Local setup

Use Node.js 24 or newer and npm:

```bash
npm ci
npm run desktop
```

`npm run dev` starts the interface preview. Local file access and operating system integrations must be checked in the Electron app.

## Checking your changes

```bash
npm test
npm run build
npx playwright install chromium
npx playwright test
```

On Linux the Electron tests need a graphical session or `xvfb-run -a npx playwright test`. After building the macOS package, `node scripts/smoke-packaged.mjs` checks the real app package in a temporary, separate profile.

The `.mcp.json` file in the repository root registers the Playwright MCP server for coding assistants that support MCP. While `npm run dev` is running, the assistant can open and inspect the interface at `http://127.0.0.1:5173` with an isolated Chromium profile.

## Expected behavior

- Keep unchanged source slices of the document intact. Consider source and visual view switching and shared undo.
- Protect the user's content when saving fails or the file changes elsewhere, and never overwrite it silently.
- Never give document content access to Node, command execution or unrestricted network access.
- Cancel in visual editor dialogs must not change the document, and Apply must produce a single edit.
- Add both Turkish and English text for new interface strings.
- State the environment you ran tests in. Building a package does not replace running it on that platform.

## Pull requests

Describe the problem you solved, the behavior users will see and the related checks you ran. Say clearly if the requirements need to change. Do not add personal documents, access keys, recovery drafts or large build outputs to the repository.

## Packaging

Platform commands and signing requirements are described in the [release guide](docs/YAYINLAMA.md) (Turkish). Third-party license notices and the dependency inventory are generated during packaging. Signing keys are never kept in the repository.
