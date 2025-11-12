import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonFormatterPageComponent } from './json-formatter-page.component';

describe('JsonFormatterPageComponent', () => {
  let component: JsonFormatterPageComponent;
  let fixture: ComponentFixture<JsonFormatterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonFormatterPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonFormatterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
