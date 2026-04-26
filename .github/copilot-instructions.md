# GitHub Copilot Instructions

Follow the coding standards defined in `docs/CODING_GUIDELINES.md` for all code changes in this repository.

## Enforcement Rules
- Treat `docs/CODING_GUIDELINES.md` as the primary source of truth for coding style and implementation rules.
- Before generating or editing code, review and apply the relevant rules from that document.
- If there is a conflict between a user request and the guidelines, ask for clarification and explain the conflict briefly.
- Do not use tools, patterns, or syntax that violate the guidelines unless explicitly requested by the user.
- For package management commands, use Yarn only.

## Scope
- Applies to all generated code, refactoring suggestions, and command recommendations.
