import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HyperLinkTextComponent } from './hyper-link-text.component';
import { provideRouter } from '@angular/router';

describe('HyperLinkTextComponent', () => {
  let component: HyperLinkTextComponent;
  let fixture: ComponentFixture<HyperLinkTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HyperLinkTextComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HyperLinkTextComponent);
    fixture.componentRef.setInput('url', 'https://example.com');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
