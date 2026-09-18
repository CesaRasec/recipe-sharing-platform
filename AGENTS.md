<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Recipe Sharing Platform Project Rules

## Stack and architecture
- This project is a Next.js 16 App Router app using TypeScript and Tailwind CSS.
- Prefer Server Components by default. Only add `"use client"` when browser interactivity is required.
- Keep the main app structure under `app/` and use route-based organization instead of creating a separate pages folder.
- Respect the installed framework version in `node_modules/next/dist/docs` before relying on external knowledge or deprecated patterns.

## Coding standards
- Use clear, maintainable TypeScript with explicit types where they improve readability.
- Keep components small and focused; avoid unrelated logic in one component.
- Follow accessibility best practices: semantic HTML, labels for inputs, and keyboard-friendly interactions.
- Favor Tailwind utility classes for styling and avoid introducing custom CSS unless the design requires it.
- Use `next/image` for local image assets and keep public assets in `public/`.

## Repo-specific workflow
- Do not remove or rewrite the Next.js agent block in this file without a good reason.
- Keep the app in a clean, production-ready state: avoid dead code, unused imports, and noisy formatting.
- Validate changes with the project's commands, especially `npm run lint` and `npm run build`, before considering the work complete.
- If a feature requires additional dependencies, prefer the smallest and most standard solution compatible with the existing stack.

## Before making changes
- Inspect the relevant app route, layout, and styling files first.
- Preserve the existing app conventions and avoid broad refactors unless the task calls for them.
- Favor incremental updates and target the minimum correct fix for the current request.
