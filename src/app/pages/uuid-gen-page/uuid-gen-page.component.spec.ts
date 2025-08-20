import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UuidGenPageComponent } from './uuid-gen-page.component';

describe('UuidGenPageComponent', () => {
  let component: UuidGenPageComponent;
  let fixture: ComponentFixture<UuidGenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UuidGenPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UuidGenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
