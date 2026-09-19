import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingToolCategoriesComponent } from './landing-tool-categories.component';
import { provideRouter } from '@angular/router';
import { MENU_CATEGORIES } from '../../../../resources/menu/def/menu-def';

describe('LandingToolCategoriesComponent', () => {
  let component: LandingToolCategoriesComponent;
  let fixture: ComponentFixture<LandingToolCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingToolCategoriesComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingToolCategoriesComponent);
    fixture.componentRef.setInput('categories', MENU_CATEGORIES);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a link for every tool across all categories', () => {
    const links = fixture.nativeElement.querySelectorAll('a.category__link');
    const expectedCount = MENU_CATEGORIES.reduce((sum, cat) => sum + cat.items.length, 0);
    expect(links.length).toBe(expectedCount);
  });
});
