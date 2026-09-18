import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingVerifiedToolsComponent } from './landing-verified-tools.component';
import { provideRouter } from '@angular/router';

describe('LandingVerifiedToolsComponent', () => {
  let component: LandingVerifiedToolsComponent;
  let fixture: ComponentFixture<LandingVerifiedToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingVerifiedToolsComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingVerifiedToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * `content/articles/` is not synced in this environment (see
   * `articles-list.ts`), so `getArticlesList()` always returns `[]` here —
   * this asserts the "0 articles → section hidden" edge case from Issue #223
   * actually renders nothing, rather than an empty heading.
   */
  it('renders no section content when there are no articles', () => {
    expect(component.articles.length).toBe(0);
    expect(fixture.nativeElement.querySelector('section.verified')).toBeNull();
  });
});
