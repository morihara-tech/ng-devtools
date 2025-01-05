import { Directive, HostListener, inject } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: '[matTooltip]',
  standalone: true
})
export class ClickableHintIconDirective {

  private matTooltip = inject(MatTooltip);

  @HostListener('click')
  onClick() {
    this.matTooltip.toggle();
  }

}
