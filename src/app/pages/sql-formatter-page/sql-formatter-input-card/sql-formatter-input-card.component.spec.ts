import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlFormatterInputCardComponent } from './sql-formatter-input-card.component';

describe('SqlFormatterInputCardComponent', () => {
  let component: SqlFormatterInputCardComponent;
  let fixture: ComponentFixture<SqlFormatterInputCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlFormatterInputCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlFormatterInputCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
