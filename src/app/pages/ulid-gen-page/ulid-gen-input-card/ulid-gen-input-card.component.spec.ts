import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UlidGenInputCardComponent } from './ulid-gen-input-card.component';

describe('UlidGenInputCardComponent', () => {
  let component: UlidGenInputCardComponent;
  let fixture: ComponentFixture<UlidGenInputCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UlidGenInputCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UlidGenInputCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
