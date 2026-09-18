import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingHeroComponent } from './landing-hero.component';
import { provideRouter } from '@angular/router';

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
