import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPageTemplateComponent } from './dashboard-page-template.component';

describe('DashboardPageTemplateComponent', () => {
  let component: DashboardPageTemplateComponent;
  let fixture: ComponentFixture<DashboardPageTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPageTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
