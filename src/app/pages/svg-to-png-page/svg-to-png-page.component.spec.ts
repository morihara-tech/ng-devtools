import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgToPngPageComponent } from './svg-to-png-page.component';

describe('SvgToPngPageComponent', () => {
  let component: SvgToPngPageComponent;
  let fixture: ComponentFixture<SvgToPngPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgToPngPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgToPngPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject a FAQPage JSON-LD script matching the rendered FAQ items', () => {
    const faqItemCount = fixture.nativeElement.querySelectorAll('.help-faq-item').length;
    expect(faqItemCount).toBe(6);

    const jsonLdScripts = Array.from(document.head.querySelectorAll('script[type="application/ld+json"]'))
      .map((el) => JSON.parse(el.textContent ?? '{}'));
    const faqJson = jsonLdScripts.find((json) => json['@type'] === 'FAQPage');

    expect(faqJson).toBeTruthy();
    expect(faqJson.mainEntity.length).toBe(faqItemCount);
  });
});
