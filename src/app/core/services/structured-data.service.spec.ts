import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StructuredDataService } from './structured-data.service';

describe('StructuredDataService', () => {
  let service: StructuredDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'ja' }],
    });
    service = TestBed.inject(StructuredDataService);
    document.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove());
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('does not emit a BreadcrumbList script for a single-node trail', () => {
    service.setBreadcrumbList([{ name: 'ホーム', routerLink: '/' }]);
    expect(document.querySelectorAll('script[type="application/ld+json"]').length).toBe(0);
  });

  it('emits a BreadcrumbList with only URL-bearing nodes, normalizing the home URL', () => {
    service.setBreadcrumbList([
      { name: 'ホーム', routerLink: '/' },
      { name: 'フォーマッター', routerLink: undefined },
      { name: 'JSON整形', routerLink: '/json-formatter' },
    ]);
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(1);
    const json = JSON.parse(scripts[0].textContent ?? '{}');
    expect(json['@type']).toBe('BreadcrumbList');
    expect(json.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://devtools.morihara.tech/ja' },
      { '@type': 'ListItem', position: 2, name: 'JSON整形', item: 'https://devtools.morihara.tech/ja/json-formatter' },
    ]);
  });

  it('replaces the previous BreadcrumbList script on repeated calls, without touching addSoftwareApplication', () => {
    service.addSoftwareApplication({ name: 'x', description: 'y', routerLink: '/x' });
    service.setBreadcrumbList([
      { name: 'ホーム', routerLink: '/' },
      { name: 'A', routerLink: '/a' },
    ]);
    service.setBreadcrumbList([
      { name: 'ホーム', routerLink: '/' },
      { name: 'B', routerLink: '/b' },
    ]);
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    expect(scripts.length).toBe(2);
    const breadcrumbScript = scripts.find((s) => s.textContent?.includes('BreadcrumbList'));
    expect(breadcrumbScript?.textContent).toContain('"name":"B"');
    service.remove();
    expect(document.querySelectorAll('script[type="application/ld+json"]').length).toBe(1);
  });
});
