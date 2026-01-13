import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonCodeEditorComponent } from './json-code-editor.component';

describe('JsonCodeEditorComponent', () => {
  let component: JsonCodeEditorComponent;
  let fixture: ComponentFixture<JsonCodeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonCodeEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonCodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
