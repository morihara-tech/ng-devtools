import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonFormatterOutputCardComponent } from './json-formatter-output-card.component';

describe('JsonFormatterOutputCardComponent', () => {
  let component: JsonFormatterOutputCardComponent;
  let fixture: ComponentFixture<JsonFormatterOutputCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonFormatterOutputCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonFormatterOutputCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
