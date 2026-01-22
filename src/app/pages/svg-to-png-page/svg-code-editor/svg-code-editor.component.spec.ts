import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgCodeEditorComponent } from './svg-code-editor.component';

describe('SvgCodeEditorComponent', () => {
  let component: SvgCodeEditorComponent;
  let fixture: ComponentFixture<SvgCodeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgCodeEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgCodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
