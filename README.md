# NgDevtools

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 20.3.9.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:6200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Internationalization (i18n)

This project supports English and Japanese localization.

### Adding new messages

1. Add message text in the Japanese source file with `$localize`:
   ```typescript
   this.title = $localize`:@@page.example.title:例のタイトル`;
   ```

2. Run the extraction command to automatically update the translation files:
   ```bash
   ng extract-i18n
   ```

3. Add English translations in `src/resources/texts/def/messages.en.xlf`. The command generates a template with your new messages. Add the `<target>` tags:
   ```xml
   <unit id="page.example.title">
     <segment>
       <source>例のタイトル</source>
       <target>Example Title</target>
     </segment>
   </unit>
   ```

4. Verify there are no untranslated messages:
   ```bash
   grep -n '<target/>' src/resources/texts/def/messages.en.xlf
   ```
   
   If no output, all messages are translated. If there are results, add translations for those empty `<target/>` tags.

### Building for specific locales

- Build for all locales:
  ```bash
  ng build
  ```

- Build for Japanese only:
  ```bash
  ng build --configuration=ja
  ```

- Build for English only:
  ```bash
  ng build --configuration=en
  ```

### Supported locales

- **ja** - Japanese (default)
- **en** - English

