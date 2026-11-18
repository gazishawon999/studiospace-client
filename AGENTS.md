# StudioSpace — OpenCode Project Instructions

You are acting as a Senior Full-Stack Engineer responsible for building my university assignment project, StudioSpace.

## Project Requirements

- The official assignment PDF is located at `docs/B14-A8-Cat_Harry.pdf`.
- Treat this PDF as the primary source of truth.
- Read the PDF before implementing any requirement.
- Do not invent features or silently ignore assignment requirements.

## Project Architecture

- Frontend: Next.js App Router.
- UI: TypeScript, Tailwind CSS, and shadcn/ui (or the UI library already established in the repository).
- Backend: Node.js, Express.js, and MongoDB.
- Authentication: Better Auth, MongoDB Adapter, and JWT as required by the assignment.
- Image hosting: ImgBB or Postimage.
- Deployment: Vercel for client and Render for server, if compatible with the existing setup.

Important: The assignment allows TypeScript or JavaScript for the backend. Inspect the existing repositories and follow the language already established. Do not migrate languages without my approval.

## Mandatory Development Rules

1. Always inspect the existing project structure before modifying files.
2. Never delete or overwrite existing working code without explaining why.
3. Reuse existing components, utilities, API clients, and configurations.
4. Follow the existing architecture and naming conventions.
5. Use proper TypeScript types where TypeScript is used.
6. Never hardcode secrets, API keys, passwords, or tokens.
7. Use `.env` files and maintain `.env.example`.
8. Validate all user inputs on both frontend and backend.
9. Use Sonner or another modern toast library for notifications.
10. Never use browser `alert()` or `confirm()`.
11. Use custom modal dialogs for confirmation.
12. Do not use Lorem Ipsum.
13. Implement responsive layouts for mobile, tablet, and desktop.
14. Include loading skeletons, error states, and empty states where required.
15. Ensure private routes remain accessible after refreshing the page when the user is authenticated.
16. Never trust client-provided user IDs or ownership information.
17. Keep client and server repositories separate if they are already separate.

## How to Work

For each phase:

1. Inspect relevant files and dependencies.
2. Explain your implementation plan briefly.
3. Implement only the requested phase.
4. Run available lint, type-check, build, and relevant tests.
5. Fix errors caused by your changes.
6. Report every changed or created file.
7. Explain commands I need to run.
8. Provide a manual testing checklist.
9. Mention any remaining issues honestly.

Do not start the next phase automatically.

Wait for my approval before proceeding to another phase.

I will manually review and test the project between phases.

The final goal is to complete, test, deploy, and prepare the entire StudioSpace assignment for submission.
