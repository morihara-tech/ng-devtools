import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgToPngInputCardComponent } from './svg-to-png-input-card.component';

describe('SvgToPngInputCardComponent', () => {
  let component: SvgToPngInputCardComponent;
  let fixture: ComponentFixture<SvgToPngInputCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgToPngInputCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgToPngInputCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
