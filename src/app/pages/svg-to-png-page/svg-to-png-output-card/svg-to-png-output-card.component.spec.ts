import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgToPngOutputCardComponent } from './svg-to-png-output-card.component';

describe('SvgToPngOutputCardComponent', () => {
  let component: SvgToPngOutputCardComponent;
  let fixture: ComponentFixture<SvgToPngOutputCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgToPngOutputCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgToPngOutputCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
