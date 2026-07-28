import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonFormatterPageComponent } from './json-formatter-page.component';

describe('JsonFormatterPageComponent', () => {
  let component: JsonFormatterPageComponent;
  let fixture: ComponentFixture<JsonFormatterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonFormatterPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonFormatterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the help section inline with an anchor link to it', () => {
    const helpLink: HTMLAnchorElement | null = fixture.nativeElement.querySelector('.margin-bottom-16 a.right');
    const helpSection: HTMLElement | null = fixture.nativeElement.querySelector('#json-formatter-help');

    expect(helpLink?.getAttribute('href')).toBe('#json-formatter-help');
    expect(helpSection).toBeTruthy();
    expect(helpSection?.querySelector('app-json-formatter-help')).toBeTruthy();
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
