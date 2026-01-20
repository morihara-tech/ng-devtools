# GitHub Copilot Instructions

Copilot must follow these rules strictly within this repository.

## 1. Branch Naming Rules
When asked to propose or create a branch, use the following format only:

- **Format**: `copilot/issue-{number}`
- **Rules**:
  - `{number}` is the related Issue number (digits only).
  - Do NOT include any description or text after the number.
  - Example: `copilot/issue-123`

## 2. Commit Message Rules
When generating commit messages, follow this specific structure:

### Format & Style
1. **Prefix**:
   - The message MUST start with `refs #{number}`.

2. **Issue Number Extraction**:
   - Extract the `{number}` from the current branch name (assuming format `copilot/issue-{number}`).

3. **Language**:
   - Write the commit message in **English**.
   - Use the imperative mood (e.g., "Add", "Fix", "Update", not "Added").

### Output Structure
- First line: `refs #{number} {Summary of changes in English}`
- Second line: (Empty)
- Third line+: Detailed description (if necessary)

### Examples
(Current branch: `copilot/issue-88`)

**Good:**
refs #88 Implement user list API endpoint

**Bad:**
feat: Implement user list API endpoint
refs #88
(Reason: "feat:" is not allowed, and "refs #" must be at the start.)

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
- **No Dead Code**: Do not leave commented-out code blocks.

## 5. Testing
- **Testability**: Write code that is easy to test (avoid global state, use dependency injection where appropriate).
- **On Demand Only**: Do NOT generate unit tests or test cases unless explicitly requested by the user.
- **Suggestion**: When generating a new function or class, proactively suggest a corresponding unit test.

## 6. Security
- **No Secrets**: NEVER hardcode API keys, passwords, or tokens. Always suggest using environment variables.
- **Input Validation**: Always validate and sanitize user inputs to prevent injection attacks.
- **Dependencies**: Suggest using the latest stable versions of libraries and frameworks to avoid known vulnerabilities
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
