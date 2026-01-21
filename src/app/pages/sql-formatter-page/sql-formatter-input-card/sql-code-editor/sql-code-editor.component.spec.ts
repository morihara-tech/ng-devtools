import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlCodeEditorComponent } from './sql-code-editor.component';

describe('SqlCodeEditorComponent', () => {
  let component: SqlCodeEditorComponent;
  let fixture: ComponentFixture<SqlCodeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlCodeEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlCodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
