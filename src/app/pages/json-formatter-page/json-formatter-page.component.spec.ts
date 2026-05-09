import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { JsonFormatterPageComponent } from './json-formatter-page.component';
import { HelpDrawerService } from '../../services/help-drawer.service';

describe('JsonFormatterPageComponent', () => {
  let component: JsonFormatterPageComponent;
  let fixture: ComponentFixture<JsonFormatterPageComponent>;
  let helpDrawerService: HelpDrawerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonFormatterPageComponent]
    })
    .compileComponents();

    helpDrawerService = TestBed.inject(HelpDrawerService);
    fixture = TestBed.createComponent(JsonFormatterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open help drawer when help button clicked', () => {
    const openSpy = vi.spyOn(helpDrawerService, 'open');
    const helpButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('.margin-bottom-16 button.right');
    helpButton?.click();

    expect(openSpy).toHaveBeenCalled();
  });
});
