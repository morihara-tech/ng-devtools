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
});
