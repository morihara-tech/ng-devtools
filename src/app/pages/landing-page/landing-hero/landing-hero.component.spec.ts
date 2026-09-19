import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingHeroComponent, buildRelatedArticleCards } from './landing-hero.component';
import { provideRouter } from '@angular/router';
import { ArticleListItem } from '../../articles-page/articles-list';
import { MenuItem } from '../../../../resources/menu/def/menu-def';

describe('LandingHeroComponent', () => {
  let component: LandingHeroComponent;
  let fixture: ComponentFixture<LandingHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingHeroComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingHeroComponent);
    fixture.componentRef.setInput('dashboardLink', '/dashboard');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('buildRelatedArticleCards', () => {
  const menuItems: MenuItem[] = [
    { label: 'ULID生成', description: '', routerLink: '/ulid-generator' },
    { label: 'SVGビューアー', description: '', routerLink: '/svg-to-png' },
  ];

  function article(overrides: Partial<ArticleListItem>): ArticleListItem {
    return {
      slug: 'slug',
      routerLink: '/articles/slug',
      title: 'title',
      summary: 'summary',
      publishedDate: '2026-01-01',
      relatedTools: [],
      ...overrides,
    };
  }

  it('pairs each requested tool with the first article that references it', () => {
    const ulidArticle = article({ slug: 'ulid-order', relatedTools: ['/ulid-generator'] });
    const svgArticle = article({ slug: 'svg-png', relatedTools: ['/svg-to-png'] });

    const cards = buildRelatedArticleCards(
      [ulidArticle, svgArticle],
      menuItems,
      ['/ulid-generator', '/svg-to-png'],
    );

    expect(cards).toEqual([
      { toolLabel: 'ULID生成', toolRouterLink: '/ulid-generator', article: ulidArticle },
      { toolLabel: 'SVGビューアー', toolRouterLink: '/svg-to-png', article: svgArticle },
    ]);
  });

  it('skips a tool with no matching article (expected in local dev with no synced content)', () => {
    const cards = buildRelatedArticleCards([], menuItems, ['/ulid-generator', '/svg-to-png']);

    expect(cards).toEqual([]);
  });

  it('picks the first (newest, given pre-sorted input) matching article when several reference the same tool', () => {
    const newer = article({ slug: 'newer', relatedTools: ['/ulid-generator'] });
    const older = article({ slug: 'older', relatedTools: ['/ulid-generator'] });

    const cards = buildRelatedArticleCards([newer, older], menuItems, ['/ulid-generator']);

    expect(cards).toEqual([
      { toolLabel: 'ULID生成', toolRouterLink: '/ulid-generator', article: newer },
    ]);
  });
});
