import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlFormatterPageComponent } from './sql-formatter-page.component';

describe('SqlFormatterPageComponent', () => {
  let component: SqlFormatterPageComponent;
  let fixture: ComponentFixture<SqlFormatterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlFormatterPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlFormatterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
