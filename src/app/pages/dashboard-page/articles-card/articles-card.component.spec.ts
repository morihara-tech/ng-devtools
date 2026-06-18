import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticlesCardComponent } from './articles-card.component';
import { provideRouter } from '@angular/router';

describe('ArticlesCardComponent', () => {
  let component: ArticlesCardComponent;
  let fixture: ComponentFixture<ArticlesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesCardComponent],
      providers: [
        provideRouter([]),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
