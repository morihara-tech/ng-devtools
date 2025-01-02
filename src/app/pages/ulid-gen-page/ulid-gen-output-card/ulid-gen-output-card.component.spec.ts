import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UlidGenOutputCardComponent } from './ulid-gen-output-card.component';

describe('UlidGenOutputCardComponent', () => {
  let component: UlidGenOutputCardComponent;
  let fixture: ComponentFixture<UlidGenOutputCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UlidGenOutputCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UlidGenOutputCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
