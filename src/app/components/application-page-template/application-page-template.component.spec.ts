import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPageTemplateComponent } from './application-page-template.component';

describe('ApplicationPageTemplateComponent', () => {
  let component: ApplicationPageTemplateComponent;
  let fixture: ComponentFixture<ApplicationPageTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationPageTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationPageTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render projected content inside the page content wrapper', () => {
    const contentWrapper: HTMLElement | null = fixture.nativeElement.querySelector('.page-content-wrapper');
    expect(contentWrapper).toBeTruthy();
  });
});
