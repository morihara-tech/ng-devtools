import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ArticlesPageComponent } from './articles-page.component';

describe('ArticlesPageComponent', () => {
  let component: ArticlesPageComponent;
  let fixture: ComponentFixture<ArticlesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('allArticles is sorted by publishedDate descending (newest first)', () => {
    const dates = component.allArticles.map((article) => article.publishedDate);
    const sortedDescending = [...dates].sort((a, b) => b.localeCompare(a));

    expect(dates).toEqual(sortedDescending);
  });

  it('articles() returns a page sliced from allArticles starting at pageIndex * pageSize', () => {
    const page = component.articles();
    const expectedStart = component.pageIndex() * component.pageSize();
    const expectedPage = component.allArticles.slice(
      expectedStart,
      expectedStart + component.pageSize(),
    );

    expect(page).toEqual(expectedPage);
  });

  it('updates pageIndex and pageSize on page change, keeping articles() consistent', () => {
    const newPageSize = component.pageSizeOptions[0];

    component.onPageChange({ pageIndex: 1, pageSize: newPageSize, length: component.allArticles.length });
    fixture.detectChanges();

    expect(component.pageIndex()).toBe(1);
    expect(component.pageSize()).toBe(newPageSize);

    const expectedStart = 1 * newPageSize;
    const expectedPage = component.allArticles.slice(expectedStart, expectedStart + newPageSize);
    expect(component.articles()).toEqual(expectedPage);
  });
});
