import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApplicationPageTemplateComponent } from './application-page-template.component';
import { HelpDrawerService } from '../../services/help-drawer.service';

describe('ApplicationPageTemplateComponent', () => {
  let component: ApplicationPageTemplateComponent;
  let fixture: ComponentFixture<ApplicationPageTemplateComponent>;
  let helpDrawerService: HelpDrawerService;
  let originalInnerWidth: number;

  beforeEach(async () => {
    originalInnerWidth = window.innerWidth;

    await TestBed.configureTestingModule({
      imports: [ApplicationPageTemplateComponent]
    })
    .compileComponents();

    helpDrawerService = TestBed.inject(HelpDrawerService);
    fixture = TestBed.createComponent(ApplicationPageTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: originalInnerWidth,
    });
  });

  it('should switch drawer mode and backdrop by screen width', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 500,
    });
    window.dispatchEvent(new Event('resize'));

    expect(component.helpDrawerMode).toBe('over');
    expect(component.hasBackdrop).toBe(true);

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 800,
    });
    window.dispatchEvent(new Event('resize'));

    expect(component.helpDrawerMode).toBe('side');
    expect(component.hasBackdrop).toBe(false);
  });

  it('should reset help drawer state when destroyed', async () => {
    helpDrawerService.setOpened(true);
    helpDrawerService.setContent({} as TemplateRef<unknown>);
    fixture.destroy();

    await expect(firstValueFrom(helpDrawerService.opened$)).resolves.toBe(false);
    await expect(firstValueFrom(helpDrawerService.content$)).resolves.toBeNull();
  });
});
