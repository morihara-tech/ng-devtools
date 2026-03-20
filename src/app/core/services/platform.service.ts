import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * Abstracts browser-specific APIs (window, localStorage, sessionStorage, document)
 * to ensure safe execution in both browser and Node.js (SSG build) environments.
 */
@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    @Inject(DOCUMENT) private readonly doc: Document,
  ) {}

  /** Returns true when running in a browser environment. */
  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /** Returns the Window object, or null in non-browser environments. */
  get window(): Window | null {
    return this.isBrowser() ? (this.doc.defaultView ?? null) : null;
  }

  /** Returns the Document object (always available via the DOCUMENT token). */
  get nativeDocument(): Document {
    return this.doc;
  }

  /** Returns localStorage, or null in non-browser environments. */
  get localStorage(): Storage | null {
    return this.isBrowser() ? (this.window?.localStorage ?? null) : null;
  }

  /** Returns sessionStorage, or null in non-browser environments. */
  get sessionStorage(): Storage | null {
    return this.isBrowser() ? (this.window?.sessionStorage ?? null) : null;
  }

  /**
   * Wraps window.matchMedia and returns null in non-browser environments.
   * @param query CSS media query string
   */
  matchMedia(query: string): MediaQueryList | null {
    return this.isBrowser() ? (this.window?.matchMedia(query) ?? null) : null;
  }
}
