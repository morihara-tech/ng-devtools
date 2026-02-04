# GitHub Copilot Instructions

Copilot must follow these rules strictly within this repository.

## 1. General Guidelines
- **Language**: Always write code in **TypeScript** for Angular projects unless explicitly requested.
- **Framework**: Use Angular best practices and conventions.
- **Styling & Theming**: 
  - Use **SCSS** for styling.
  - **Strictly follow Angular Material (M3) theming rules.**
  - **Color Access**: Always use **Material System CSS Variables** (`--mat-sys-...`) instead of SCSS mixins or functions.
    - *Good*: `color: var(--mat-sys-on-surface);`, `background: var(--mat-sys-primary-container);`
    - *Bad*: `mat.get-theme-color(...)`, `map.get(...)`
  - **FORBIDDEN**: NEVER use hardcoded colors (e.g., `#ffffff`, `rgb(...)`) or magic font sizes.
- **File Structure**: Follow the existing file and folder structure conventions of the project.

## 2. Commit Message Rules
When generating commit messages:
- **Source of Truth**: Identify the issue number from the **active Issue context**, **Issue title**, or the **task description** provided in the workspace.
- **Format**: `refs #{number} {description}`
  - Example: `refs #123 fix login validation logic`
- **Fallback**: If the issue number is explicitly provided in the prompt, use it.
- **Restriction**: **NEVER** assume or guess the issue number from branch names alone (unless it matches the active issue context).

## 3. Clean Code & Quality Principles
- **Modern Syntax**: Always use the latest stable version syntax of the language (e.g., modern JavaScript ES6+, Python 3.10+, Java 17+).
- **Control Flow (Guard Clauses)**: Use early returns to avoid deep nesting and "else" blocks.
  - *Bad*: `if (user) { if (active) { ... } }`
  - *Good*: `if (!user) return; if (!active) return; ...`
- **Structure (DRY & SRP)**:
  - **Single Responsibility**: Functions should do one thing only. Break down large functions.
  - **DRY Principle**: Avoid code duplication. Extract repeated logic into helper functions.
- **Naming Conventions**:
  - **Descriptive**: Names must reveal intent (e.g., `isUserLoggedIn` instead of `flag` or `auth`).
  - **Avoid Generics**: Do not use generic names like `data`, `item`, or `temp`.
- **Arguments**: Keep function arguments fewer than 3. Use objects/structs for more parameters.
- **No Magic Numbers**: Replace raw numbers with named constants explaining their meaning.
- **Error Handling**: Do not swallow errors. Always handle exceptions gracefully (e.g., try-catch with logging or re-throwing).

## 4. Documentation & Comments
- **Docstrings**: Add documentation (JSDoc, Docstring, etc.) for all public functions and classes.
- **Intent over Implementation**: Comments should explain *why* the code exists, not just *what* it does.
  - *Bad*: `// increment counter` above `counter++;`
  - *Good*: `// reset counter to start a new calculation cycle`
  - Avoid comments that merely restate what the code already clearly communicates.
- **No Dead Code**: Do not leave commented-out code blocks. This includes:
  - Debug code or temporary logging statements
  - Old implementations that have been replaced
  - Code snippets from development/testing phases
  - If code is no longer needed, delete it entirely (Git history preserves it).

## 5. Testing
- **Testability**: Write code that is easy to test (avoid global state, use dependency injection where appropriate).
- **On Demand Only**: Do NOT generate unit tests or test cases unless explicitly requested by the user.
- **Suggestion**: When generating a new function or class, proactively suggest a corresponding unit test.

## 6. Security
- **No Secrets**: NEVER hardcode API keys, passwords, or tokens. Always suggest using environment variables.
- **Input Validation**: Always validate and sanitize user inputs to prevent injection attacks.
- **Dependencies**: Suggest using the latest stable versions of libraries and frameworks to avoid known vulnerabilities.
- **Sensitive Data**: Ensure sensitive data is handled securely (e.g., encryption, secure storage).

## 7. Accessibility (A11y)
- **Semantic HTML**: Always use semantic tags (`<article>`, `<nav>`, `<button>`) instead of generic `<div>` where possible.
- **Attributes**: Ensure all interactive elements have appropriate `aria-` attributes and labels.

## 8. Package Manager
- **Yarn Only**: Always use `yarn` instead of `npm` for package management.
  - Examples:
    - `yarn add <package>` instead of `npm install <package>`
    - `yarn remove <package>` instead of `npm uninstall <package>`
    - `yarn` instead of `npm install`
  - Never suggest or use `npm` commands in this repository.
