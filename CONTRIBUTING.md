# Contributing to C-Enterprise

Thanks for your interest in improving this site!

## Requirements
- Node.js 20 LTS (see .nvmrc / .tool-versions)

## Setup
1. Install dependencies:
   npm install
2. Enable Git hooks:
   npm run prepare

## Scripts
- npm run lint — Lint JS and HTML-in-templates
- npm run lint:fix — Fix lint issues
- npm run format — Format code with Prettier
- npm run format:check — Verify formatting
- npm run typecheck — Type-check JS via TypeScript (checkJs)
- npm run validate — Run format check, lint, and typecheck

## Commit messages
- Conventional Commits (feat:, fix:, chore:, docs:, refactor:, style:, test:, build:, ci:)
- Example: feat(a11y): add focus-visible outline to links and buttons

## Pull requests
- Keep PRs small and focused
- Include a clear description and acceptance criteria
- Link any related issues
