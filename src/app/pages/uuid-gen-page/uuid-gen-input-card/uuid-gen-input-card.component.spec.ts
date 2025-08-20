import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UuidGenInputCardComponent } from './uuid-gen-input-card.component';

describe('UuidGenInputCardComponent', () => {
  let component: UuidGenInputCardComponent;
  let fixture: ComponentFixture<UuidGenInputCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UuidGenInputCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UuidGenInputCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
