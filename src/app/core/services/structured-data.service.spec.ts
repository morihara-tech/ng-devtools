import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { StructuredDataService } from './structured-data.service';

describe('StructuredDataService', () => {
  let service: StructuredDataService;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructuredDataService);
    document = TestBed.inject(DOCUMENT);
  });

  let fixtureContainer: HTMLElement | undefined;

  afterEach(() => {
    // Ensure no leftover script tags / fixture DOM leak into other tests via the shared jsdom document.
    service.remove();
    document.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove());
    fixtureContainer?.remove();
    fixtureContainer = undefined;
  });

  function appendFaqFixture(): void {
    fixtureContainer = document.createElement('div');
    fixtureContainer.innerHTML = `
      <dl class="help-faq">
        <div class="help-faq-item">
          <dt class="help-faq-question">質問1</dt>
          <dd class="help-faq-answer">回答1</dd>
        </div>
        <div class="help-faq-item">
          <dt class="help-faq-question">質問2</dt>
          <dd class="help-faq-answer">回答2</dd>
        </div>
      </dl>
    `;
    document.body.appendChild(fixtureContainer);
  }

  describe('addFaqPageFromDom', () => {
    it('adds a FAQPage JSON-LD script whose mainEntity matches the DOM Q&A content', () => {
      appendFaqFixture();

      service.addFaqPageFromDom();

      const script = document.head.querySelector('script[type="application/ld+json"]');
      expect(script).toBeTruthy();

      const json = JSON.parse(script!.textContent ?? '{}');
      expect(json['@context']).toBe('https://schema.org');
      expect(json['@type']).toBe('FAQPage');
      expect(json.mainEntity).toEqual([
        {
          '@type': 'Question',
          'name': '質問1',
          'acceptedAnswer': { '@type': 'Answer', 'text': '回答1' },
        },
        {
          '@type': 'Question',
          'name': '質問2',
          'acceptedAnswer': { '@type': 'Answer', 'text': '回答2' },
        },
      ]);
    });

    it('does not add a script tag when there are no .help-faq-item elements', () => {
      service.addFaqPageFromDom();

      const script = document.head.querySelector('script[type="application/ld+json"]');
      expect(script).toBeFalsy();
    });
  });

  describe('remove', () => {
    it('removes both the SoftwareApplication and FAQPage script tags', () => {
      appendFaqFixture();

      service.addSoftwareApplication({
        name: 'テストツール',
        description: 'テスト用の説明',
        routerLink: '/test-tool',
      });
      service.addFaqPageFromDom();

      expect(document.head.querySelectorAll('script[type="application/ld+json"]').length).toBe(2);

      service.remove();

      expect(document.head.querySelectorAll('script[type="application/ld+json"]').length).toBe(0);
    });
  });
});
