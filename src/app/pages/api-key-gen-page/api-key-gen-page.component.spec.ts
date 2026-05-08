import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyGenPageComponent } from './api-key-gen-page.component';

describe('ApiKeyGenPageComponent', () => {
  let component: ApiKeyGenPageComponent;
  let fixture: ComponentFixture<ApiKeyGenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiKeyGenPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiKeyGenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
