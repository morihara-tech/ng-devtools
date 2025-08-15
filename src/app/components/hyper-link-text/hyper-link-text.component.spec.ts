import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HyperLinkTextComponent } from './hyper-link-text.component';

describe('HyperLinkTextComponent', () => {
  let component: HyperLinkTextComponent;
  let fixture: ComponentFixture<HyperLinkTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HyperLinkTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HyperLinkTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
