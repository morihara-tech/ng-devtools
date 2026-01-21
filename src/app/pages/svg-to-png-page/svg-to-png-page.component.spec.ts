import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgToPngPageComponent } from './svg-to-png-page.component';

describe('SvgToPngPageComponent', () => {
  let component: SvgToPngPageComponent;
  let fixture: ComponentFixture<SvgToPngPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgToPngPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgToPngPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
