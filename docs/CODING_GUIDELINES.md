# Coding Guidelines for ng-devtools

Copilot must follow these rules strictly within this repository.

## 1. General Guidelines
- **Language**: Always write code in **TypeScript** for Angular projects unless explicitly requested.
- **Framework**: Use **Angular v21** best practices and conventions.
- **Standalone Components**: Always use standalone components. Never use `NgModule` unless absolutely necessary for a third-party library integration.
- **Signals (State Management)**:
  - Use `signal()`, `computed()`, and `effect()` for all reactive state.
  - Use `input()`, `output()`, and `model()` functions instead of `@Input()` / `@Output()` decorators.
  - Use `linkedSignal()` for state derived from an input signal that can also be locally mutated.
  - Use `resource()` / `rxResource()` for async data fetching tied to signals.
  - *Good*: `readonly count = signal(0);`, `readonly double = computed(() => this.count() * 2);`
  - *Bad*: `@Input() count = 0;`, `Subject`, `BehaviorSubject` for local component state.
- **Dependency Injection**: Always use the `inject()` function. Never inject via constructor parameters.
  - *Good*: `private readonly router = inject(Router);`
  - *Bad*: `constructor(private router: Router) {}`
- **Template Control Flow**: Always use the built-in control flow syntax. Never use structural directives.
  - *Good*: `@if`, `@else`, `@for`, `@empty`, `@switch`, `@case`, `@defer`, `@placeholder`, `@loading`, `@error`
  - *Bad*: `*ngIf`, `*ngFor`, `*ngSwitch`, `NgIf`, `NgFor`, `NgSwitch`
- **Template Variables**: Use `@let` for local template variable declarations.
  - *Good*: `@let user = currentUser();`
- **Lazy Loading**: Use `@defer` blocks for deferring heavy components or content below the fold.
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

## 9. ng-devtools Specific Feature Rules
- **Tool Context Help (Drawer UI)**: When creating or scaffolding a *new tool component*, you MUST ALWAYS generate the corresponding contextual help text for the Sidenav drawer.
  - **Structure**: The help text must strictly follow a 4-section format: 1. Overview (概要), 2. How to Use (使い方), 3. Specifications/Glossary (仕様・用語解説), and 4. Use Cases (ユースケース).
  - **Length & SEO**: The "Specifications/Glossary" section must be detailed enough to explain the technical background and core concepts. The total text must be at least 500 Japanese characters to serve as a technical mini-reference and fulfill SEO/AdSense requirements.
  - **Implementation**: Place the HTML content directly inside the component's template wrapped in `<ng-template #helpContent>`. Do NOT store the text in TypeScript files.
  - **i18n**: Every text-containing HTML tag inside the help template MUST include an `i18n` attribute with a logical custom ID (e.g., `<h3 i18n="@@newToolNameHelpOverview">概要</h3>`).
  - **Writing Style for Help Text**: Describe operations based on user actions and intent, not by naming specific UI components.
    - *Bad*: "Turn on the toggle button", "Use the slider to set...", "Click the icon button"
    - *Good*: "Enable the feature", "Specify the value...", "Click the clear button"
  - **UI Label Consistency**: Help text that refers to UI elements (buttons, field labels, dropdown options, toggles, etc.) **MUST** use the exact same wording that appears on screen. For example, if a button is labelled 「変換」, the help text must say 「変換」ボタン, not 「整形」ボタン. If a dropdown option is labelled 「濃淡」, do not call it 「シェード」 in the help. Always verify the actual rendered text in the template before writing the help copy.
  - **Integration**: The component must integrate with `HelpDrawerService` to pass the `#helpContent` when the user clicks the help icon in the header.

## 10. New Page / Tool Registration Requirements

When adding a **new page or tool** to this repository, the following tasks are **mandatory** in addition to the standard implementation:

### 10.1 Guide Page (`/guide`)
- Create a dedicated **Help Component** (e.g., `ToolNameHelpComponent`) for the tool's help text following the rules in Section 9.
  - Place it in a subdirectory of the tool's page folder (e.g., `src/app/pages/tool-name-page/tool-name-help/`).
  - The help component must be a standalone component with no logic — HTML only.
- Register the help component inside the `<ng-template>` of the tool's page component.
- **Add** the help component to `guide-page.component.html` (`src/app/pages/guide-page/`) by inserting a new `<section>` block that includes `<app-tool-name-help>`.
- **Import** the help component in `guide-page.component.ts`.

### 10.2 Sitemap Component (`SitemapComponent`)
- **Add** a new `<li><a routerLink="/path">ページ名</a></li>` entry in `src/app/components/sitemap/sitemap.component.html`.
- The link must point to the canonical route path of the new page.
- The anchor text must match the page's menu label and include an `i18n` attribute with a unique ID (e.g., `@@sitemap.link.newTool`).
- Add the corresponding translation to `src/resources/texts/def/messages.en.xlf`.

### 10.3 Route Registration
- Register the new page route in `src/app/app.routes.ts`.

### 10.4 Summary Checklist (mandatory for every new page/tool)
- [ ] Help component created under tool page folder
- [ ] Help component registered in the tool's page `<ng-template>`
- [ ] Help component added to `guide-page.component.html` (new `<section>`)
- [ ] Help component imported in `guide-page.component.ts`
- [ ] Sitemap link added to `sitemap.component.html`
- [ ] Route added to `app.routes.ts`
- [ ] `yarn ng extract-i18n` run and `messages.en.xlf` updated with English translations
