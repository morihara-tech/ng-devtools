import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPageTemplateComponent } from './dashboard-page-template.component';
import { DashboardService } from '../dashboard.service';
import { provideRouter } from '@angular/router';

describe('DashboardPageTemplateComponent', () => {
  let component: DashboardPageTemplateComponent;
  let fixture: ComponentFixture<DashboardPageTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageTemplateComponent],
      providers: [DashboardService, provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPageTemplateComponent);
    const dashboardService = TestBed.inject(DashboardService);
    fixture.componentRef.setInput('api', dashboardService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
