import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, signal, TemplateRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { PlatformService } from '../../core/services/platform.service';
import { HelpDrawerService } from '../../services/help-drawer.service';

@Component({
  selector: 'app-application-page-template',
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    NgTemplateOutlet,
  ],
  templateUrl: './application-page-template.component.html',
  styleUrl: './application-page-template.component.scss'
})
export class ApplicationPageTemplateComponent implements OnInit, OnDestroy {
  readonly initialHelpDrawerContent = input<TemplateRef<unknown> | null>(null);

  private readonly platformService = inject(PlatformService);
  private readonly helpDrawerService = inject(HelpDrawerService);

  readonly isHelpDrawerOpen = toSignal(this.helpDrawerService.opened$, { initialValue: false });
  readonly helpDrawerContent = toSignal(this.helpDrawerService.content$, { initialValue: null });
  private readonly screenWidth = signal(this.platformService.window?.innerWidth ?? 0);

  private resizeHandler?: () => void;

  ngOnInit(): void {
    this.helpDrawerService.setContent(this.initialHelpDrawerContent());

    this.resizeHandler = () => {
      this.screenWidth.set(this.platformService.window?.innerWidth ?? 0);
    };
    this.platformService.window?.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy(): void {
    if (this.resizeHandler) {
      this.platformService.window?.removeEventListener('resize', this.resizeHandler);
    }
    this.helpDrawerService.reset();
  }

  onOpenedChange(opened: boolean): void {
    this.helpDrawerService.setOpened(opened);
  }

  onCloseHelp(): void {
    this.helpDrawerService.close();
  }

  get helpDrawerMode(): MatDrawerMode {
    return this.screenWidth() < 600 ? 'over' : 'side';
  }

  get hasBackdrop(): boolean {
    return this.helpDrawerMode === 'over';
  }
}
