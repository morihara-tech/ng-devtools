import { TestBed } from '@angular/core/testing';
import { BreadcrumbService } from './breadcrumb.service';

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreadcrumbService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('resolves the dashboard as a single, current Home node', () => {
    const result = service.resolve('/', { breadcrumb: { label: 'テストダッシュボード' } });
    expect(result).toEqual([
      { name: 'テストダッシュボード', routerLink: '/', isHome: true, isCurrent: true },
    ]);
  });

  it('falls back to the generic Home label when the dashboard has no breadcrumb data', () => {
    const result = service.resolve('/', {});
    expect(result.length).toBe(1);
    expect(result[0].isCurrent).toBe(true);
    expect(result[0].isHome).toBe(true);
  });

  it('resolves a menu-def tool page as Home > category > current', () => {
    const result = service.resolve('/json-formatter', {});
    expect(result.length).toBe(3);
    expect(result[0]).toEqual({ name: 'ホーム', routerLink: '/', isHome: true, isCurrent: false });
    expect(result[1].routerLink).toBeUndefined();
    expect(result[1].isCurrent).toBe(false);
    expect(result[2]).toEqual({ name: 'JSON整形', routerLink: '/json-formatter', isHome: false, isCurrent: true });
  });

  it('resolves a route-data-driven page (no parents) using breadcrumb.label', () => {
    const result = service.resolve('/guide', { breadcrumb: { label: 'ご利用ガイド' } });
    expect(result).toEqual([
      { name: 'ホーム', routerLink: '/', isHome: true, isCurrent: false },
      { name: 'ご利用ガイド', routerLink: '/guide', isHome: false, isCurrent: true },
    ]);
  });

  it('resolves a route-data-driven page with parents (e.g. article detail)', () => {
    const result = service.resolve('/articles/some-slug', {
      title: '記事タイトル',
      breadcrumb: { parents: [{ label: '記事一覧', routerLink: '/articles' }] },
    });
    expect(result).toEqual([
      { name: 'ホーム', routerLink: '/', isHome: true, isCurrent: false },
      { name: '記事一覧', routerLink: '/articles', isHome: false, isCurrent: false },
      { name: '記事タイトル', routerLink: '/articles/some-slug', isHome: false, isCurrent: true },
    ]);
  });

  it('falls back to an empty label when neither breadcrumb.label nor data.title is present', () => {
    const result = service.resolve('/unknown-route', {});
    expect(result[result.length - 1].name).toBe('');
  });
});
