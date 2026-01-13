import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonFormatterInputCardComponent } from './json-formatter-input-card.component';

describe('JsonFormatterInputCardComponent', () => {
  let component: JsonFormatterInputCardComponent;
  let fixture: ComponentFixture<JsonFormatterInputCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonFormatterInputCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonFormatterInputCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
