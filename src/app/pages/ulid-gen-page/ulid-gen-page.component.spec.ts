import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UlidGenPageComponent } from './ulid-gen-page.component';

describe('UlidGenPageComponent', () => {
  let component: UlidGenPageComponent;
  let fixture: ComponentFixture<UlidGenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UlidGenPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UlidGenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
