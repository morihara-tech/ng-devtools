import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UuidGenOutputCardComponent } from './uuid-gen-output-card.component';

describe('UuidGenOutputCardComponent', () => {
  let component: UuidGenOutputCardComponent;
  let fixture: ComponentFixture<UuidGenOutputCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UuidGenOutputCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UuidGenOutputCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
